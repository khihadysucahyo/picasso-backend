const { errors, APIError } = require('../utils/exceptions')
const {
    onCreated,
    onFileCreated
} = require('../utils/session')
const {
    postFile
} = require('../utils/requestFile')

// Import Model
const LogBook = require('../models/LogBook')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const session = req.user
        if (!req.files || Object.keys(req.files).length === 0) throw new APIError(errors.serverError)
        const evidenceResponse = await postFile('image', req.files.evidenceTask)
        const documentResponse = await postFile('document', req.files.documentTask)

        const {
            dateTask = null,
            projectId = null,
            projectName= null,
            nameTask = null,
            startTimeTask = null,
            endTimeTask = null,
            urgencyTask = null,
            difficultyTask = null,
            organizerTask = null,
            otherInformation = null
        } = req.body

        const data = {
          dateTask,
          projectId,
          projectName,
          nameTask,
          startTimeTask,
          endTimeTask,
          urgencyTask,
          difficultyTask,
          evidenceTask: onFileCreated(evidenceResponse),
          documentTask: onFileCreated(documentResponse),
          organizerTask,
          otherInformation,
          ...onCreated(session)
        }

        const results = await LogBook.create(data)

        await res.status(201).send({
            message: 'Input data successfull',
            data: results,
        })

    } catch (error) {
      console.log(error)
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
