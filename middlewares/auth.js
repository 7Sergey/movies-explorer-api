const jwt = require('jsonwebtoken')
const { UNAUTHORIZED_ERROR_CODE } = require('../constants/constants')

const { NODE_ENV, JWT_SECRET } = process.env

module.exports = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UNAUTHORIZED_ERROR_CODE('Authorization required.'))
  }

  const token = authorization.replace('Bearer ', '')
  let payload

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    )
  } catch (err) {
    return next(new UNAUTHORIZED_ERROR_CODE('Invalid token.'))
  }

  req.user = payload

  return next()
}
