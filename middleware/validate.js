module.exports = {
  paramChannelID: (req, res, next) => {
    const channel_id = req.params.channel_id

    if (!channel_id)
      return res.status(417).send('Param: Twitch channel_id is Required!')
    else next()
  },

  bodyClientID: (req, res, next) => {
    const client_id = req.body.client_id

    if (!client_id)
      return res.status(417).send('Body: Twitch client_id is Required!')
    else next()
  },

  bodyChannelID: (req, res, next) => {
    const channel_id = req.body.channel_id

    if (!channel_id)
      return res.status(417).send('Body: Twitch channel_id is Required!')
    else next()
  },
}
