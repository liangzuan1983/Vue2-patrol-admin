/**
 * alarm module API
 */
import request from '@index/utils/request'
import qs from 'qs' // submit as formData for Example: a=1&b=3&c=aaa

// 告警配置 -- 查询
export function selectAlarmConfig(params) {
  return request({
    url: '/api/selectAlarmConfig',
    method: 'get',
    params
  })
}
// 告警配置 -- 保存
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
// 告警配置 -- 删除
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

// 查询机器人的告警
export function selectAlarmRecord(params) {
  return request({
    url: '/api/selectAlarm',
    method: 'get',
    params
  })
}

// 查询 周界告警配置摄像头预置位
export function selectAlarmCameraPresetConfig(params) {
  return request({
    url: '/api/selectAlarmCameraPresetConfig',
    method: 'get',
    params
  })
}

// 周界告警配置摄像头预置位 -- update
export function updateAlarmCameraPresetConfig(data) {
  return request({
    url: '/api/updateAlarmCameraPresetConfig',
    method: 'post',
    data,
    transformRequest: function(data) {
      return qs.stringify(data)
    }
  })
}

// 查询 周界告警配置摄像头预置位
export function selectCameraPreset(params) {
  return request({
    url: '/api/selectCameraPreset',
    method: 'get',
    params
  })
}
