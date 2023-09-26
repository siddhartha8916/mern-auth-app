import jwt from 'jsonwebtoken'

export const generateToken = (user: { email: string; username: string }) => {
  // Get the JWT secret from environment variables
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables')
  }

  // Create a token with the user data and the secret
  const token = jwt.sign({ email: user?.email, username: user?.username }, jwtSecret)

  return token
}
