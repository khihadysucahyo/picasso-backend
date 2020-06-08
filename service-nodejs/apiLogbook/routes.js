const express = require('express')

const router = express.Router()
// Import methods
const create = require('./controllers/create')
const list = require('./controllers/list')

router.post('/', create)
router.get('/', list)

module.exports = router
