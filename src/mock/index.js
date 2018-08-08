import Mock from 'mockjs'
import loginAPI from './login'
import common from './common-controller'
import alarm from './alarm-controller'
// import articleAPI from './article'
// import remoteSearchAPI from './remoteSearch'
// import transactionAPI from './transaction'

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/api\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/api\/getRoles/, 'get', loginAPI.getUserInfo)
Mock.mock(/\/api\/selectSubSystemConfig/, 'get', common.selectSubSystemConfig)
Mock.mock(/\/api\/selectAlarmConfig/, 'get', alarm.selectAlarmConfig)

export default Mock
