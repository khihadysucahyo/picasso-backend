const { errors, APIError } = require('../utils/exceptions')
const {
    onCreated,
} = require('../utils/session')

// Import Model
const Checkin = require('../models/Checkin')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const session = req.user
        
        const {
            checkinAt = null,
            location = null,
            message= null,
        } = req.body

        const data = {
          checkinAt,
          location,
          message,
          ...onCreated(session)
        }

        const results = await Checkin.create(data)

        await res.status(201).send({
            message: 'Input data successfull',
            data: results,
        })

    } catch (error) {
      const { code, message, data } = error

      if (code && message) {
          res.status(code).send({
              code,
              message,
              data,
          })
      } else {
          res.status(500).send(errors.serverError)
      }
    }
}
