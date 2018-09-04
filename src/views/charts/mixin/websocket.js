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
// const ERROR = 4
const _initWebsocket = Symbol('_initWebsocket')
const ws = Symbol('ws')

class MySocket {
  [ws] = null;

  closed = false; // close the process

  _opt = {
    url: null,
    reconnectionAttempts: 20,
    timeoutMs: 8000,
    surplusAttempts: null,
    open: null,
    error: null,
    message: null,
    close: null,
    existingWebsocket: null
  }

  constructor(opt) {
    this._opt = Object.assign({}, this._opt, opt)
    this._opt.surplusAttempts = this._opt.reconnectionAttempts
    this[_initWebsocket](this._opt.reconnectionAttempts)
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
  [_initWebsocket](surplusAttempts) {
    const { url, existingWebsocket, timeoutMs, open, error, message, close } = this._opt
    const self = this

    var hasReturned = false // Execution results for each callback
    var clock = null

    var promise = new Promise((resolve, reject) => {
      /* close the process */
      if (self.closed) {
        if (clock) {
          clearTimeout(clock)
        }
        reject()
      }
      /* open the interval for next new WebSocket */
      clock = setTimeout(function() {
        /* if had Execution results not rejectInternal */
        if (!hasReturned && !self.closed) {
          handle()
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
        self[ws] = websocket

        websocket.onopen = function() { hasReturned ? websocket.close() : handle() }
        // websocket.onclose = function() { (!hasReturned) }
        websocket.onmessage = message
        // websocket.onerror = function() { (!hasReturned) }
      } else {
        resolve(existingWebsocket)
      }

      /**
       * readyState handle
       * @param {Number} readyState : 4 on behalf of timeout
       */
      function handle(type) {
        if (surplusAttempts < 1) {
          reject()
        } else {
          const status = type || websocket.readyState
          switch (status) {
            case WebSocket.CONNECTING:
              console.info('Websocket timed out: ' + url)
              if (typeof error === 'function') {
                error.bind(self, websocket)()
              }
              if (typeof close === 'function') {
                close.bind(self, websocket)()
              }
              reconnection()
              break
            case WebSocket.OPEN:
              console.info('websocket to opened: url: ' + url)
              if (typeof open === 'function') {
                open.bind(self, websocket)()
                websocket.onclose = function() {
                  droppedReconnection.bind(self)()
                }
              }
              resolve(websocket)
              break
            case WebSocket.CLOSING:
              break
            case WebSocket.CLOSED:
              console.info('websocket error: url: ' + url)
              if (typeof error === 'function') {
                error.bind(self, websocket)()
              }
              console.info('websocket closed: url: ' + url)
              if (typeof close === 'function') {
                close.bind(self, websocket)()
              }
              reconnection()
              break
            default:
              // ERROR 4
              // reconnection()
              break
          }
        }
      }

      /**
       * ! Recursion
       */
      function reconnection() {
        if (!hasReturned) {
          hasReturned = true // had resullt ever callback
          self._opt.surplusAttempts = surplusAttempts - 1
          console.info(
            'retrying connection to websocket! url: ' +
              url +
              ', remaining retries: ' +
              (surplusAttempts - 1)
          )
          if (self.closed) {
            if (clock) {
              clearTimeout(clock)
            }
            reject()
          } else {
            self[_initWebsocket](surplusAttempts - 1).then(
              resolve,
              reject
            )
          }
        }
      }

      function droppedReconnection() {
        console.info('Websocket dropped: try to reconnect the url: ' + url)
        this._opt.surplusAttempts = this._opt.reconnectionAttempts
        this[_initWebsocket](this._opt.reconnectionAttempts)
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
    const self = this
    if (self[ws]) {
      if (self[ws].readyState === WebSocket.OPEN) {
        self[ws].send(JSON.stringify({ code, reason }))
        setTimeout(function() {
          if (self[ws].bufferedAmount === 0) {
            self[ws].close()
          }
        }, 500)
      } else {
        self[ws].close()
      }
    }
    this.closed = true
  }
}

export default {
  data() {
    return {
      ws: null,
      wsMessage: null // public param
    }
  },
  created() {
    var that = this
    /* global LOCAL_ROOT */
    const url = `ws:${LOCAL_ROOT}/websocket`
    this.ws = new MySocket({
      url,
      reconnectionAttempts: 50,
      timeoutMs: 8000,
      open: (websocket) => {
        that.$notify({
          title: '建立数据连接',
          message: '连接WebSocket成功',
          type: 'success',
          duration: 1000
        })
      },
      error(websocket) {
        that.$notify({
          title: '建立数据连接',
          message: `连接WebSocket失败/超时，正尝试(${this._opt.surplusAttempts - 1})重连...`,
          type: 'error',
          duration: 2000
        })
      },
      message: (response) => {
        that.handleWebSocket_msg(response)
      },
      close(websocket) {}
    })
  },
  methods: {
    handleWebSocket_msg(response) {
      const { returnValue, data } = response
      if (returnValue) {
        this.wsMessage = JSON.parse(data)
      }
    }
  }
}
