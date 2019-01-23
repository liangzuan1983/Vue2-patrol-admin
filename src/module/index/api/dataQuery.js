import request from '@index/utils/request'

export function selectPassPersonInfo(params) {
  return request({
    url: '/api/selectPassPersonInfo',
    method: 'get',
    cache: false,
    params
  })
}

export function selectCaptureFacesInfo(params) {
  return request({
    url: '/api/selectPersonFaceInfo',
    method: 'get',
    cache: false,
    params
  })
}

export function selectCarRecordInfoByParams(params) {
  return request({
    url: '/api/selectCarRecordInfoByParams',
    method: 'get',
    cache: false,
    params
  })
}
