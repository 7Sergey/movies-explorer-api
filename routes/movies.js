const express = require('express')
const { celebrate, Joi, Segments } = require('celebrate')

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies')

const movieRouter = express.Router()

movieRouter.get('/', getMovies)
movieRouter.post(
  '/',
  celebrate({
    // country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId

    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2).max(30),
      duration: Joi.number().required().min(2).max(30),
      year: Joi.string().required().min(2).max(30),
      description: Joi.string().required().min(2).max(30),

      image: Joi.string().pattern(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      ),
      trailerLink: Joi.string().pattern(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      ),
      thumbnail: Joi.string().pattern(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      ),
    }),
  }),
  createMovie,
)
movieRouter.delete(
  '/:idMovie',
  celebrate({
    [Segments.PARAMS]: {
      idMovie: Joi.string().alphanum().length(24).required(),
    },
  }),
  deleteMovie,
)

module.exports = movieRouter
