/**
 * 多页面支持
 * @Description: 多页面支持
 */
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

let moduleList // 缓存多页面模块列表
const moduleRootPath = './src/module' // 模块根目录(这个可以根据自己的需求命名)

/**
 * 获取js入口数组
 */
exports.getEntries = function getEntries() {
  // 缓存js入口数组
  const entries = {}
  // 初始化模块列表
  this.getModuleList()
  // 变量模块列表
  moduleList.forEach(function(module) {
    if (module.moduleID !== '' && module.moduleJS !== '') {
      entries[module.moduleID] = ['babel-polyfill'].concat(module.moduleJS)
    }
  })
  // delete entries['index']
  return entries
}

/**
 * 获取多页面模块列表
 * @returns {模块的信息集合}
 */
exports.getModuleList = function getModuleList() {
  // 判断是否为空，不为空则直接返回
  if (moduleList) {
    return moduleList
  } else { // 为空则读取列表
    moduleList = []
    readDirSync(moduleRootPath, '')
    return moduleList
  }
}

/**
 * 深度遍历目录，并整理多页面模块
 * @param path 需要变量的路径
 * @param moduleName 模块名称
 */
function readDirSync(path, moduleName) {
  // 缓存模块对象
  const module = { moduleID: '', moduleHTML: '', moduleJS: '' }
  // 获取当前模块ID
  let moduleID = path.replace(moduleRootPath + '/', '')
  if (path === moduleRootPath) {
    moduleID = ''
  }
  module.moduleID = moduleID
  // 获取目录下所有文件及文件夹
  const pa = fs.readdirSync(path)
  pa.forEach(function(ele, index) {
    const info = fs.statSync(path + '/' + ele)
    if (info.isDirectory()) {
      readDirSync(path + '/' + ele, ele)
    } else {
      // 判断当前模块的html是否存在
      if (moduleName + '.html' === ele) {
        module.moduleHTML = path + '/' + ele
      }
      // 判断当前模块的js是否存在
      if (moduleName + '.js' === ele) {
        module.moduleJS = path + '/' + ele
      }
    }
  })
  // 判断模块是否真实(可能只是个分级目录)
  if ((module.moduleID !== '' && module.moduleHTML !== '') || (module.moduleID !== '' && module.moduleJS !== '')) {
    moduleList.push(module)
  }
}

/**
 * 获取dev的Html模板集合
 * @returns {dev的Html模板集合}
 */
exports.getDevHtmlWebpackPluginList = function getDevHtmlWebpackPluginList() {
  // console.log('*********************************** devHtmlWebpackPluginList ***********************************')
  // 缓存dev的Html模板集合
  const devHtmlWebpackPluginList = []
  // 获取多页面模块集合
  const moduleList = this.getModuleList()
  // 遍历生成模块的HTML模板
  moduleList.forEach(function(mod) {
    // 生成配置
    const conf = {
      filename: mod.moduleID + '.html',
      template: mod.moduleHTML,
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'vue-patrol-admin',
      chunks: [mod.moduleID],
      path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
    }
    // console.log(conf)
    // 添加HtmlWebpackPlugin对象
    devHtmlWebpackPluginList.push(new HtmlWebpackPlugin(conf))
  })
  // return devHtmlWebpackPluginList.slice(1)
  return devHtmlWebpackPluginList
}
// this.getDevHtmlWebpackPluginList()

/**
 * 获取prod的Html模板集合
 * @returns {prod的Html模板集合}
 */
exports.getProdHtmlWebpackPluginList = function getProdHtmlWebpackPluginList() {
  // console.log('*********************************** prodHtmlWebpackPluginList ***********************************')
  // 缓存dev的Html模板集合
  const prodHtmlWebpackPluginList = []
  // 获取多页面模块集合
  const moduleList = this.getModuleList()
  // 遍历生成模块的HTML模板


  moduleList.forEach(function(mod) {
    // 生成配置
    const chunks = ['manifest', 'vendor', 'vendor-ui', mod.moduleID]
    const conf = {
      filename: path.resolve(__dirname, '../dist/', mod.moduleID + '.html') ,
      template: mod.moduleHTML,
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'vue-patrol-admin',
      path: config.build.assetsPublicPath + config.build.assetsSubDirectory,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      // chunksSortMode: function (chunk1, chunk2) {
      //   var order1 = chunks.indexOf(chunk1.names[0])
      //   var order2 = chunks.indexOf(chunk2.names[0])
      //   return order1 - order2
      // },
      chunks
    }
    // 添加HtmlWebpackPlugin对象
    prodHtmlWebpackPluginList.push(new HtmlWebpackPlugin(conf))
  })
  // return prodHtmlWebpackPluginList.slice(1)
  return prodHtmlWebpackPluginList
}
// this.getProdHtmlWebpackPluginList()
 