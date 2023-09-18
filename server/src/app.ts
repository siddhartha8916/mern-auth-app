import path from 'path'
import fs from 'fs'
import express, { Express, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

import globalErrorMiddleware from './middleware/error'
import ErrorHandler from './utils/error-handler'
import router from './routes'
// import rateLimiterMiddleware from './middleware/rate-limiter-middleware'

const app: Express = express()

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

app.use(helmet())
app.disable('x-powered-by')

// app.use(rateLimiterMiddleware)

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', router)

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const err = new ErrorHandler(`Requested URL ${fullUrl} doesnot exist`, 404)
  next(err)
})

//Middleware for Error
app.use(globalErrorMiddleware)

export default app
