const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Максимальное количество запросов за указанный период
  message: 'Превышен лимит запросов, пожалуйста, подождите некоторое время.',
})
module.exports = limiter
