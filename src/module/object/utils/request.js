/**
 * 异步请求拦截器 - 全局控制
 */
import axios from 'axios'
import qs from 'qs' // submit as formData for Example: a=1&b=3&c=aaa
import { Message, MessageBox } from 'element-ui'
// import store from '@index/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})
/* no-cache for every get request */
service.defaults.headers.get['Cache-Control'] = 'no-cache'
service.defaults.headers.get['Pragma'] = 'no-cache'
// request interceptor
service.interceptors.request.use(config => {
  // detect the property 'cache', add a timestamp
  if (config.hasOwnProperty('cache') && config['cache'] === false) {
    const url = config.url
    config.url = url.indexOf('?') === -1 ? url + '?_=' + (new Date()).getTime()
      : url + '&_=' + (new Date()).getTime()
  }
  // Do something before request is sent
  // if (store.getters.token) {
  //   // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  //   config.headers['token'] = getToken()
  // }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    /* 为了兼容获取摄像头类型 */
    if (res.code === 0) {
      res.ret = 1
    }
    /* 为了兼容获取地图链接，以前老版本的获取地图方法 */
    if (res.total > 0) {
      res.ret = 1
    }

    if (res.ret !== 1) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // store.dispatch('FedLogOut').then(() => {
          //   location.reload() // 为了重新实例化vue-router对象 避免bug
          // })
        })
      }
      return Promise.reject('页面访问不了啦')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    var message = null
    switch (error.code) {
      case 'ECONNABORTED':
        message = '远程连接失败，请求超时，请检测网络配置...'
        break
      default:
        message = error.message
    }
    Message({
      message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service

export function postRequest(opt) {
  return service(Object.assign(
    opt,
    {
      transformRequest: function(data) {
        for (const i in data) {
          if (Array.isArray(data[i])) {
            data[i] = JSON.stringify(data[i])
          }
        }
        return qs.stringify(data)
      }
    }
  ))
}
