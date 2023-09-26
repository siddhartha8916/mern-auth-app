import http from 'http'
import app from './app'
import 'dotenv/config'

const PORT = process.env.PORT || 8000

const server = http.createServer(
  {
    // requestTimeout: 60000
  },
  app
)

// ================== Prevent Denial of Service of HTTP server ==================
server.headersTimeout = 500
server.requestTimeout = 500
server.timeout = 500
server.keepAliveTimeout = 500

async function startServer() {
  // await mongoConnect();
  // await loadPlanetsData();
  // await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  })
}

startServer()
