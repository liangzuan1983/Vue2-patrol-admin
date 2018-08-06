import request from '@/utils/request'
import md5 from 'md5-node'
import qs from 'qs'

export function loginByUsername(username, password) {
  const login_data = {
    username,
    password: md5(password)
  }

  return request({
    url: '/api/login',
    method: 'post',
    data: qs.stringify(login_data)
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/getInfo',
    method: 'get',
    params: { token }
  })
}

