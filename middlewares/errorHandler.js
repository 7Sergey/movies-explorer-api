const {
  MONGO_DUPLICATE_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  CLIENT_ERROR_CODE,
} = require('../constants/constants')

// игнорируем ошибку eslint о неиспользованном аргументе
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = error
  // проверка на ошибки
  if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
    return res
      .status(CONFLICT_ERROR_CODE)
      .send({ message: 'Такой пользователь уже существует' })
  }
  if (error.name === 'CastError') {
    return res
      .status(CLIENT_ERROR_CODE)
      .send({ message: 'Ошибка валидации полей' })
  }

  if (error.name === 'ValidationError') {
    return res
      .status(CLIENT_ERROR_CODE)
      .send({ message: 'Ошибка валидации полей' })
  }

  return res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  })
}

module.exports = { errorHandler }
