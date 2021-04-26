const UserModel = require('../models/user')
const moment = require('moment')
const axios = require('axios')

module.exports = {
  createUser: async (req, res) => {
    const channel_id = req.params.channel_id
    const client_id = req.body.client_id

    if (!channel_id) {
      return res.status(400).json({
        message: "POST '/user/:channel_id' request needs a channel_id",
      })
    }

    if (!client_id) {
      return res.status(400).json({
        message: "POST '/user/:channel_id' request needs a client_id",
      })
    }

    let user

    try {
      // check if user exists
      const userExists = await UserModel.findOne({ channel_id })
      if (userExists) {
        return res.status(400).json({ message: 'User Already Exists!' })
      }

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

      res.status(201).send(user)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error Fetching User Data' })
    }
  },

  getUser: async (req, res) => {
    const channel_id = req.params.channel_id

    if (!channel_id) {
      return res.status(400).json({
        message: "GET '/user/:channel_id' request needs a channel_id",
      })
    }

    try {
      const user = await UserModel.findOne({ channel_id })

      if (!user) {
        return res.status(404).send({
          message: 'User Not Found!',
        })
      }

      res.status(200).send(user)
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: 'Error Fetching User.',
      })
    }
  },

  markUserForDeletion: async (req, res) => {
    const channel_id = req.params.channel_id

    if (!channel_id) {
      return res.status(500).json({
        message: "DELETE '/user/:channel_id' request needs a channel_id.",
      })
    }

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

      res.status(202).json({
        message: 'User Marked For Deletion!',
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: 'Error Marking User For Deletion!',
      })
    }
  },
}
