/**
 * alarm module API
 */
import request from '@/utils/request'
import qs from 'qs' // submit as formData for Example: a=1&b=3&c=aaa

export function selectAlarmConfig(params) {
  return request({
    url: '/api/selectAlarmConfig',
    method: 'get',
    params
  })
}

export function saveAlarmConfig(data) {
  return request({
    url: '/api/saveAlarmConfig',
    method: 'post',
    data,
    transformRequest: function(data) {
      return qs.stringify(data)
    }
  })
}

export function deleteAlarmConfig(data) {
  return request({
    url: '/api/deleteAlarmConfig',
    method: 'post',
    data,
    transformRequest: function(data) {
      return qs.stringify(data)
    }
  })
}

export function selectAlarm(params) {
  return request({
    url: '/api/selectAlarm',
    method: 'get',
    params
  })
}

