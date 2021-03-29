const cheerio = require("cheerio")
const axios = require("axios")
const numeral = require("numeral")

module.exports = async (url) => {
	let html, status

	try {
		const { data, status: statusCode } = await axios.get(url,{
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
			},
		})

		if (statusCode !== 404) {
			html = data

			status = statusCode
		}
	} catch (err) {
		if (err.response) {
			const { status, statusText } = err.response

			return { status, data: statusText }
		}

		return { status: 404, data: err.message }
	}

	const productInformation = {}
	const $ = cheerio.load(html)

	const title = $("#title").text().trim()

	let price = $("#priceblock_ourprice").first().html()
	price = price ? numeral(price)._value : null

	const img = $("#landingImage").attr("data-old-hires")
	const prime = $("#priceBadging_feature_div").find(".a-icon-prime")

	const has_prime = prime ? true : false

	return {
		status: status,
		data: {
			title,
			price,
			img,
			has_prime,
			url,
		},
	}
}
