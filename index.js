const config = require('config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const register = require('./routes/register')
const auth = require('./routes/auth')
const morgan = require('morgan')

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.')
  process.exit(1)
}

app.use(express.json())
app.use(morgan('tiny'))
app.use('/api/genres/', genres)
app.use('/api/movies/', movies)
app.use('/api/customers/', customers)
app.use('/api/rentals/', rentals)
app.use('/api/users/', register)
app.use('/api/users/auth/', auth)

app.get('/', (req, res) => {
  console.log(req.body)
  res.send('hello world!')
})

app.listen(3000, () => {
  mongoose
    .connect('mongodb://localhost/playground', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to the DB'))
    .catch((err) => console.log(err))
  console.log('listening on port 3000')
})
