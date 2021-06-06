const express = require('express')
const Router = express.Router()

const {
  getProducts,
  postProduct,
  scrapeProduct,
  deleteProduct,
} = require('../controllers/product')

const {
  createUser,
  getUser,
  markUserForDeletion,
} = require('../controllers/user')

// ping
Router.route('/').get((req, res) => res.status(200).send('OK!'))

// product
Router.route('/product/scrape/:channel_id').post(scrapeProduct)

Router.route('/product/:channel_id').get(getProducts)

Router.route('/product/:channel_id').post(postProduct)

Router.route('/product/:channel_id/:product_id').delete(deleteProduct)

// user
Router.route('/user').post(createUser)

Router.route('/user/:channel_id').get(getUser)

Router.route('/user/:channel_id').delete(markUserForDeletion)

module.exports = Router
