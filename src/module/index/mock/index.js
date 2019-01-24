import Mock from 'mockjs'
import loginAPI from './login'
import common from './common-controller'
import alarm from './alarm-controller'
import dataQuery from './dataQuery'

// Mock.setup({
//   timeout: '350-600'
// })

/* about login module */
Mock.mock(/\/api\/login\b/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout\b/, 'post', loginAPI.logout)
Mock.mock(/\/api\/getRoles\b/, 'get', loginAPI.getUserInfo)

// about subSystem module
Mock.mock(/\/api\/selectSubSystemConfig\b/, 'get', common.selectSubSystemConfig)

// about alarm module
Mock.mock(/\/api\/selectAlarmConfig\b/, 'get', alarm.selectAlarmConfig)
Mock.mock(/\/api\/selectAlarm\b/, 'get', alarm.selectAlarmRecord)

Mock.mock(/\/api\/selectPassPersonInfo\b/, 'get', dataQuery.selectPassPersonInfo)
Mock.mock(/\/api\/selectPersonFaceInfo\b/, 'get', dataQuery.selectPersonFaceInfo)
Mock.mock(/\/api\/selectCarRecordInfoByParams\b/, 'get', dataQuery.selectCarRecordInfoByParams)

Mock.mock(/\/api\/selectAlarmCameraPresetConfig\b/, 'get', alarm.selectAlarmCameraPresetConfig)
Mock.mock(/\/api\/selectCameraPreset\b/, 'get', alarm.selectCameraPreset)
Mock.mock(/\/api\/updateAlarmCameraPresetConfig\b/, 'post', alarm.updateAlarmCameraPresetConfig)

export default Mock
