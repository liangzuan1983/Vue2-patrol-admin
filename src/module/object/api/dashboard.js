/* eslint-disable */
import request, { postRequest } from '@object/utils/request'

export function getDevicesGroupByStatus(params) {
  return request({
    url: '/api/getDevicesGroupByStatus',
    method: 'get',
    params
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

// 查询机器人的告警
export function findAllPatrolReport(params) {
  return request({
    url: '/api/findAllPatrolReport',
    method: 'get',
    params
  })
}

// 查询机器人的告警
export function searchFaceRecognitionInfo(params) {
  return request({
    url: '/api/searchFaceRecognitionInfo',
    method: 'get',
    params
  })
}

// 查询机器人的告警
export function patrolReportGroupByDay(params) {
  return request({
    url: '/api/patrolReportGroupByDay',
    method: 'get',
    params
  })
}

// 查询机器人的告警
export function findRobotStatusList(params) {
  return request({
    url: '/api/findRobotStatusList',
    method: 'get',
    params
  })
}

// 查询巡逻日报 详情
export function findPatrolReportDetail(params) {
  return request({
    url: '/api/findPatrolReportDetail',
    method: 'get',
    params
  })
}

// 查询仪表记录列表
export function searchRecordList(params) {
  return request({
    url: '/api/searchRecordList',
    method: 'get',
    params
  })
}

// 查询热成像温度列表
export function searchTemperatureRecordList(params) {
  return request({
    url: '/api/searchTemperatureRecordList',
    method: 'get',
    params
  })
}
