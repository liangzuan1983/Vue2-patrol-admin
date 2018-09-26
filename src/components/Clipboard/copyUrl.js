import Vue from 'vue'
import clip from '@/utils/clipboard'
const copyUrl = Vue.component('copyUrl', {
  functional: true,
  props: {
    text: {
      type: String,
      required: true
    }
  },
  render(createElement, context) {
    const h = createElement
    const key = Date.now()
    return h('div', null, [
      h('span', null, '客户端暂不支持Excel表格导出，请复制相关URL到最新版Chrome或者IE下操作 '),
      h('el-input', {
        style: 'margin-top: 10px;',
        attrs: {
          placeholder: 'Please input',
          value: context.props.text,
          autofocus: 'autofocus',
          id: 'copy' + key
        },
        on: {
          focus: (event) => { event.target && event.target.select() }
        }}, [
        h('el-button', {
          slot: 'append',
          attrs: {
            'data-clipboard-target': '#copy' + key
          },
          on: {
            click: event => { clip(null, event) }
          }
        }, [
          '复制'
        ])
      ])
    ])
  }
})

export default copyUrl
