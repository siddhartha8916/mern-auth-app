import http from 'http'
import app from './app'

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer() {
  // await mongoConnect();
  // await loadPlanetsData();
  // await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  })
}

startServer()
