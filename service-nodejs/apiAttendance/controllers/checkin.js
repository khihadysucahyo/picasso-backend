const {
    errors,
    APIError
} = require('../utils/exceptions')
const {
    validationResult
} = require('express-validator')
const {
    onCreated
} = require('../utils/session')

// Import Model
const Attendance = require('../models/Attendance')

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
            date = null,
            location = null,
            message = null,
        } = req.body

        let start = new Date()
        start.setHours(0, 0, 0, 0)

        let end = new Date()
        end.setHours(23, 59, 59, 999)
        const rules = [{
            $match: {
                'createdBy.email': session.email,
                startDate: {
                    $gte: start,
                    $lt: end
                }
            },
        }]
        const checkUser = await Attendance.aggregate(rules)

        if (checkUser.length >= 1) throw new APIError({
            code: 422,
            message: 'Sudah melakukan checkin',
        })

        const data = {
            startDate: date,
            location,
            message,
            ...onCreated(session)
        }

        const results = await Attendance.create(data)

        await res.status(201).send({
            message: 'Input data successfull',
            data: results,
        })

    } catch (error) {
        const {
            code,
            message,
            data
        } = error

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
