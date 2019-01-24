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
export function findRobotStatusById(params) {
  return request({
    url: '/api/findRobotStatusById',
    method: 'get',
    params
  })
}
