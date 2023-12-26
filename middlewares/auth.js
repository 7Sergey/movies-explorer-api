const jwt = require('jsonwebtoken')
const UnauthorizedError = require('../errors/unauthorized')
require('dotenv').config() // Подключаем переменные окружения из файла .env

const { JWT_SECRET, NODE_ENV } = process.env

function auth(req, res, next) {
  try {
    const token = req.cookies.userToken

    if (!token) {
      throw new UnauthorizedError('NotAuthenticate')
    }

    const validToken = token.replace('Bearer ', '')

    // Добавлена проверка наличия строки "Bearer "
    const payload = jwt.verify(
      validToken,
      NODE_ENV !== 'production' ? JWT_SECRET : 'dev_secret',
    )

    // Присваиваем айди пользователя для удаления/добавления лайков
    req.user = payload
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Обработка ошибки верификации токена
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
