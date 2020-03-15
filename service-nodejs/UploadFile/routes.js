const express = require('express')

const router = express.Router()
// Import methods
const create = require('./controllers/create')
const update = require('./controllers/update')

router.post('/', create)
router.put('/:id', update)

module.exports = router
