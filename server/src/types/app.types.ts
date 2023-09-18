export interface APIResponse {
  status: boolean
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  error?: string
}
