import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/error-handler'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export default function globalErrorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error'

  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`
    err = new ErrorHandler(message, 400)
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
    err = new ErrorHandler(message, 400)
  }

  // Wrong JWT Token
  if (err.name === 'JsonWebTokenError') {
    const message = `Json Web Token is Invalid, Try again !!`
    err = new ErrorHandler(message, 400)
  }

  // Wrong JWT Expire
  if (err.name === 'TokenExpiredError') {
    const message = `Json Web Token is Expired, Try again !!`
    err = new ErrorHandler(message, 400)
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err.name
  })
  console.log('first', {
    success: false,
    message: err.message,
    error: err.name
  })
}