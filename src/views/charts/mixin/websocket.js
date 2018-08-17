/**
 * TODO construct the class for mywebsocket, such as heartbeat detection
 * ! only adapt for IE > 10 and Chrome
 * @param {String} url
 * @param {Nunber} reconnectionAttempts
 * @param {Number} timeout
 * @param {Funtion} open
 * @param {Funtion} error
 * @param {Funtion} message
 */
const _initWebsocket = Symbol('_initWebsocket')
const ws = Symbol('ws')

/* eslint-disable no-unused-vars */
class MySocket {
  [ws] = null;

  closed = false;

  _opt = {
    url: null,
    reconnectionAttempts: 20,
    timeout: 8000,
    open: null,
    error: null,
    message: null,
    close: null
  }

  constructor(opt) {
    this._opt = Object.assign({}, this._opt, opt)
    this._initWebsocket()
    return this
  }

  /**
   * inits a websocket by a given url, returned promise resolves with initialized websocket, rejects after failure/timeout.
   * do not close websocket directly, otherwise an error which is "WebSocket connection to 'ws://localhost:9527/weocket' failed: WebSocket is closed before the connection is established" will be reported
   *
   * @param url the websocket url to init
   * @param existingWebsocket if passed and this passed websocket is already open, this existingWebsocket is resolved, no additional websocket is opened
   * @param timeoutMs the timeout in milliseconds for opening the websocket
   * @param numberOfRetries the number of times initializing the socket should be retried, if not specified or 0, no retries are made
   *        and a failure/timeout causes rejection of the returned promise
   * @return {Promise}
   */
  [_initWebsocket]() {
    const { url, existingWebsocket, timeoutMs, reconnectionAttempts, open, error, message, close } = this._opt
    const self = this

    var hasReturned = false // Execution results for each callback

    var promise = new Promise((resolve, reject) => {
      /* close the process */
      if (self.closed) {
        reject()
      }
      /* open the interval for next new WebSocket */
      setTimeout(function() {
        /* if had Execution results not rejectInternal */
        if (!hasReturned) {
          console.info('opening websocket timed out: ' + url)
          rejectInternal()
        }
      }, timeoutMs)
      if (
        !existingWebsocket ||
        existingWebsocket.readyState !== existingWebsocket.OPEN
      ) {
        if (existingWebsocket) {
          existingWebsocket.close()
        }
        var websocket = new WebSocket(url)
        websocket.onopen = function() {
          if (hasReturned) {
            websocket.close()
          } else {
            console.info('websocket to opened! url: ' + url)
            if (typeof open === 'function') {
              open()
            }
            resolve(websocket)
          }
        }
        websocket.onclose = function() {
          console.info('websocket closed! url: ' + url)
          if (!hasReturned) {
            setTimeout(function() {
              rejectInternal(close)
            }, timeoutMs)
          } else {
            rejectInternal(close)
          }
        }
        websocket.onmessage = message

        websocket.onerror = function() {
          console.info('websocket error! url: ' + url)
          if (!hasReturned) {
            setTimeout(function() {
              rejectInternal(error)
            }, timeoutMs)
          } else {
            rejectInternal(error)
          }
        }
      } else {
        resolve(existingWebsocket)
      }

      function rejectInternal(fn) {
        if (reconnectionAttempts <= 0) {
          reject()
        } else if (!hasReturned) {
          hasReturned = true
          if (self.closed) {
            reject()
          } else {
            if (typeof fn === 'function') {
              fn()
            }
            self._initWebsocket(url, null, timeoutMs, reconnectionAttempts - 1).then(
              resolve,
              reject
            )
          }
        }
      }
    })

    promise.then(
      function() {
        hasReturned = true
      },
      function() {
        hasReturned = true
      }
    )

    return promise
  }

  close(code, reason) {

  }
}

// var a = new MySocket()
// console.log('isLeavePage', a.isLeavePage)

