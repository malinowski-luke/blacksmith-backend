const express = require("express")
const Router = express.Router()

const Product = require("../controllers/product")
const User = require("../controllers/user")
const Validate = require("../middleware/validate")

// ping
Router.route("/").get((req, res) => res.status(200).send("OK!"))

// product
Router.route("/product/scrape/:channel_id").post(Product.scrapeProduct)

Router.route("/product/:channel_id").get(	Product.getProducts)

Router.route("/product/:channel_id").post(Product.postProduct)

Router.route("/product/:channel_id/:product_id").delete(Product.deleteProduct)


// user
Router.route("/user").post(User.createUser)

Router.route("/user/:channel_id").get(User.getUser)

Router.route("/user/:channel_id").delete(User.markUserForDeletion)

module.exports = Router
