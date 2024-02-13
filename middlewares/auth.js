const jwt = require('jsonwebtoken')
const UnauthorizedError = require('../errors/unauthorized')
require('dotenv').config() // Подключаем переменные окружения из файла .env

const { JWT_SECRET, NODE_ENV } = process.env

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('NotAuthenticate')
    }

    const token = authHeader.replace('Bearer ', '')

    const payload = jwt.verify(
      token,
      NODE_ENV !== 'production' ? JWT_SECRET : 'dev_secret',
    )

    req.user = payload
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      const err = new UnauthorizedError('InvalidToken')
      next(err)
    } else {
      next(error)
    }
  }
}

module.exports = {
  auth,
}
