/*
 * File: importExcel.js
 * Project: patrol-system
 * File Created: Monday, 21st January 2019 8:11:28 pm
 * Author: KLEN (liangchuqiang@gosuncn.com)
 * Description: http://oss.sheetjs.com/js-xlsx/
 * -----
 * Last Modified: Monday, 21st January 2019 8:58:28 pm
 * Modified By: KLEN (liangchuqiang@gosuncn.com>)
 * -----
 * Copyright 2018 - 2019 广州高新兴机器人有限公司, 广州高新兴机器人有限公司
 * -----
 */

import XLSX from 'xlsx'

const process_wb = (function() {
  const to_json = function to_json(workbook) {
    var result = {}
    workbook.SheetNames.forEach(function(sheetName) {
      var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
      if (roa.length) result[sheetName] = roa
    })
    return JSON.stringify(result, 2, 2)
  }

  const to_csv = function to_csv(workbook) {
    var result = []
    workbook.SheetNames.forEach(function(sheetName) {
      var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName])
      if (csv.length) {
        result.push('SHEET: ' + sheetName)
        result.push('')
        result.push(csv)
      }
    })
    return result.join('\n')
  }

  const to_fmla = function to_fmla(workbook) {
    var result = []
    workbook.SheetNames.forEach(function(sheetName) {
      var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName])
      if (formulae.length) {
        result.push('SHEET: ' + sheetName)
        result.push('')
        result.push(formulae.join('\n'))
      }
    })
    return result.join('\n')
  }

  const to_html = function to_html(workbook) {
    let htmlstr
    workbook.SheetNames.forEach(function(sheetName) {
      htmlstr = XLSX.write(workbook, { sheet: sheetName, type: 'string', bookType: 'html' })
    })
    return htmlstr
  }

  return function process_wb(wb, format) {
    var output = ''
    switch (format) {
      case 'form': output = to_fmla(wb); break
      case 'html': output = to_html(wb); break
      case 'json': output = to_json(wb); break
      default: output = to_csv(wb)
    }
    if (typeof console !== 'undefined') console.log('output', new Date())
    return output
  }
})()

const rABS = !!(typeof FileReader !== 'undefined' && (FileReader.prototype || {}).readAsBinaryString) // 是否将文件读取为二进制字符串
const use_worker = !!(typeof Worker !== 'undefined') // Use Web Workers

const XW = {
  /* worker message */
  msg: 'xlsx',
  /* worker scripts */
  worker: './xlsxworker.js'
}

const xw = function(data, cb, format) {
  return new Promise((resolve) => {
    const worker = new Worker(XW.worker)
    worker.onmessage = function(e) {
      switch (e.data.t) {
        case 'ready': break
        case 'e': console.error(e.data.d); break
        case XW.msg: {
          resolve(cb(JSON.parse(e.data.d), format))
          break
        }
      }
    }
    worker.postMessage({ d: data, b: rABS ? 'binary' : 'array' })
  })
}

export async function import_excel_to_json(files, format) {
  return new Promise((resolve, rekect) => {
    const f = files[0]
    const reader = new FileReader()
    let result = null
    reader.onload = function(e) {
      let data = e.target.result
      if (!rABS) data = new Uint8Array(data)
      if (use_worker) {
        resolve(xw(data, process_wb, format))
      } else {
        result = process_wb(XLSX.read(data, { type: rABS ? 'binary' : 'array' }), format)
      }
      resolve(result)
    }
    if (rABS) reader.readAsBinaryString(f)
    else reader.readAsArrayBuffer(f)
  })
}
