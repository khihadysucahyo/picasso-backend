const {
    body
} = require('express-validator')

module.exports.form = () => [
    body('projectName', 'Nama project tidak boleh kosong').notEmpty(),
    body('nameTask', 'Nama task tidak boleh kosong').notEmpty(),
    body('difficultyTask', 'Bobot task tidak boleh kosong').notEmpty(),
    body('evidenceTask', 'Evidance tidak boleh kosong').notEmpty(),
]
