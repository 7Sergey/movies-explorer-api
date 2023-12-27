const express = require('express')

const signoutRouter = express.Router()

signoutRouter.post('/', (req, res) => {
  // Удаляем куку с токеном
  res.clearCookie('userToken')
  res.status(200).send({ message: 'Вы успешно вышли' })
})

module.exports = signoutRouter
