const scrape = require("../scripts/scrape")
const ProductModel = require("../models/product")
const UserModel = require("../models/user")
const logScrappedData = require("../scripts/logScrappedData")

module.exports = {
	getProducts: async (req, res) => {
		const channel_id = req.params.channel_id

		if (!channel_id) {
			return res.status(400).send("GET '/product/:channel_id' request needs a channel_id")
		}

		try {
			const userProducts = await ProductModel.find({ channel_id })

			res.status(200).send(userProducts)
		} catch (error) {
			console.log(error)

			res.sendStatus(400)
		}
	},

	postProduct: async (req, res) => {
		const channel_id = req.params.channel_id
		const product = req.body.product

		if (!channel_id) {
			return res.status(400).send("POST '/product/:channel_id' request needs a channel_id")
		}

		if (!product) {
			return res.status(400).send("POST '/product/:channel_id' request needs a product")
		}


		try {
			await ProductModel.create({
				channel_id,
				...product,
			})

			const allProducts = await ProductModel.find({ channel_id })

			res.status(202).send(allProducts)
		} catch (err) {
			res.status(500).send(err)
		}
	},

	deleteProduct: async (req, res) => {
		const product_id = req.params.product_id
		const channel_id = req.params.channel_id

		if (!channel_id) {
			return res.status(400).send("DELETE '/product/:channel_id/:product_id' request needs a channel_id")
		}

		if (!product_id) {
			return res.status(400).send("DELETE '/product/:channel_id/:product_id' request needs a product_id")
		}

		try {
			const { deletedCount } = await ProductModel.deleteOne({
				_id: product_id,
			})

			if (deletedCount === 0) {
				return res.status(500).send("Issue Deleting Product")
			}

			const allProducts = await ProductModel.find({ channel_id })

			res.status(200).send(allProducts)
		} catch (error) {
			console.log(error)
		}
	},

	scrapeProduct: async (req, res) => {
		const channel_id = req.params.channel_id
		const url = req.body.url

		if (!channel_id) {
			return res.status(400).send("POST '/product/scrape/:channel_id' request needs a channel_id")
		}

		if (!url) {
			return res.status(400).send("POST '/product/scrape/:channel_id' request needs a url")
		}

		try {
			const productExists = await ProductModel.findOne({ channel_id, url })

			if (productExists) {
				return res.status(400).send("Duplicate Product!")
			}

		} catch (error) {
			console.log(error)
			res.status(500).send('Scraping Error')
		}

		let product

		const { status, data } = await scrape(url)

		if (status === 200) {
			product = {
				...data,
			}
		}
		res.status(status).send(product)

	},
}
