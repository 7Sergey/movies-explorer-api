const express = require('express')
const mongoose = require('mongoose')
const { errors } = require('celebrate')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const cors = require('cors')

mongoose.set('strictQuery', false)

const { requestLogger, errorLogger } = require('./middlewares/logger')
const router = require('./routes/router')

const {
  CLIENT_ERROR_CODE,
  MONGO_DUPLICATE_ERROR_CODE,
  CONFLICT_ERROR_CODE,
} = require('./constants/constants')

require('dotenv').config() // Подключаем переменные окружения из файла .env

const { MONGO_URL, PORT } = process.env

const app = express()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Максимальное количество запросов за указанный период
  message: 'Превышен лимит запросов, пожалуйста, подождите некоторое время.',
})

const options = {
  origin: [
    'http://localhost:3000',
    'https://fedorov.movies.nomoredomainswork.ru',
  ],
  optionsSuccessStatus: 200,
  credentials: true,
}
app.use(cors(options))

// Подключаем rate limiter к всем запросам
app.use(limiter)
mongoose.connect(MONGO_URL)

app.use(requestLogger) // подключаем логгер запросов

// Набор middleware функций для express, который помогает защитить ваше приложение Node.js от уязвимостей и кибератак, включая CSRF, XSS и другие.
app.use(helmet())

app.use(express.json()) // метод обогащает последующие роуты body
app.use(cookieParser())
console.log('до роутера')
app.use(router)
console.log('после роутера')

app.use(errorLogger) // подключаем логгер ошибок

app.use(errors()) // обработчик ошибок Celebrate

// Централизованный обработчик ошибок
// игнорируем ошибку eslint о неиспользованном аргументе
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
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
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`)
})
