const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const firebase = require('./utils/firebase')

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

const app = express()
app.use(cors())
app.use(firebase)
app.use(bodyParser.json())

// Import modules
const route = require('./routes')

//routes
app.use('/api/logbook', route)

app.listen(3210, ()=>{
    console.log('Server aktif @port 3210')
})
