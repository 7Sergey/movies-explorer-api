const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true, // обязательное поле
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
          return urlRegex.test(v)
        },
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
          return urlRegex.test(v)
        },
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
          return urlRegex.test(v)
        },
      },
    },
    owner: {
      // id пользователя, который сохранил фильм
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      // id фильма, который содержится в ответе сервиса MoviesExplorer.
      type: Number,

      required: true,
    },
    nameRU: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return /^[а-яё\s-]+$/i.test(value) // Только русские буквы, пробелы и дефисы
        },
      },
    },
    nameEN: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return /^[a-zA-Z\s-]+$/i.test(value) // только английские буквы, пробелы и дефисы
        },
        message: (props) =>
          `${props.value} не является корректным значением для nameEN!`,
      },
    },
    createdAt: {
      //  дата создания
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, // не отслеживать версию схемы во время создания карточки
    timestamps: true, //  время создания.
  },
)

module.exports = mongoose.model('movie', movieSchema)
