const {
    errors,
    APIError
} = require('../utils/exceptions')
const {
    onUpdated
} = require('../utils/session')
const {
    encode
} = require('../utils/functions')
const {
    s3
} = require('../utils/aws')
// Import Model
const Filepath = require('../models/Filepath')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const {
            name,
        } = req.params
        var options = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `image/${name}`,
        }

        s3.getObject(options, function (err, data) {
            if (err) {
                throw new APIError(errors.serverError)
            }
            // const base64str = base64_encode(data.Body)
            const bytes = new Uint8Array(data.Body)
            const blobImage = 'data:image/png;base64,' + encode(bytes)
            res.send(blobImage)
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
