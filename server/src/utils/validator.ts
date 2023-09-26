import validator from 'validator'

export const sanitize = (url: string): string => {
  let parsedUrl: URL

  try {
    parsedUrl = new URL(url)
  } catch (err) {
    throw new Error('Invalid URL')
  }

  parsedUrl.searchParams.forEach((val: string, param: string) => {
    // Escaping potentially harmful characters in the query parameters

    // validator.escape(val) is used to escape characters in the parameter's value, which helps prevent cross-site scripting (XSS) attacks by converting characters like <, >, and & into their HTML entity equivalents (e.g., < becomes &lt;)
    parsedUrl.searchParams.set(param, validator.escape(val))
  })

  return parsedUrl.toString()
}
