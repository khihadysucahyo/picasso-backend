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
                    'evidenceTaskPath': '$evidenceTask.filePath',
                    'evidenceTaskURL': '$evidenceTask.fileURL',
                    'documentTaskPath': '$documentTask.filePath',
                    'documentTaskURL': '$documentTask.fileURL',
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
            .sort(sort)

    
        if (!logBook) throw new APIError(errors.serverError)       

        const {
            username,
            jabatan
        } = req.user

        const layout = reportForm({
            user: req.user,
            logBook: logBook,
            logBookPerDay: logBookPerDay
        })

        const month = req.query.date || moment().format('YYYY')
        const fileName = `LaporanPLD_${month}_${username}_${jabatan}.pdf`
        const pdfFile = await generateReport(layout, fileName)

        res.set('Content-disposition', 'attachment; filename=' + fileName.replace(/[-\s]/g, '_'))
        res.set('Content-Type', 'attachment')
        res.status(200).send(pdfFile)
    } catch (error) {
        next(error)
    }
}

