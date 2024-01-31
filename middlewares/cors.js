const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  /(https|http)?:\/\/(?:www\.|(?!www))front-movies.nomoredomains.xyz\/[a-z]+\/|[a-z]+\/|[a-z]+(\/|)/,
]

module.exports = (req, res, next) => {
  const { origin } = req.headers

  if (
    allowedCors.some((e) => e.test && e.test(origin)) ||
    allowedCors.includes(origin)
  ) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', true)
  }
  const { method } = req
  const requestHeaders = req.headers['access-control-request-headers']
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE'

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS)
    res.header('Access-Control-Allow-Headers', requestHeaders)
    return res.end()
  }

  return next()
}
