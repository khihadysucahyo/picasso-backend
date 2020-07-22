const {
    errors,
    APIError
} = require('../utils/exceptions')
const {
    validationResult
} = require('express-validator')
const {
    onCreated,
    filePath
} = require('../utils/session')
const {
    postFile
} = require('../utils/requestFile')
const {
    encode,
} = require('../utils/functions')

// Import Model
const LogBook = require('../models/LogBook')
const BlobsFile = require('../models/BlobsFile')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const session = req.user
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({
                code: 422,
                errors: errors.array(),
            })
            return
        }
        if (!req.files || Object.keys(req.files).length === 0) throw new APIError(errors.serverError)
        const evidenceResponse = await postFile('image', req.files.evidenceTask)
        const bytes = new Uint8Array(req.files.evidenceTask.data)
        const dataBlobEvidence = 'data:image/png;base64,' + encode(bytes)
        let documentResponse = {}
        const {
            dateTask = null,
            projectId = null,
            projectName= null,
            nameTask = null,
            difficultyTask = null,
            organizerTask = null,
            isMainTask = null,
            workPlace = null,
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
          isDocumentLink: isLink,
          isMainTask: isTask,
          difficultyTask,
          evidenceTask: filePath(evidenceResponse),
          documentTask: filePath(documentResponse),
          workPlace,
          organizerTask,
          otherInformation,
          ...onCreated(session)
        }

        const results = await LogBook.create(data)
        await BlobsFile.create({
            logBookId: results._id,
            dateTask: results.dateTask,
            blob: dataBlobEvidence
        })

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
