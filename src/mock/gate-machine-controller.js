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
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535022932784&di=95e09770ffe6c5c57ee2328571d1b8e8&imgtype=0&src=http%3A%2F%2Fs1.sinaimg.cn%2Fmw690%2F001sB7zxgy716GrSau430%26690', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534841016389&di=0c623067c4da2acbcb54bb48f09189da&imgtype=0&src=http%3A%2F%2Fs9.knowsky.com%2Fbizhi%2Fl%2F1-5000%2F2009528153927102755904.jpg',
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535038655754&di=7d72fb6c344889be5ebb5089b8c2e4bc&imgtype=0&src=http%3A%2F%2Fpic1.16pic.com%2F00%2F11%2F69%2F16pic_1169706_b.jpg',
              'http://pic.0513.org/forum/201407/23/210836pvmvjen5z6856cdw.jpg'
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
