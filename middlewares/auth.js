const jwt = require('jsonwebtoken')
const UnauthorizedError = require('../errors/unauthorized')
require('dotenv').config() // Подключаем переменные окружения из файла .env

const { JWT_SECRET, NODE_ENV } = process.env

function auth(req, res, next) {
  console.log('JWT_SECRET:', JWT_SECRET)
  console.log('NODE_ENV:', NODE_ENV)
  try {
    const authHeader = req.headers.authorization
    console.log('authHeader:', authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('NotAuthenticate')
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('token:', token)

    const payload = jwt.verify(
      token,
      NODE_ENV !== 'production' ? JWT_SECRET : 'dev_secret',
    )
    console.log('payload:', payload)

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
