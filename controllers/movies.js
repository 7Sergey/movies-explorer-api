const Forbidden = require('../errors/forbidden')
const NotFoundError = require('../errors/not-found')
const Movie = require('../models/Movie')

const getMovies = async (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies)
    })
    .catch(next)
}
//  country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId

const createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    // movieId,
  } = req.body
  const owner = req.user._id
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    // movieId,
    owner,
  })
    .then((movie) => {
      res.send({ data: movie })
    })
    .catch(next)
}

const deleteMovie = (req, res, next) => {
  const { idMovie } = req.params
  Movie.findById(idMovie)
    .then((movie) => {
      if (!movie) {
        const err = new NotFoundError('Карта не найдена')
        next(err)
      }

      // Проверяем, является ли текущий пользователь создателем карточки
      if (movie.owner.toString() !== req.user._id) {
        const err = new Forbidden('Нет прав для удаления этой карточки')
        next(err)
      }

      // Если пользователь - создатель, то удаляем карточку
      return Movie.deleteOne(movie).then(() => {
        res.send({ data: movie })
      })
    })
    .catch(next)
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
}
