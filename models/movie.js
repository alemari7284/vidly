const mongoose = require('mongoose')
const { genresSchema } = require('../routes/genres')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: genresSchema,
  numberInStock: Number,
  dailyRentalDate: Number,
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports.Movie = Movie
