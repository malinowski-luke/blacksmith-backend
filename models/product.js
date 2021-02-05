const mongoose = require('mongoose')
const moment = require('moment')

const productsSchema = new mongoose.Schema({
  channel_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number || null,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  has_prime: {
    type: Boolean,
    required: true,
  },
  date_added: {
    type: Date,
    default: () => moment.utc().toDate(),
  },
})

module.exports = mongoose.model('products', productsSchema)
