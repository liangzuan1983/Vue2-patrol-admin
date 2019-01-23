export default {
  loginByUsername: config => {
    return { 'ret': 1, 'data': { 'token': '1_d98e07bf015c47dda699b876a78637ca', 'userId': '1', 'userName': '管理员' }}
  },
  getUserInfo: config => {
    return { 'ret': 1, 'data': { 'roles': ['admin'], 'name': '管理员' }}
  },
  logout: () => 'success'
}
