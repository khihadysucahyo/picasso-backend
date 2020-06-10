const express = require('express')

const router = express.Router()
// Import methods
const create = require('./controllers/create')

router.post('/', create)

module.exports = router
