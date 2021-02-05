const express = require("express");
const Router = express.Router();

const Product = require("../controllers/product");
const User = require("../controllers/user");
const Validate = require("../middleware/validate");

Router.route("/").get((req, res) => res.status(200).send("OK!"));

Router.route("/product").post(Validate.bodyChannelID, Product.getProducts);
Router.route("/product/add").post(Product.getProductInfo);

Router.route("/user/:channel_id").get(Validate.paramChannelID, User.getUser);
Router.route("/user/new").post(
    Validate.bodyChannelID,
    Validate.bodyClientID,
    User.createUser
);

Router.route("/user/delete").post(
    Validate.bodyClientID,
    User.markUserForDeletion
);

module.exports = Router;
