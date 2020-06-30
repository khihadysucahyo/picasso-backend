const mongoose = require('mongoose')
const Schema = mongoose.Schema
const attributes = require('./Attributes')

const Checkin = new Schema({
    checkinAt: {
        type: Date,
        required: false,
        default: null
    },
    checkoutAt: {
        type: Date,
        required: false,
        default: null
    },
    location: {
        type: String,
        required: false,
        default: null
    },
    message: {
      type: String,
      required: false,
      default: null
    },
    ...attributes
})

Checkin.index({
    nameTask: 1
})

module.exports = mongoose.models.Checkin || mongoose.model('Checkin', Checkin)
