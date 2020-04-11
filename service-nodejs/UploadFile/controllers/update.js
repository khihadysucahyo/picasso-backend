// var deleteParam = {
//     Bucket: 'hrs-jds',
//     Delete: {
//         Objects: [
//             {Key: 'foto-profile/1584197438854_file.txt'}
//         ]
//     }
// };
// s3.deleteObjects(deleteParam, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else console.log('delete', data);
// });

const { errors } = require('../utils/exceptions')

// Import Model
const Filepath = require('../models/Filepath')

module.exports = async (req, res) => { // eslint-disable-line
    try {
        const { id: _id } = req.params

        const {
            filePath = null,
            fileURL = null
        } = req.body

        const data = {
            filePath,
            fileURL
        }

        await Filepath.findOneAndUpdate({ _id }, data)

        res.status(201).send({
            message: 'Update data successfull',
            data,
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
