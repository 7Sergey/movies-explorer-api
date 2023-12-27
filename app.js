const express = require('express')
const mongoose = require('mongoose')
const { errors } = require('celebrate')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
require('dotenv').config() // Подключаем переменные окружения из файла .env

const { PORT = 3001, MONGO_URL } = process.env
const { requestLogger, errorLogger } = require('./middlewares/logger')
const router = require('./routes/router')
const limiter = require('./middlewares/rateLimiter')

const { errorHandler } = require('./middlewares/errorHandler')

const app = express()

// Подключаем rate limiter к всем запросам
app.use(limiter)

mongoose.connect(MONGO_URL)

app.use(requestLogger) // подключаем логгер запросов

// Набор middleware функций для express, который помогает защитить ваше приложение Node.js от уязвимостей и кибератак, включая CSRF, XSS и другие.
app.use(helmet())

app.use(express.json()) // метод обогащает последующие роуты body
app.use(cookieParser())
app.use(router)
app.use(errorLogger) // подключаем логгер ошибок

app.use(errors()) // обработчик ошибок Celebrate

// Централизованный обработчик ошибок

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Сервер запущен и использует ${PORT} порт`)
})
