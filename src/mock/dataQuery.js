import Mock from 'mockjs'

export default {
  selectPassPersonInfo: (config) => {
    return Mock.mock({
      'ret': 1,
      'data': {
        'content|5-15': [
          {
            'id|+1': 100,
            'name': '@name',
            'cardNumber|100-1500': 1,
            'forWhatIn': '@name',
            'sourceSystemCodeIn': '大门',
            'inTime': '@datetime',
            'forWhatOut': '@name',
            'sourceSystemCodeOut': '门岗41.89出口',
            'outTime': '@datetime',
            'catchPicIn|1': [
              '',
              'src/assets/images/mock/1.jpg',
              'src/assets/images/mock/2.jpg',
              'src/assets/images/mock/3.jpg',
              'src/assets/images/mock/4.jpg'
            ],
            'catchPicOut|1': [
              '',
              'src/assets/images/mock/1.jpg',
              'src/assets/images/mock/2.jpg',
              'src/assets/images/mock/3.jpg',
              'src/assets/images/mock/4.jpg'
            ]
          }
        ],
        'first': true,
        'last': true,
        'number': 0,
        'numberOfElements': 5,
        'size': 20,
        'sort': [{ 'ascending': false, 'descending': true, 'direction': 'DESC', 'ignoreCase': false, 'nullHandling': 'NATIVE', 'property': 'id' }],
        'totalElements': 5,
        'totalPages': 1
      }
    })
  },
  selectCaptureFacesInfo: config => {
    return Mock.mock({
      ret: 1,
      data: {
        'content|5-10': [
          {
            'id|+1': 100,
            'name': '@name',
            'category|1': [
              '白名单',
              '陌生人'
            ],
            'position': '门岗41.89出口',
            'time': '@datetime',
            'picture|1': [
              '',
              'src/assets/images/mock/1.jpg',
              'src/assets/images/mock/2.jpg',
              'src/assets/images/mock/3.jpg',
              'src/assets/images/mock/4.jpg'
            ]
          }
        ],
        'first': true,
        'last': true,
        'number': 0,
        'numberOfElements': 5,
        'size': 20,
        'sort': [{ 'ascending': false, 'descending': true, 'direction': 'DESC', 'ignoreCase': false, 'nullHandling': 'NATIVE', 'property': 'id' }],
        'totalElements': 5,
        'totalPages': 1
      }
    })
  },
  selectCarRecordInfoByParams: config => {
    return Mock.mock({
      ret: 1,
      data: {
        'content|5-10': [
          {
            'id|+1': 100,
            'carNumber|100-1500': 1,
            'carType|0-41': 1,
            'position': '门岗41.89出口',
            'captureTime': '@datetime',
            'capturePic|1': [
              '',
              'src/assets/images/mock/1.jpg',
              'src/assets/images/mock/2.jpg',
              'src/assets/images/mock/3.jpg',
              'src/assets/images/mock/4.jpg'
            ]
          }
        ],
        'first': true,
        'last': true,
        'number': 0,
        'numberOfElements': 5,
        'size': 20,
        'sort': [{ 'ascending': false, 'descending': true, 'direction': 'DESC', 'ignoreCase': false, 'nullHandling': 'NATIVE', 'property': 'id' }],
        'totalElements': 5,
        'totalPages': 1
      }
    })
  }
}
