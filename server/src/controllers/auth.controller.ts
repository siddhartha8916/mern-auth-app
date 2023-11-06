import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import omit from 'lodash/omit'

import { APIResponse } from '@/types/app.types'
import catchAsyncError from '@/middleware/catch-async-error'
import AuthService from '@/services/auth.service'
import ErrorHandler from '@/utils/error-handler'
import { calculateCookieExpiration } from '@/utils/helpers'
import { generateTokenWithEmailAndUsername } from '@/utils/jwt'
import {
  checkLoginRateByUsernameOrEmailAndIPAddress,
  consumeFailedAttemptForNonRegisteredUser,
  consumeFailedAttemptForRegisteredUser,
  deleteFailedAttemptForRegisteredUserOnSuccessfulLogin
} from '@/utils/login-rate-limiter'

class AuthController {
  // Register a new user
  static register = catchAsyncError(async (req: Request, res: Response) => {
    const { email, password, username } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await AuthService.register({ email, password: hashedPassword, username })

    const token = generateTokenWithEmailAndUsername(newUser)
    const registerResponse = omit({ ...newUser, token }, ['password'])
    const cookieExpiresIn = calculateCookieExpiration(10, 'min')

    const jsonResponse: APIResponse = { status: true, message: 'User Created Successfully', data: registerResponse }
    res
      .cookie('access_token', token, {
        httpOnly: true,
        expires: cookieExpiresIn,
        path: '/'
      })
      .status(201)
      .json(jsonResponse)
  })

  // Handle user login
  static login = catchAsyncError(async (req: Request, res: Response) => {
    const errorMessage = 'Invalid Credentials'
    const { email, password, username } = req.body
    const redisIdentifierKey = email || username

    // Check for missing email or password
    if ((!email && !username) || !password) {
      throw new ErrorHandler('Missing Email or Password or Username', 404)
    }

    const { retrySecs, resUsernameAndIP } = await checkLoginRateByUsernameOrEmailAndIPAddress(
      redisIdentifierKey,
      req.ip
    )

    if (retrySecs > 0) {
      // Set Retry-After header and throw an error for rate limiting
      res.set('Retry-After', String(retrySecs))
      throw new ErrorHandler(`Too Many Requests - Retry After ${retrySecs} seconds`, 429)
    } else {
      const user = await AuthService.login(email, username)

      if (!user) {
        // Consume 1 point from limiters on wrong attempt and block if limits reached
        try {
          await consumeFailedAttemptForNonRegisteredUser(req.ip)
          throw new ErrorHandler(errorMessage, 404)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (rlRejected: any) {
          if (rlRejected instanceof Error) {
            throw rlRejected
          } else {
            const retryAfter = String(Math.round(rlRejected.msBeforeNext / 1000)) || '1'
            // Set Retry-After header and throw an error for rate limiting
            res.set('Retry-After', retryAfter)
            throw new ErrorHandler(`Too Many Requests - Retry After ${retryAfter} seconds`, 429)
          }
        }
      }
      if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '')

        if (!isPasswordCorrect) {
          // Count failed attempts by Username + IP only for registered users
          await consumeFailedAttemptForRegisteredUser(redisIdentifierKey, req.ip)
          await consumeFailedAttemptForNonRegisteredUser(req.ip)
          throw new ErrorHandler(errorMessage, 400)
        }

        if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
          // Reset on successful authorization
          await deleteFailedAttemptForRegisteredUserOnSuccessfulLogin(redisIdentifierKey, req.ip)
        }

        const token = generateTokenWithEmailAndUsername(user)
        const loginResponse = omit({ ...user, token }, ['password'])
        const cookieExpiresIn = calculateCookieExpiration(10, 'min')

        const loginJSONResponse: APIResponse = {
          status: true,
          message: 'User Logged in Successfully',
          data: loginResponse
        }
        res
          .cookie('access_token', token, {
            httpOnly: true,
            expires: cookieExpiresIn,
            path: '/'
          })
          .status(200)
          .json(loginJSONResponse)
      }
    }
  })
}

export default AuthController
