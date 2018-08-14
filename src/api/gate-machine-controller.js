import request from '@/utils/request'

export function selectPassPersonInfo(params) {
  return request({
    url: '/api/selectPassPersonInfo',
    method: 'get',
    params
  })
}
