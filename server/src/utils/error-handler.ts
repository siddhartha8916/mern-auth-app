export type ErrorStatusCodes = 400 | 401 | 403 | 404 | 429 | 500
class ErrorHandler extends Error {
  public statusCode: number

  constructor(message: string, statusCode: ErrorStatusCodes) {
    super(message)
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}

export default ErrorHandler
