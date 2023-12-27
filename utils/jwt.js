const jwt = require('jsonwebtoken') // импортируем модуль jsonwebtoken

const { JWT_SECRET, NODE_ENV } = process.env

const generateToken = (payloader) => {
  return jwt.sign(payloader, NODE_ENV ? JWT_SECRET : 'dev_secret', {
    expiresIn: 3600,
  })
}

module.exports = {
  generateToken,
}
