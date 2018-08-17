
import Mock from 'mockjs'

export default {
  selectAlarmConfig: config => {
    return { 'ret': 1, 'data': { 'content': [{ 'alarmLevel': 3, 'alarmName': '人多', 'alarmPush': 0, 'alarmType': 123123, 'defaultPic': 'http://localhost:9527/#/alarm-controller/alarmConfig', 'effectiveTime': 13, 'iconDisplay': 3, 'id': 11, 'linkage': 0, 'linkageDistance': 123, 'linkageRobot': 0, 'mustConfirm': 1 }, { 'alarmLevel': 3, 'alarmName': '冒水', 'alarmPush': 1, 'alarmType': 123, 'defaultPic': 'http://192.168.41.89:9527/#/alarm-controller/alarmConfig', 'effectiveTime': 123, 'iconDisplay': 3, 'id': 10, 'linkage': 0, 'linkageDistance': 123, 'linkageRobot': 1, 'mustConfirm': 1 }, { 'alarmLevel': 2, 'alarmName': '火灾', 'alarmPush': 0, 'alarmType': 1002, 'defaultPic': 'http://192.168.41.89:9527/#/alarm-controller/alarmConfig', 'effectiveTime': 120211, 'iconDisplay': 2, 'id': 9, 'linkage': 1, 'linkageDistance': 11212, 'linkageRobot': 0, 'mustConfirm': 1 }, { 'alarmLevel': 1, 'alarmName': '207', 'alarmPush': 1, 'alarmType': 207, 'effectiveTime': 36000, 'iconDisplay': 1, 'id': 7, 'linkage': 1, 'linkageDistance': 2, 'linkageRobot': 1, 'mustConfirm': 1 }, { 'alarmLevel': 2, 'alarmName': '315', 'alarmPush': 1, 'alarmType': 315, 'defaultPic': 'www.baidu.com', 'effectiveTime': 864000, 'iconDisplay': 1, 'id': 6, 'linkage': 1, 'linkageDistance': 12, 'linkageRobot': 1, 'mustConfirm': 1 }], 'first': true, 'last': true, 'number': 0, 'numberOfElements': 5, 'size': 10, 'sort': [{ 'ascending': false, 'descending': true, 'direction': 'DESC', 'ignoreCase': false, 'nullHandling': 'NATIVE', 'property': 'id' }], 'totalElements': 5, 'totalPages': 1 }}
  },
  selectAlarm: config => {
    return Mock.mock({
      'ret': 1,
      'data': {
        'content|5-15': [
          {
            'alarmBeginTime': '@datetime',
            'alarmEndTime': '@datetime',
            'alarmLevel|1-3': 1,
            'alarmName|1': ['高温告警', '水压告警', '暴雨告警', '台风告警', '防爆告警'],
            'alarmType|200-1000': 201,
            'alarmValue': '37.6℃',
            'confirmComment': '@name',
            'deviceId|+1': 10,
            'id|+1': 100,
            'sn': /[a-zA-Z]{3,8}-[\d]{1,2}\d\.[\d]{1,3}\.[\d]{1,3}/,
            'sourceAlarmId|1000-10000': 8494,
            'sourceSystemCode': '机器人系统2021',
            'longitude|113.14': 113.461,
            'latitude|23.15': 23.181
          }
        ]
      }
    })
  }
}
