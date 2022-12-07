const express = require('express')
const mongoose = require('mongoose')
const { Customer } = require('../models/customer')

const Joi = require('joi')
const router = express.Router()

var morgan = require('morgan')
router.use(morgan('tiny'))

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name')
  res.send(customers)
})

router.post('/add', async (req, res) => {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  }

  const validation = Joi.validate(req.body, schema)

  const { error } = validation

  if (error) return res.status(400).send(error.details[0].message)

  const customer2add = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  })

  try {
    const result = await customer2add.save()
    console.log(result)
  } catch (error) {
    console.log(error.message)
    return res.status(400).send(error)
  }
  return res.send(`Successfully added`)
})

module.exports = router
