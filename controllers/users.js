const bcrypt = require('bcryptjs') // импортируем bcrypt

const { SALT_ROUNDS } = require('../constants/constants')
const { generateToken } = require('../utils/jwt')
const NotFoundError = require('../errors/not-found')
const UnauthorizedError = require('../errors/unauthorized')
const User = require('../models/Users')

const createUser = async (req, res, next) => {
  try {
    // хешируем пароль
    const { name, email, password } = req.body
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const newUser = await User.create({
      name,
      email,
      password: hash,
    })

    // Создаем новый объект пользователя без хеша
    const userWithoutHash = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    }
    // вернем пользователя без хеша
    res.status(201).send({ data: userWithoutHash })
  } catch (error) {
    next(error)
  }
}

const patchUser = async (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        const err = new NotFoundError('Пользователь по id не найден')
        next(err)
        return
      }
      res.send({ data: updatedUser })
    })

    .catch(next)
}
console.log('users.js')
const login = (req, res, next) => {
  console.log('в функции login')

  const { email, password } = req.body
  console.log('email:', email)

  console.log('password:', password)

  let foundUser // Объявляем переменную здесь, чтобы она была видна в обоих блоках .then

  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      const err = new UnauthorizedError(
        'Для доступа к защищенным страницам необходимо авторизоваться.',
      )
      next(err)
    })
    .then((user) => {
      console.log('user:', user)

      foundUser = user
      return bcrypt.compare(String(password), user.password)
    })
    .then((matched) => {
      console.log('matched:', matched)
      if (!matched) {
        const err = new UnauthorizedError(
          'Для доступа к защищенным страницам необходимо авторизоваться.',
        )
        next(err)
        return
      }

      const token = generateToken({ _id: foundUser._id })
      // res.cookie('userToken', token, {
      //   httpOnly: true,
      //   sameSite: true,
      //   // срок действия токена 1 неделя
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // })
      res.send({ email: foundUser.email, token })
    })
    .catch(next)
}

const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)

    // Проверяем, существует ли пользователь
    if (!currentUser) {
      const err = new NotFoundError('Пользователь не найден')
      next(err)
    }

    // Отправляем информацию о пользователе в ответ
    return res.send(currentUser)
  } catch (error) {
    next(error)
  }
  // Добавляем возврат для устранения ошибки eslintconsistent-return
  return null
}

module.exports = {
  createUser,
  patchUser,
  login,
  getCurrentUser,
}
