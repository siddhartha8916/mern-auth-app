import {
  limiterConsecutiveFailsByUsernameOrEmailAndIP,
  limiterSlowBruteByIP,
  maxConsecutiveFailsByUsernameAndIP,
  maxWrongAttemptsByIPperDay
} from '@/middleware/rate-limiters'

// Function to generate a unique key combining username and IP
const getIdentifierIPkey = (identifier: string, ip: string) => `${identifier}_${ip}`

export const checkLoginRateByUsernameOrEmailAndIPAddress = async (identifier: string, ipAddr: string) => {
  const identifierIPkey = getIdentifierIPkey(identifier, ipAddr)
  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameOrEmailAndIP.get(identifierIPkey),
    limiterSlowBruteByIP.get(ipAddr)
  ])
  let retrySecs = 0

  // Check if IP or Username + IP is already blocked
  if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1
  } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1
  }

  return { retrySecs, resUsernameAndIP, resSlowByIP }
}

export const consumeFailedAttemptForRegisteredUser = async (identifier: string, ipAddr: string) => {
  const identifierIPkey = getIdentifierIPkey(identifier, ipAddr)
  await limiterConsecutiveFailsByUsernameOrEmailAndIP.consume(identifierIPkey)
}

export const deleteFailedAttemptForRegisteredUserOnSuccessfulLogin = async (identifier: string, ipAddr: string) => {
  const identifierIPkey = getIdentifierIPkey(identifier, ipAddr)
  await limiterConsecutiveFailsByUsernameOrEmailAndIP.delete(identifierIPkey)
}

export const consumeFailedAttemptForNonRegisteredUser = async (ipAddr: string) => {
  await limiterSlowBruteByIP.consume(ipAddr)
}
