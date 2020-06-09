const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const env = process.env.NODE_ENV
try {
    switch(env) {
        case 'undefined':
            require('dotenv').config();
            break
        case 'development':
            require('dotenv').config({
                path: path.resolve(process.cwd(), '../../.env'),
            })
            break
        default:
            Error('Unrecognized Environment')
    }
} catch (err) {
    Error('Error trying to run file')
}

const authenticate = require('./controllers/authenticate')
const firebase = require('./utils/firebase')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Authentications
app.use(authenticate)

// Import modules
const route = require('./routes')

//routes
app.use('/api/logbook', route)

app.listen(8202, () => {
    console.log(`Api Logbook service listening on port 8202`)
})

