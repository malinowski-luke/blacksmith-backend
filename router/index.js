const express = require("express")
const Router = express.Router()

const Product = require("../controllers/product")
const User = require("../controllers/user")
const Validate = require("../middleware/validate")

// ping
Router.route("/").get((req, res) => res.status(200).send("OK!"))

// products
Router.route("/product/:channel_id").get(
	Validate.paramChannelID,
	Product.getProducts
)

Router.route("/product/:channel_id").post(
	Validate.paramChannelID,
	Product.postProduct
)

Router.route("/product/scrape/:channel_id").post(Product.scrapeProduct)

Router.route("/product/:product_id").delete(
	Validate.paramChannelID,
	Product.deleteProduct
)

// user
Router.route("/user/:channel_id").get(Validate.paramChannelID, User.getUser)

Router.route("/user/new").post(
	Validate.bodyChannelID,
	Validate.bodyClientID,
	User.createUser
)

Router.route("/user/delete").post(
	Validate.bodyClientID,
	User.markUserForDeletion
)

module.exports = Router
