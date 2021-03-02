const fs = require("fs")
const path = require("path")
const _ = require("lodash")

module.exports = (logData, fileName) => {
	// file path
	const directory = path.resolve(__dirname, `./../logs/${fileName}.json`)

	if (!fs.existsSync(directory)) {
		fs.writeFileSync(directory, JSON.stringify([]))
	}

	// read
	let logDataFile = JSON.parse(fs.readFileSync(directory))

	// check if log file contains
	const logFileHasData = _.some(
		logDataFile,
		(data) => data.channel_id === logData.channel_id && data.url === logData.url
	)

	// write
	if (!logFileHasData) {
		logDataFile.push(logData)

		fs.writeFileSync(directory, JSON.stringify(logDataFile, null, 4))

		console.log("data added to the log file ")
	} else console.log(`this data already exists in the ${fileName} log file`)
}
