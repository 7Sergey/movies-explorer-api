const express = require('express')
const { celebrate, Joi } = require('celebrate')

const userRouter = require('./users')
const movieRouter = require('./movies')

const { login, createUser } = require('../controllers/users')
const { auth } = require('../middlewares/auth')
const NotFoundError = require('../errors/not-found')

const router = express.Router()

// роуты логина и регистрации
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
)

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
)

// защищенные роуты ниже
router.use(auth)
router.use('/users', userRouter)
router.use('/movies', movieRouter)

router.post('/signout', (req, res) => {
  // Удаляем куку с токеном
  res.clearCookie('userToken')
  res.status(200).send({ message: 'Вы успешно вышли' })
})

router.use((req, res, next) => {
  const err = new NotFoundError('Такой страницы не существует')
  next(err)
})

module.exports = router
