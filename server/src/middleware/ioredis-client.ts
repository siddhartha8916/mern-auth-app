import Redis from 'ioredis'

const redisClient = new Redis({ enableOfflineQueue: false })
redisClient.on('error', (err) => {
  console.log('err', err)
})

export default redisClient
