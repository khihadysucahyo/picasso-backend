const { errors, APIError } = require('../utils/exceptions')
const {
    onCreated,
    filePath
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
        let documentResponse = {}
        const {
            dateTask = null,
            projectId = null,
            projectName= null,
            nameTask = null,
            startTimeTask = null,
            endTimeTask = null,
            difficultyTask = null,
            organizerTask = null,
            isMainTask = null,
            otherInformation = null,
            isDocumentLink = null
        } = req.body

        const isTask = String(isMainTask) === 'true'
        const isLink = String(isDocumentLink) === 'true'
        if (isLink) {
            if (req.body.documentTask.length < 0) throw new APIError(errors.serverError)
            documentResponse = {
                filePath: '',
                fileURL: req.body.documentTask
            }
        } else {
            documentResponse = await postFile('document', req.files.documentTask)
        }

        const data = {
          dateTask,
          projectId,
          projectName,
          nameTask,
          startTimeTask,
          endTimeTask,
          isMainTask: isTask,
          difficultyTask,
          evidenceTask: filePath(evidenceResponse),
          documentTask: filePath(documentResponse),
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
