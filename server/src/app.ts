import path from 'path'
import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'

const app: Express = express()

app.use(morgan('combined'))

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

// app.use('/v1', api)

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Working!' })
})

app.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' })
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

export default app
