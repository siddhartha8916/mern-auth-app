import { PrismaClient } from '@prisma/client'

import { I_UserRegistrationBody } from '@/types/auth.types'

const prisma = new PrismaClient()

class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static register = async (body: I_UserRegistrationBody): Promise<any> => {
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        username: body.username
      }
    })
    return newUser
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static login = async (email: string, username: string): Promise<any> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
        username
      }
    })

    return user
  }
}

export default AuthService
