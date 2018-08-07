import { getQueryObject } from '@/utils'
// import querystring from 'querystring'

const userMap = {
  // admin: {
  //   roles: ['admin'],
  //   token: 'admin',
  //   introduction: '我是超级管理员',
  //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //   name: 'Super Admin'
  // },
  // editor: {
  //   roles: ['editor'],
  //   token: 'editor',
  //   introduction: '我是编辑',
  //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //   name: 'Normal Editor'
  // },
  '123456': {
    ret: 1,
    data: {
      token: '4-adsadasdasddad',
      userId: 4
    }
  },
  'token': {
    'ret': 1,
    'data': {
      'userId': 4,
      'roles': ['admin']
    }
  }
}

export default {
  loginByUsername: config => {
    const { username } = getQueryObject(config.body)
    return userMap[username]
  },
  getUserInfo: config => {
    // const { token } = param2Obj(config.url)
    if (userMap['token']) {
      return userMap['token']
    } else {
      return false
    }
  },
  logout: () => 'success'
}
