import request from '@index/utils/request'
import md5 from 'md5-node' // rule: the password must be encrypted with MD5
import qs from 'qs' // submit as formData for Example: a=1&b=3&c=aaa

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
    url: '/api/logout',
    method: 'delete'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/getRoles',
    method: 'get',
    params: { token }
  })
}

