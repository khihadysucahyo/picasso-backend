const mongoose = require('mongoose')
const { v4 } = require('uuid')
const uuid4 = v4()
const Schema = mongoose.Schema

const LogBook = new Schema({
    _id: {
        type: String,
        default: uuid4,
    },
    date_task: {
        type: String,
        require: true
    },
    name_task: {
        type: String,
        require: true
    },
    start_time_task: {
        type: String,
        require: false
    },
    end_time_task: {
        type: String,
        require: false
    },
    urgency_task: {
        type: Number,
        require: false
    },
    difficulty_task: {
        type: Number,
        require: false
    },
    evidence: {
        type: String,
        require: false
    },
    document: {
        type: String,
        require: false
    },
    organizer_task: {
        type: String,
        require: false
    },
    other_information: {
        type: String,
        require: false
    }
})

LogBook.index({ createByID: 1 })

module.exports = mongoose.models.LogBook || mongoose.model('LogBook', LogBook)
