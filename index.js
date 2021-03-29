require('dotenv').config({})

const express = require('express')
const application = express()

const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const responseTime = require('response-time')

const Router = require('./router/index')
const runDeleteScript = require('./scripts/deleteUsers')

const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT



application.use(bodyParser.json())
application.use(bodyParser.urlencoded({ extended: true }))

application.use(cors())

// Logging
application.use(morgan('short'))
// Response time Logging
application.use(responseTime())

application.use(Router)

mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) console.error(err)
  }
)

runDeleteScript.job()

const db = mongoose.connection

application.listen(PORT, '0.0.0.0', () =>
  console.log(
    `application running on port: ${PORT}`,
    `\nconnected to mongo ${db.name} DB`
  )
)
