const {
    errors,
    APIError
} = require('../utils/exceptions')
const {
    onUpdated
} = require('../utils/session')
const {
    calculateHours
} = require('../utils/functions')

// Import Model
const Attendance = require('../models/Attendance')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const session = req.user
        const {
            date = null,
        } = req.body

        let start = new Date()
        start.setHours(0, 0, 0, 0)

        let end = new Date()
        end.setHours(23, 59, 59, 999)

        let minCheckout = new Date();
        minCheckout.setHours(16, 0, 0, 0)

        const rules = [{
            $match: {
                'createdBy.email': session.email,
                createdAt: {
                    $gte: start,
                    $lt: end
                }
            },
        }]
        const checkUser = await Attendance.aggregate(rules)
        if (new Date(date) <= minCheckout) throw new APIError({
            code: 422,
            message: 'Belum waktu untuk checkout',
        })

        if (checkUser.length <= 0) throw new APIError({
            code: 422,
            message: 'Belum melakukan checkin',
        })

        const data = {
            endDate: date,
            officeHours: calculateHours(checkUser[0].startDate, new Date(date)),
            ...onUpdated(session)
        }

        const results = await Attendance.findByIdAndUpdate(checkUser[0]._id, data)

        await res.status(201).send({
            message: 'Update data successfull',
            data: results,
        })

    } catch (error) {
        console.log(error)
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
