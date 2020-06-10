const { errors, APIError } = require('../utils/exceptions')
const { onCreated } = require('../utils/session')
// Import Model
const Filepath = require('../models/Filepath')
const { s3 } = require('../utils/aws')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const session = req.session.user
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

                const data = {
                    filePath,
                    fileURL,
                    ...onCreated(session)
                }

                await Filepath.create(data)

                await res.status(201).send({
                    message: 'Input data successfull',
                    data,
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
