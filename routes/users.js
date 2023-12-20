const express = require('express')
const { celebrate, Joi } = require('celebrate')

const { patchUser, getCurrentUser } = require('../controllers/users')

const userRouter = express.Router()

userRouter.get('/me', getCurrentUser)
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email().required(), // Добавил метод email() для валидации email
    }),
  }),
  patchUser,
)

module.exports = userRouter