export default {
  data() {
    return {
      socket: {
        /* global LOCAL_ROOT */
        url: `ws:${LOCAL_ROOT}/websocket`,
        reconnectionAttempts: 50,
        timeout: 10000
      },
      ws: null,
      wsMessage: null,
      isLeavePage: false
    }
  },
  created() {
    const { url, reconnectionAttempts, timeout } = this.socket
    const that = this
    this.isLeavePage = false

    var fn = () => {
      this.initWebsocket(url, null, timeout, reconnectionAttempts).then((websocket) => {
        that.ws = websocket
        websocket.onerror = fn
        websocket.onmessage = this.handleWebSocket_msg
      }, () => {})
    }
    fn()
    // this.initWS()
  },
  methods: {
    /**
     * inits a websocket by a given url, returned promise resolves with initialized websocket, rejects after failure/timeout.
     * do not close websocket directly, otherwise an error which is "WebSocket connection to 'ws://localhost:9527/weocket' failed: WebSocket is closed before the connection is established" will be reported
     *
     * @param url the websocket url to init
     * @param existingWebsocket if passed and this passed websocket is already open, this existingWebsocket is resolved, no additional websocket is opened
     * @param timeoutMs the timeout in milliseconds for opening the websocket
     * @param numberOfRetries the number of times initializing the socket should be retried, if not specified or 0, no retries are made
     *        and a failure/timeout causes rejection of the returned promise
     * @return {Promise}
     */
    initWebsocket(url, existingWebsocket, timeoutMs = 1500, numberOfRetries = 0) {
      var that = this
      var hasReturned = false
      var promise = new Promise((resolve, reject) => {
        if (that.isLeavePage) {
          reject()
        }
        setTimeout(function() {
          if (!hasReturned) {
            console.info('Opening websocket timed out: ' + url)
            rejectInternal()
          }
        }, timeoutMs)
        if (
          !existingWebsocket ||
          existingWebsocket.readyState !== existingWebsocket.OPEN
        ) {
          if (existingWebsocket) {
            existingWebsocket.close()
          }
          var websocket = null
          try {
            websocket = new WebSocket(url)
          } catch (err) {
            console.info(err)
          }

          websocket.onopen = function() {
            if (hasReturned) {
              websocket.close()
            } else {
              console.info('Websocket to opened! url: ' + url)
              that.$notify({
                title: '建立数据连接',
                message: '连接WebSocket成功',
                type: 'success',
                duration: 1000
              })
              resolve(websocket)
            }
          }
          websocket.onclose = function() {
            console.info('websocket closed! url: ' + url)
            if (!hasReturned) {
              setTimeout(function() {
                rejectInternal()
              }, timeoutMs)
            } else {
              rejectInternal()
            }
          }
          websocket.onerror = function() {
            console.info('websocket error! url: ' + url)
            if (!hasReturned) {
              setTimeout(function() {
                rejectInternal()
              }, timeoutMs)
            } else {
              rejectInternal()
            }
          }
        } else {
          resolve(existingWebsocket)
        }

        function rejectInternal() {
          if (numberOfRetries <= 0) {
            that.$notify({
              title: '建立数据连接',
              message: `连接WebSocket失败，请检查网络配置...`,
              type: 'error',
              duration: 10000
            })
            reject()
          } else if (!hasReturned) {
            hasReturned = true
            console.info(
              'retrying connection to websocket! url: ' +
                url +
                ', remaining retries: ' +
                (numberOfRetries - 1)
            )
            if (that.isLeavePage) {
              numberOfRetries = 0
            } else {
              that.$notify({
                title: '建立数据连接',
                message: `连接WebSocket失败/超时，正尝试(${that.socket.reconnectionAttempts - numberOfRetries + 1})重连...`,
                type: 'error',
                duration: 2000
              })
            }
            // that.initWebsocket(url, null, timeoutMs, numberOfRetries - 1).then(
            //   resolve,
            //   reject
            // )
          }
        }
      })
      promise.then(
        function() {
          hasReturned = true
        },
        function() {
          hasReturned = true
        }
      )
      return promise
    },
    handleWebSocket_msg(response) {
      const { returnValue, data } = response
      if (returnValue) {
        this.wsMessage = JSON.parse(data)
      }
    }
  },
  watch: {
    isLeavePage(val, oldVal) {
      if (val) {
        this.ws && this.ws.close()
      }
    }
  }
}
