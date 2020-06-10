const mongoose = require('mongoose')
const { v4 } = require('uuid')
const uuid4 = v4()
const Schema = mongoose.Schema
const attributes = require('./Attributes')

const LogBook = new Schema({
    _id: {
        type: String,
        default: uuid4,
    },
    date_task: {
        type: Date,
        required: false,
        default: null
    },
    name_task: {
        type: String,
        required: false,
        default: null
    },
    start_time_task: {
        type: Date,
        required: false,
        default: null
    },
    end_time_task: {
        type: Date,
        required: false,
        default: null
    },
    urgency_task: {
        type: Number,
        required: false,
        default: null
    },
    difficulty_task: {
        type: Number,
        required: false,
        default: null
    },
    evidence: {
        type: String,
        required: false,
        default: null
    },
    document: {
        type: String,
        required: false,
        default: null
    },
    organizer_task: {
        type: String,
        required: false,
        default: null
    },
    other_information: {
        type: String,
        required: false,
        default: null
    },
    ...attributes
})

LogBook.index({ createByID: 1 })

module.exports = mongoose.models.LogBook || mongoose.model('LogBook', LogBook)
