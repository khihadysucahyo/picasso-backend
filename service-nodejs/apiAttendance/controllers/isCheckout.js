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

        const start = moment().format("YYYY/MM/DD")

        const end = moment().format("YYYY/MM/DD")

        const rules = [{
            $match: {
                'createdBy.email': session.email,
                endDate: {
                    $gte: new Date(`${start} 00:00:00 +0000`),
                    $lt: new Date(`${end} 23:59:59 +0000`)
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
