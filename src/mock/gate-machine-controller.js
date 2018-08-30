import Mock from 'mockjs'

export default {
  selectPassPersonInfo: (config) => {
    return Mock.mock({
      'ret': 1,
      'data': {
        'content|5-15': [
          {
            'cardNumber|100-1500': 1,
            'catchPic|1': [
              '',
              'src/assets/images/mock/1.jpg',
              'src/assets/images/mock/2.jpg',
              'src/assets/images/mock/3.jpg',
              'src/assets/images/mock/4.jpg'
            ],
            'enterDoorTIME': '@datetime',
            'enterPlace': '大门',
            'followNum|0-20': 1,
            'followNumOut|0-20': 1,
            'forWhat': '@name',
            'forWhatOut': '@name',
            'id|+1': 100,
            'outerDoorTIME': '@datetime',
            'outerPlace': '门岗41.89出口'
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
