export function calculateCookieExpiration(time: number, unit: 'days' | 'hours' | 'min'): Date {
  if (typeof time !== 'number' || time <= 0) {
    throw new Error('Invalid time value')
  }

  const expirationDate = new Date()

  switch (unit) {
    case 'days':
      expirationDate.setDate(expirationDate.getDate() + time)
      break
    case 'hours':
      expirationDate.setTime(expirationDate.getTime() + time * 60 * 60 * 1000)
      break
    case 'min':
      expirationDate.setTime(expirationDate.getTime() + time * 60 * 1000)
      break
    default:
      throw new Error('Invalid unit (use "days", "hours", or "min")')
  }

  return expirationDate
}
