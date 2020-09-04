class Resp {
  constructor(data, message) {
      if (typeof data === 'string') {
          this.message = data
          data = null
          message = null
      }
      if (data) {
          this.data = data
      }
      if (message) {
          this.message = message
      }
  }
}

class RespSuccess extends Resp {
  constructor(data, message) {
      super(data, message)
      this.errno = 0
  }
}

class RespError extends Resp {
  constructor(data, message) {
      super(data, message)
      this.errno = -1
  }
}

module.exports = {
  RespSuccess,
  RespError
}