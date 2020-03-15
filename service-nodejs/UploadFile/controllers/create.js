const { errors, APIError } = require('../utils/exceptions')
const path = require('path')
// Import Model
const Filepath = require('../models/Filepath')
const { s3 } = require('../utils/aws')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        if (!req.files || Object.keys(req.files).length === 0) throw new APIError(errors.serverError)
        let params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Body : req.files.file.data,
            Key : "foto-profile/"+Date.now()+"_"+req.files.file.name
        }

        await s3.upload(params, async function (err, data) {
            //handle error
            if (err) {
                throw new APIError(errors.serverError)
            }
            //success
            if (data) {
                const {
                    filePath = data.key,
                    fileURL = data.Location
                } = req.body

                const dataUpload = {
                    filePath,
                    fileURL,
                    createByID: req.user.user_id,
                    createByName: req.user.username
                }

                await Filepath.create(dataUpload)

                await res.status(201).send({
                    message: 'Input data successfull',
                    dataUpload,
                })
            }
        })

    } catch (error) {
        const { code, message, data } = error

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
