const {
    errors,
    APIError
} = require('../utils/exceptions')
const {
    validationResult
} = require('express-validator')
const {
    onUpdated
} = require('../utils/session')
const {
    calculateHours
} = require('../utils/functions')
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
        } = req.body

        const start = moment().format("YYYY/MM/DD")

        const end = moment().format("YYYY/MM/DD")

        let minCheckout = moment().set({
            "hour": 16,
            "minute": 0,
            "second": 0
        }).format()

        const rulesCheckin = [{
            $match: {
                'createdBy.email': session.email,
                startDate: {
                    $gte: new Date(`${start} 00:00:00`),
                    $lt: new Date(`${end} 23:59:59`)
                }
            },
        }]
        const rulesCheckout = [{
            $match: {
                'createdBy.email': session.email,
                endDate: {
                    $gte: new Date(`${start} 00:00:00`),
                    $lt: new Date(`${end} 23:59:59`)
                }
            },
        }]
        const checkUserCheckin = await Attendance.aggregate(rulesCheckin)
        const checkUserCheckout = await Attendance.aggregate(rulesCheckout)
        day = moment(date).format('dddd')
        arrayWeekend = ['Sabtu', 'Minggu']
        isWeekend = arrayWeekend.includes(day)
        if (!isWeekend && new Date(date) <= new Date(minCheckout)) throw new APIError({
            code: 422,
            message: 'Baru bisa checkout jam 4 sore ya :)',
        })

        if (checkUserCheckin.length <= 0) throw new APIError({
            code: 422,
            message: 'Belum melakukan checkin',
        })
        
        if (checkUserCheckout.length >= 1) throw new APIError({
            code: 422,
            message: 'Sudah melakukan checkout',
        })

        const data = {
            endDate: date,
            officeHours: calculateHours(checkUserCheckin[0].startDate, new Date(date)),
            ...onUpdated(session)
        }

        const results = await Attendance.findByIdAndUpdate(checkUserCheckin[0]._id, data)

        await res.status(201).send({
            message: 'Update data successfull',
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
