import path from 'path'
import express, { Express, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

import globalErrorMiddleware from './middleware/error'
import ErrorHandler from './utils/error-handler'

const app: Express = express()

app.use(morgan('combined'))
app.use(helmet())
app.disable('x-powered-by')

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

// app.use('/v1', api)

// Will show public/index.html if on home route - default behaviour
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Working!' })
})

app.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' })
})

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const err = new ErrorHandler(`Requested URL ${fullUrl} doesnot exist`, 404)
  next(err)
})

//Middleware for Error
app.use(globalErrorMiddleware)

export default app
