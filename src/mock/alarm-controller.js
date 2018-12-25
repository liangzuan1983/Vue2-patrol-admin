
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
  },
  selectAlarmRecord: config => {
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
  },

  selectAlarmCameraPresetConfig: config => {
    return {
      'ret': 1,
      'data': {
        'content': [
          {
            'alarmName': '高温告警',
            'cameraPresetInfo': [
              { 'cameraId': '4', 'name': '摄像头3',
                'preset': { 'presetId': '5', 'name': '预置位5' }},
              { 'cameraId': '4', 'name': '摄像头4',
                'preset': { 'presetId': '8', 'name': '预置位8' }}],
            'id': 1
          }
        ],
        'first': false,
        'last': true,
        'number': 1,
        'numberOfElements': 4,
        'size': 10,
        'sort': [
          {
            'ascending': false,
            'descending': true,
            'direction': 'DESC',
            'ignoreCase': false,
            'nullHandling': 'NATIVE',
            'property': 'id'
          }
        ],
        'totalElements': 14,
        'totalPages': 2
      }
    }
  },

  updateAlarmCameraPresetConfig: config => {
    return {
      'ret': 1,
      'msg': 'success'
    }
  },

  selectCameraPreset: config => {
    return { 'ret': 1, 'data': [
      { 'cameraId': '4', 'id': 1,
        'preset': [
          { 'cameraId': '4', 'id': 1, 'presetId': '5', 'presetName': '嗯嗯嗯' },
          { 'cameraId': '4', 'id': 2, 'presetId': '8', 'presetName': 'wer额我去额' }
        ], 'cameraName': '爱仕达' },
      { 'cameraId': '1', 'id': 2, 'preset': [{ 'cameraId': '1', 'id': 3, 'presetId': '5', 'presetName': '123' }], 'cameraName': '鹅鹅鹅' }] }
  }
}
