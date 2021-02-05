const Schedule = require('node-schedule')
const UserModel = require('../models/user')
const Moment = require('moment')

const deleteDeactivatedUsers = async () => {
  console.log(Moment().format('HH:mm'), 'Delete user script hit!')
  try {
    await UserModel.deleteMany({ deactivated: true })
  } catch (err) {
    console.log(`"Error Deleting Deactivated Users: ${err}`)
  }
}

module.exports = Schedule.scheduleJob('* 1 * * *', () =>
  deleteDeactivatedUsers()
)
