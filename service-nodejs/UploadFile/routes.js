const express = require('express')

const router = express.Router()
// Import methods
const create = require('./controllers/create')
const update = require('./controllers/update')
// const detail = require('./controllers/detail')

router.post('/', create)
router.put('/:id', update)
// router.get('/', detail)

module.exports = router
