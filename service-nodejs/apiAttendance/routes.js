const express = require('express')

const router = express.Router()
// Import methods
const checkin = require('./controllers/checkin')
const checkout = require('./controllers/checkout')
const isCheckin = require('./controllers/isCheckin')
const update = require('./controllers/update')
const deleted = require('./controllers/delete')
const list = require('./controllers/list')
const detail = require('./controllers/detail')

router.post('/checkin', checkin)
router.post('/checkout', checkout)
router.put('/:_id', update)
router.delete('/:_id', deleted)
router.get('/:_id', detail)
router.get('/is/checkin', isCheckin)
router.get('/', list)

module.exports = router
