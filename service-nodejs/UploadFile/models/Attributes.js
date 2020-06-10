const mongoose = require('mongoose')
const mongooseLogs = require('mongoose-activitylogs')

module.exports = {
    createdBy: {
        _id: {
            type: mongoose.Schema.ObjectId,
            required: false,
            default: null,
        },
        email: {
            type: String,
            required: false,
            default: null,
        },
        name: {
            type: String,
            required: false,
            default: null,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedBy: {
        _id: {
            type: mongoose.Schema.ObjectId,
            required: false,
            default: null,
        },
        email: {
            type: String,
            required: false,
            default: null,
        },
        name: {
            type: String,
            required: false,
            default: null,
        },
    },
    updatedAt: {
        type: Date,
        required: false,
        default: null,
    },
}
