const {
    errors,
} = require('../utils/exceptions')

// Import Model
const Attendance = require('../models/Attendance')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const session = req.user

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
        const checkUserCheckin = await Attendance.aggregate(rules)

        if (checkUserCheckin.length >= 1) {
            res.status(201).send({
                isCheckin: true,
            })
        } else {
            res.status(201).send({
                isCheckin: false,
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
