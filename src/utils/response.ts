type Config = {
  data?: any
  msg: string
  status: number
}

class Response {
  data?: any
  msg: string
  status: number
  constructor(config: Config) {
    const { data, msg, status } = config
    if (data) {
      this.data = data
    }
    this.msg = msg
    this.status = status
  }
}

class SuccessResponse extends Response {
  constructor({ data, status = 200, msg = '成功' } = {} as Partial<Config>) {
    super({ data, status, msg })
  }
}

class ErrorResponse extends Response {
  constructor({ data, status = 400, msg = '失败' } = {} as Partial<Config>) {
    super({ data, status, msg })
  }
}

export { SuccessResponse, ErrorResponse }
