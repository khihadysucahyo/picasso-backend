const {
    errors,
} = require('../utils/exceptions')
const moment = require('moment')
moment.locale('id')

// Import Model
const Attendance = require('../models/Attendance')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const session = req.user

        let start = moment().set({
            "hour": 0,
            "minute": 0,
            "second": 0
        }).format()

        let end = moment().set({
            "hour": 23,
            "minute": 59,
            "second": 59
        }).format()
        const rules = [{
            $match: {
                'createdBy.email': session.email,
                updatedAt: {
                    $gte: new Date(start),
                    $lt: new Date(end)
                }
            },
        }]
        const checkUserCheckout = await Attendance.aggregate(rules)
        if (checkUserCheckout.length >= 1) {
            res.status(201).send({
                isCheckout: true,
            })
        } else {
            res.status(201).send({
                isCheckout: false,
            })
        }
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
