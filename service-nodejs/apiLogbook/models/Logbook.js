const mongoose = require('mongoose')
const Schema = mongoose.Schema
const attributes = require('./Attributes')

const LogBook = new Schema({
    dateTask: {
        type: Date,
        required: false,
        default: null
    },
    projectId: {
      type: String,
      required: true,
      default: null
    },
    projectName: {
      type: String,
      required: false,
      default: null
    },
    nameTask: {
        type: String,
        required: false,
        default: null
    },
    startTimeTask: {
        type: Date,
        required: false,
        default: null
    },
    endTimeTask: {
        type: Date,
        required: false,
        default: null
    },
    urgencyTask: {
        type: Number,
        required: false,
        default: null
    },
    difficultyTask: {
        type: Number,
        required: false,
        default: null
    },
    evidenceTask: {
        filePath: {
            type: String,
            required: false,
            default: null,
        },
        fileURL: {
            type: String,
            required: false,
            default: null,
        },
    },
    documentTask: {
        filePath: {
            type: String,
            required: false,
            default: null,
        },
        fileURL: {
            type: String,
            required: false,
            default: null,
        },
    },
    isDocumentLink: {
        type: Boolean,
        required: false,
        default: true
    },
    organizerTask: {
        type: String,
        required: false,
        default: null
    },
    otherInformation: {
        type: String,
        required: false,
        default: null
    },
    ...attributes
})

LogBook.index({ nameTask: 1 })

module.exports = mongoose.models.LogBook || mongoose.model('LogBook', LogBook)
