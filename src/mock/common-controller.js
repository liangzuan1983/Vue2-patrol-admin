import Mock from 'mockjs'
export default {
  selectSubSystemConfig(config) {
    return Mock.mock({
      'ret': 1,
      'data': {
        'content|3-10': [
          {
            'id|+1': 1,
            'systemAccount': '@name',
            'systemCode|10-1000': 1,
            'systemIp': '@ip',
            'systemName': 'robotservice',
            'systemPassword': '21232f297a57a5a743894a0e4a801fc3',
            'systemPort|5000-8000': 1
          }
        ],
        'first': true,
        'last': false,
        'number': 0,
        'numberOfElements': 5,
        'size': 5,
        'totalElements': 8,
        'totalPages': 2
      }
    })
  }
}
