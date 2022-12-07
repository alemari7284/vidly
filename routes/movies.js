const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const { genresSchema } = require('./genres')
const Movie = require('../models/movie')

var morgan = require('morgan')
router.use(morgan('tiny'))

const Genre = mongoose.model('Genre', genresSchema)

async function createMovie(title, genre, numberInStock, dailyRentalDate) {
  const movie = new Movie({
    title,
    genre,
    numberInStock,
    dailyRentalDate,
  })

  const result = await movie.save()
  console.log(result)
}

router.get('/', async (req, res) => {
  const movies = await Movie.find().select('title genre.name')
  return res.send(movies)
})

router.post('/add', async (req, res) => {
  const genre = await Genre.findOne({
    name: req.body.genre.name,
  })
  if (!genre) {
    return res.status(404).send('no such record')
  }

  const newMovie = new Movie({
    title: req.body.title,
    genre: genre,
    numberInStock: req.body.numberInStock,
    dailyRentalDate: req.body.dailyRentalDate,
  })

  const result = await newMovie.save()
  console.log(result)
  return res.send(result)
})

router.get('/get', async (req, res) => {
  const title = req.body.title

  const foundMovie = await Movie.find({
    title,
  }).select('genre.name -_id')

  return res.send(foundMovie)
})

// createMovie('Taxi Driver', { name: 'thriller' }, 0, 0)

module.exports = router
