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
const moment = require('moment')
moment.locale('id')
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
            note = null
        } = req.body

        const start = moment().format("YYYY/MM/DD")

        const end = moment().format("YYYY/MM/DD")

        if (moment().isSame(date, 'day') === false) throw new APIError({
            code: 422,
            message: 'Tanggal checkin tidak sesuai dengan hari ini.',
        })

        const rules = [{
            $match: {
                'createdBy.email': session.email,
                startDate: {
                    $gte: new Date(`${start} 00:00:00 +0000`),
                    $lt: new Date(`${end} 23:59:59 +0000`)
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
            note,
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
