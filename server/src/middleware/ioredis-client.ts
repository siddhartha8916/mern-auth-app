import Redis from 'ioredis'

// Define default values in case environment variables are not set
const REDIS_PORT = +(process.env.REDIS_PORT || '') || 6379 // Default Redis port
const REDIS_HOST = process.env.REDIS_HOST || 'localhost' // Default Redis host
const REDIS_USERNAME = process.env.REDIS_USERNAME || ''
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''

const redisClient = new Redis({
  enableOfflineQueue: false,
  port: REDIS_PORT,
  host: REDIS_HOST,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD
})

redisClient.on('error', (err) => {
  console.log('err', err)
})

export default redisClient
