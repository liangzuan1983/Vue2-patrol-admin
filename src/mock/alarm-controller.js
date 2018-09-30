
import Mock from 'mockjs'

export default {
  selectAlarmConfig: config => {
    return Mock.mock({
      'ret': 1,
      'data': {
        'content|1-3': [
          {
            'alarmLevel|1-3': 1,
            'alarmName': '水压告警',
            'alarmPush|0-1': 0,
            'alarmType|1000-20000': 1,
            'defaultPic': 'http://localhost:9527/#/alarm-controller/alarmConfig',
            'effectiveTime': 13,
            'iconDisplay|1-3': 3,
            'id|+1': 1,
            'linkage|0-1': 0,
            'linkageDistance': 123,
            'linkageRobot|0-1': 0,
            'mustConfirm|0-1': 1
          },
          {
            'alarmLevel|1-3': 1,
            'alarmName': '高温告警',
            'alarmPush|0-1': 0,
            'alarmType|1000-20000': 1,
            'defaultPic': 'http://localhost:9527/#/alarm-controller/alarmConfig',
            'effectiveTime': 13,
            'iconDisplay|1-3': 3,
            'id+1': 4,
            'linkage|0-1': 0,
            'linkageDistance': 123,
            'linkageRobot|0-1': 0,
            'mustConfirm|0-1': 1
          },
          {
            'alarmLevel|1-3': 1,
            'alarmName': '暴雨告警',
            'alarmPush|0-1': 0,
            'alarmType|1000-20000': 1,
            'defaultPic': 'http://localhost:9527/#/alarm-controller/alarmConfig',
            'effectiveTime': 13,
            'iconDisplay|1-3': 3,
            'id|+1': 7,
            'linkage|0-1': 0,
            'linkageDistance': 123,
            'linkageRobot|0-1': 0,
            'mustConfirm|0-1': 1
          },
          {
            'alarmLevel|1-3': 1,
            'alarmName': '台风告警',
            'alarmPush|0-1': 0,
            'alarmType|1000-20000': 1,
            'defaultPic': 'http://localhost:9527/#/alarm-controller/alarmConfig',
            'effectiveTime': 13,
            'iconDisplay|1-3': 3,
            'id|+1': 10,
            'linkage|0-1': 0,
            'linkageDistance': 123,
            'linkageRobot|0-1': 0,
            'mustConfirm|0-1': 1
          }
        ]
      }
    })
  },
  selectRobotAlarm: config => {
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
