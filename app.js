const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb')

const app = express()

app.listen(3000, () => {
  console.log('Сервер запущен')
})
