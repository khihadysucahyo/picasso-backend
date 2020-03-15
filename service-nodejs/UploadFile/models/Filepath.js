const mongoose = require('mongoose')
const { v4 } = require('uuid')
const uuid4 = v4()
const Schema = mongoose.Schema

const Filepath = new Schema({
    _id: {
        type: String,
        default: uuid4,
    },
    filePath: {
        type: String,
        require: true
    },
    fileURL: {
        type: String,
        require: true
    },
    createByID: {
        type: String,
        require: false
    },
    createByName: {
        type: String,
        require: false
    }
})

Filepath.index({ createByID: 1 })

module.exports = mongoose.models.Filepath || mongoose.model('Filepath', Filepath)
