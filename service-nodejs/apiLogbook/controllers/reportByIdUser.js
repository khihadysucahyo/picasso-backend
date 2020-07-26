const {
    errors,
    APIError
} = require('../utils/exceptions')
const { 
    generateReport,
    reportForm 
} = require('../utils/generateReport')
const LogBook = require('../models/LogBook')
const moment = require('moment')
const servers_nats = [process.env.NATS_URI]
const nats = require('nats').connect({
    'servers': servers_nats
})
// eslint-disable-next-line
module.exports = async (req, res, next) => {
    try {
        let sort = {
            dateTask: 1,
        }
        const {
            userId
        } = req.params

        if (!userId) throw new APIError(errors.serverError)

        const rules = [{
                $match: {
                    'createdBy._id': userId,
                },
            },
            {
                '$lookup': {
                    'from': 'blobsfiles',
                    'localField': '_id',
                    'foreignField': 'logBookId',
                    'as': 'blobsEvidence'
                }
            },
            {
                '$unwind': {
                    'path': '$blobsEvidence',
                    'includeArrayIndex': 'arrayIndex'
                }
            },
            {
                '$project': {
                    'dateTask': 1,
                    'projectId': 1,
                    'projectName': 1,
                    'nameTask': 1,
                    'difficultyTask': 1,
                    'isDocumentLink': 1,
                    'isMainTask': 1,
                    'organizerTask': 1,
                    'otherInformation': 1,
                    'workPlace': 1,
                    'evidenceTaskPath': '$evidenceTask.filePath',
                    'evidenceTaskURL': '$evidenceTask.fileURL',
                    'evidenceBlob': '$evidenceTask.fileBlob',
                    'documentTaskPath': '$documentTask.filePath',
                    'documentTaskURL': '$documentTask.fileURL',
                    'blobsEvidence': '$blobsEvidence.blob'
                }
            }
        ]

        // Get logbook
        const logBook = await LogBook
            .aggregate(rules)
            .sort(sort)
        
        // Get logbook per Day
        rules.push({
            $group: {
                _id: "$dateTask",
                items: {
                    $push: '$$ROOT'
                }
            }
        })

        const logBookPerDay = await LogBook
            .aggregate(rules)
            .sort({ _id: 1 })

        if (!logBook) throw new APIError(errors.serverError)       

        nats.requestOne('userDetail', String(userId), {}, 300, async function(response) {
            // `NATS` is the library.
            if (response.code) {
                res.status(500).send(errors.serverError)
            }
            const responseParse = JSON.parse(response)[0]
            const user = JSON.parse(responseParse)
            const layout = reportForm({
                user: user,
                logBook: logBook,
                logBookPerDay: logBookPerDay
            })
            const fullName = `${user.first_name}_${user.last_name}`
            const month = req.query.date || moment().format('YYYY')
            const fileName = `LaporanPLD_${month}_${fullName.replace(/[^\w\s]/gi, '')}.pdf`
            const pdfFile = await generateReport(layout, fileName)

            res.set('Content-disposition', 'attachment; filename=' + fileName.replace(/[-\s]/g, '_'))
            res.set('Content-Type', 'attachment')
            res.status(200).send(pdfFile)
        })
    } catch (error) {
        next(error)
    }
}
