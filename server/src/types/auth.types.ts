export interface I_UserRegistrationPromise {
  status: string
  message: string
  data: I_UserRegistrationBody
}

export interface I_UserRegistrationBody {
  email: string
  password: string
  username: string
}

export interface I_UserLoginBody {
  email: string
  password: string
  username: string
}
