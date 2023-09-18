import { RateLimiterRedis } from 'rate-limiter-flexible'
import redisClient from './ioredis-client'
import { NextFunction, Request, Response } from 'express'

// Maximum allowed wrong attempts per IP per day
export const maxWrongAttemptsByIPperDay = 5

// Maximum allowed consecutive fails by username and IP
export const maxConsecutiveFailsByUsernameAndIP = 10

// Maximum allowed consecutive requests per IP per second
const maxConsecutiveLimitPerIP = 10

// Rate limiter for blocking IP after too many wrong attempts
export const limiterSlowBruteByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24, // 1 day in seconds
  blockDuration: 60 * 60 * 24 // Block for 1 day, if 100 wrong attempts per day
})

// Rate limiter for blocking username and IP after consecutive failures
export const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60 // Block for 1 hour
})

// Rate limiter for limiting consecutive requests per IP
const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'max-consecutive-limit-per-IP',
  points: maxConsecutiveLimitPerIP, // Number of points
  duration: 1 // Per second
})

// Middleware to rate limit requests per IP
export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  rateLimiterRedis
    .consume(req.ip) // Consume a point for the requesting IP
    .then(() => {
      next() // Continue to the next middleware or route handler
    })
    .catch(() => {
      res.status(429).send('Too Many Requests') // Send a "Too Many Requests" response if the rate limit is exceeded
    })
}
