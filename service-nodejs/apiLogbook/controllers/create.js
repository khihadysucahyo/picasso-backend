const { errors, APIError } = require('../utils/exceptions')
const { onCreated } = require('../utils/session')
// Import Model
const LogBook = require('../models/LogBook')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const session = req.session.user
        const {
            date_task = null,
            name_task = null,
            start_time_task = null,
            end_time_task = null,
            urgency_task = null,
            difficulty_task = null,
            evidence = null,
            document = null,
            organizer_task = null,
            other_information = null
        } = req.body

        const data = {
            filePath,
            fileURL,
            ...onCreated(session)
        }

        await LogBook.create(data)

        await res.status(201).send({
            message: 'Input data successfull',
            data,
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
