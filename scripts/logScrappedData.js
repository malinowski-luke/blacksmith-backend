const fs = require('fs')
const _ = require('lodash')

module.exports = (logData, fileName) => {
  // file path
  const directory = `${__dirname}/../logs/${fileName}.json`

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
    console.log('data added to the log file ')
  } else console.log(`this data already exists in the ${fileName} log file`)
}
