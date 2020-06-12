const { errors, APIError } = require('../utils/exceptions')
const { onCreated } = require('../utils/session')
// Import Model
const Project = require('../models/Project')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const session = req.user
        const {
            projectName = null,
            projectDescription = null
        } = req.body

        const data = {
          projectName,
          projectDescription,
            ...onCreated(session)
        }

        const results = await Project.create(data)

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
