import request from '@index/utils/request'
import qs from 'qs' // submit as formData for Example: a=1&b=3&c=aaa

export function selectSubSystemConfig(query) {
  return request({
    url: '/api/selectSubSystemConfig',
    method: 'get',
    cache: false,
    // headers: {
    //   get: {
    //     'Cache-Control': 'max-age=300',
    //     'Pragma': 'max-age=300'
    //   }
    // },
    params: query
  })
}

export function saveSubSystemConfig(data) {
  return request({
    url: '/api/saveSubSystemConfig',
    method: 'post',
    cache: false,
    data,
    transformRequest: function(data) {
      return qs.stringify(data)
    }
  })
}

export function deleteSubSystemConfig(data) {
  return request({
    url: '/api/deleteSubSystemConfig',
    method: 'post',
    data,
    transformRequest: function(data) {
      return qs.stringify(data)
    }
  })
}
