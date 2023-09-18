import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import omit from 'lodash/omit'

import { APIResponse } from '@/types/app.types'
import catchAsyncError from '@/middleware/catch-async-error'
import AuthService from '@/services/auth.service'
import {
  limiterConsecutiveFailsByUsernameAndIP,
  limiterSlowBruteByIP,
  maxConsecutiveFailsByUsernameAndIP,
  maxWrongAttemptsByIPperDay
} from '@/middleware/rate-limiters'
import ErrorHandler from '@/utils/error-handler'

const getUsernameIPkey = (username: string, ip: string) => `${username}_${ip}`

class AuthController {
  static register = catchAsyncError(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await AuthService.register({ email, password: hashedPassword })

    const registerResponse = omit({ ...newUser }, ['password'])

    const jsonResponse: APIResponse = { status: true, message: 'User Created Successfully', data: registerResponse }
    res.status(201).json(jsonResponse)
  })

  static login = catchAsyncError(async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
      throw new ErrorHandler('Missing Email or Password', 404)
    }
    const errorMessage = 'Invalid Credentials'

    const ipAddr = req.ip
    const usernameIPkey = getUsernameIPkey(req.body.email, ipAddr)

    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
      limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
      limiterSlowBruteByIP.get(ipAddr)
    ])

    let retrySecs = 0

    // Check if IP or Username + IP is already blocked
    if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
      retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1
    } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
      retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1
    }

    if (retrySecs > 0) {
      res.set('Retry-After', String(retrySecs))
      const jsonResponse: APIResponse = {
        status: false,
        message: 'Too Many Requests'
      }
      res.status(429).json(jsonResponse)
    } else {
      const user = await AuthService.login(email)

      if (!user) {
        // Consume 1 point from limiters on wrong attempt and block if limits reached
        try {
          await limiterSlowBruteByIP.consume(ipAddr)
          throw new ErrorHandler(errorMessage, 404)

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (rlRejected: any) {
          if (rlRejected instanceof Error) {
            throw rlRejected
          } else {
            res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || '1')
            const jsonResponse: APIResponse = {
              status: false,
              message: 'Too Many Requests'
            }
            res.status(429).json(jsonResponse)
          }
        }
      }
      if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '')

        if (!isPasswordCorrect) {
          // Count failed attempts by Username + IP only for registered users
          await limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey)
          throw new ErrorHandler(errorMessage, 400)
        }

        if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
          // Reset on successful authorisation
          await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey)
        }

        const loginResponse = omit({ ...user }, ['password'])

        const jsonResponse: APIResponse = { status: true, message: 'User Logged in Successfully', data: loginResponse }
        res.status(201).json(jsonResponse)
      }
    }
  })
}

export default AuthController