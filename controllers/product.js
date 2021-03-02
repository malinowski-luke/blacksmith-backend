const scrape = require("../scripts/scrape")
const ProductModel = require("../models/product")
const UserModel = require("../models/user")
const logScrappedData = require("../scripts/logScrappedData")

module.exports = {
	getProducts: async (req, res) => {
		const { channel_id } = req.params

		const userProducts = await ProductModel.find({ channel_id })

		return res.status(200).send(userProducts)
	},

	postProduct: async (req, res) => {
		const channel_id = req.params.channel_id

		const product = req.body.product

		if (!product.url)
			return res
				.status(417)
				.send(
					"Body Request Requires: product with following properties { title, img, has_prime, price, url}"
				)

		try {
			const productExists = await ProductModel.findOne({ channel_id, url })
			if (productExists) return res.status(400).send("Duplicate Product!")

			await ProductModel.create({
				channel_id,
				...product,
			})

			res.sendStatus(202)
		} catch (err) {
			res.status(500).send(err)
		}
	},

	scrapeProduct: async (req, res) => {
		const channel_id = req.params.channel_id
		const url = req.body.url

		const productExists = await ProductModel.findOne({ channel_id, url })
		if (productExists) return res.status(400).send("Duplicate Product!")

		let product = {}

		const { status, data } = await scrape(url)

		if (status === 200) {
			product = {
				...data,
			}

			logScrappedData(product, "log.scrappedData")
		}

		res.status(status).send(product)
	},

	deleteProduct: async (req, res) => {
		const { product_id } = req.params

		if (!product_id)
			return res.status(400).send("Delete request needs product_id")

		const { deletedCount } = await ProductModel.deleteOne({
			_id: product_id,
		})

		if (deletedCount < 1) return res.status(500).send("Issue Deleting Product")
		else res.status(200).send("Product Deleted")
	},
}
