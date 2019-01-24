/* eslint-disable */
import Mock from 'mockjs'
import dashboard from './modules/dashboard'

Mock.mock(/\/api\/getDevicesGroupByStatus\b/, 'get', dashboard.getDevicesGroupByStatus)
Mock.mock(/\/api\/selectAlarm\b/, 'get', dashboard.selectAlarmRecord)
Mock.mock(/\/api\/findAllPatrolReport\b/, 'get', dashboard.findAllPatrolReport)
Mock.mock(/\/api\/searchFaceRecognitionInfo\b/, 'get', dashboard.searchFaceRecognitionInfo)
Mock.mock(/\/api\/patrolReportGroupByDay\b/, 'get', dashboard.patrolReportGroupByDay)
Mock.mock(/\/api\/findRobotStatusById\b/, 'get', dashboard.findRobotStatusById)