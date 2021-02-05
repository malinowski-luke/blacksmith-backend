const mongoose = require('mongoose')
const moment = require('moment')

const usersSchema = new mongoose.Schema({
  channel_id: {
    type: String,
    required: true,
  },
  channel_name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: () => moment.utc().toDate(),
  },
  deactivated: {
    type: Boolean,
    default: false,
  },
  deactivated_date: {
    type: Date,
    required: false,
  },
})

module.exports = mongoose.model('users', usersSchema)
