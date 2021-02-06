const UserModel = require('../models/user')
const moment = require('moment')
const axios = require('axios')
module.exports = {
  createUser: async (req, res) => {
    const { client_id, channel_id } = req.body.client_id

    let user

    try {
      // check if user exists
      const userExists = await UserModel.findOne({ channel_id })
      if (userExists) return res.status(400).send('User Already Exists!')

      // get user info from twitch
      const { data } = await axios.get(
        `https://api.twitch.tv/kraken/channels/${channel_id}`,
        {
          headers: {
            'Client-ID': client_id,
            Accept: 'application/vnd.twitchtv.v5+json',
          },
        }
      )

      user = await UserModel.create({
        channel_id,
        channel_name: data.name,
        logo: data.logo,
      })
    } catch (err) {
      return res.status(500).send(err)
    }
    res.status(201).send(user)
  },

  getUser: async (req, res) => {
    const channel_id = req.params.channel_id

    const user = await UserModel.findOne({ channel_id })

    if (!user) return res.status(404).send('User Not Found!')

    res.status(200).send(user)
  },

  markUserForDeletion: async (req, res) => {
    const channel_id = req.body.channel_id

    try {
      await UserModel.findOneAndUpdate(
        channel_id,
        {
          deactivated: true,
          deactivated_date: moment.utc().toDate(),
        },
        (err) => {
          if (err) return err
        }
      )
    } catch (err) {
      res.status(500).send(err)
    }
    res.status(202).send('User Marked For Deletion!')
  },
}
