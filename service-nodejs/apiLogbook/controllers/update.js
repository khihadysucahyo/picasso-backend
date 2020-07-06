const { errors, APIError } = require('../utils/exceptions')
const {
    onUpdated,
    filePath
} = require('../utils/session')
const {
    validationResult
} = require('express-validator')
const {
    updateFile
} = require('../utils/requestFile')

// Import Model
const LogBook = require('../models/LogBook')

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
        const {
            _id
        } = req.params
        const resultLogBook = await LogBook.findById({
            _id: _id
        }).lean()
        let evidenceResponse = {}
        let documentResponse = {}

        const {
            dateTask = null,
            projectId = null,
            projectName = null,
            nameTask = null,
            difficultyTask = null,
            organizerTask = null,
            isMainTask = null,
            otherInformation = null,
            isDocumentLink = null
        } = req.body

        const isTask = String(isMainTask) === 'true'
        const isLink = String(isDocumentLink) === 'true'
        if (req.files.evidenceTask) {
            evidenceResponse = await updateFile(
                resultLogBook.evidenceTask.filePath,
                'image',
                req.files.evidenceTask
            )
        } else {
            evidenceResponse = resultLogBook.evidenceTask
        }
        if (isLink) {
            if (req.body.documentTask.length < 0) throw new APIError(errors.serverError)
            documentResponse = {
                filePath: '',
                fileURL: req.body.documentTask
            }
        } else {
            if (req.files.documentTask) {
                documentResponse = await updateFile(
                    resultLogBook.evidenceTask.filePath,
                    'document',
                    req.files.documentTask
                )
            } else {
                documentResponse = resultLogBook.documentTask
            }
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
            organizerTask,
            otherInformation,
            ...onUpdated(session)
        }

        const results = await LogBook.findByIdAndUpdate(_id, data)

        await res.status(201).send({
            message: 'Update data successfull',
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
