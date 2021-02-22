const scrape = require('../scripts/scrape')
const ProductModel = require('../models/product')
const UserModel = require('../models/user')
const logScrappedData = require('../scripts/logScrappedData')

module.exports = {
  getProducts: async (req, res) => {
    const { channel_id } = req.params

    const userProducts = await ProductModel.find({ channel_id })

    return res.status(200).send(userProducts)
  },

  postProduct: async (req, res) => {
    let product, errorMsg

    const { url, channel_id } = req.body

    if (!url || !channel_id)
      return res.status(417).send('Body Request Requires: url, channel_id')

    const userExist = await UserModel.find({ channel_id })
    if (!userExist)
      return res.status(400).send("A user with this channel_id doesn't exist")

    const productExists = await ProductModel.findOne({ channel_id, url })
    if (productExists) return res.status(400).send('Duplicate Product!')

    const { status, data } = await scrape(url)

    if (status === 200 && !productExists) {
      product = await ProductModel.create({
        channel_id,
        url: data.url,
        title: data.title,
        price: data.price,
        img: data.img,
        has_prime: data.prime,
      })

      logScrappedData(product, 'log.scrappedData')
    } else errorMsg = data

    res.status(status === 200 ? 201 : status).send(product || errorMsg)
  },

  deleteProduct: async (req, res) => {
    const { product_id } = req.params

    if (!product_id)
      return res.status(400).send('Delete request needs product_id')

    const { deletedCount } = await ProductModel.deleteOne({
      _id: product_id,
    })

    if (deletedCount < 1) return res.status(500).send('Issue Deleting Product')
    else res.status(200).send('Product Deleted')
  },
}
