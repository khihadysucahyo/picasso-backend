const express = require('express')

const router = express.Router()
// Import methods
const create = require('./controllers/create')
const update = require('./controllers/update')
const deleted = require('./controllers/delete')
const list = require('./controllers/list')
const detail = require('./controllers/detail')

router.post('/', create)
router.put('/:_id', update)
router.delete('/:_id', deleted)
router.get('/:_id', detail)
router.get('/', list)

module.exports = router
