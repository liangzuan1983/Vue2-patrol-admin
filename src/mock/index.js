import Mock from 'mockjs'
import loginAPI from './login'
import common from './common-controller'
import alarm from './alarm-controller'
import dataQuery from './dataQuery'

// Mock.setup({
//   timeout: '350-600'
// })

/* about login module */
Mock.mock(/\/api\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/api\/getRoles/, 'get', loginAPI.getUserInfo)

// about subSystem module
Mock.mock(/\/api\/selectSubSystemConfig/, 'get', common.selectSubSystemConfig)

// about alarm module
Mock.mock(/\/api\/selectAlarmConfig/, 'get', alarm.selectAlarmConfig)
Mock.mock(/\/api\/selectAlarmRecord/, 'get', alarm.selectAlarmRecord)

Mock.mock(/\/api\/selectPassPersonInfo/, 'get', dataQuery.selectPassPersonInfo)
Mock.mock(/\/api\/selectPersonFaceInfo/, 'get', dataQuery.selectPersonFaceInfo)
Mock.mock(/\/api\/selectCarRecordInfoByParams/, 'get', dataQuery.selectCarRecordInfoByParams)

export default Mock
