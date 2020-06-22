"use strict";

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');

// Import middleware
const env = process.env.NODE_ENV;
try {
    switch (env) {
        case 'undefined':
            require('dotenv').config();
            break;
        case 'development':
            require('dotenv').config({
                path: path.resolve(process.cwd(), '../../.env')
            });
            break;
        default:
            Error('Unrecognized Environment');
    }
} catch (err) {
    Error('Error trying to run file');
}

const authenticate = require('./controllers/authenticate');

const app = express();
const db = require("./utils/database").mongoURI;

// default options
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

const connectWithRetry = function () {
    return mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log("mongoDB Connected");
        }
    });
};
connectWithRetry();

mongoose.Promise = global.Promise;

// Authentications
app.use(authenticate);

// Import models
app.set('models', mongoose.models);

// Import modules
const route = require('./routes');

//routes
app.use('/api/logbook', route);

app.listen(8202, () => {
    console.log(`Api Logbook service listening on port 8202`);
});
//# sourceMappingURL=index.js.map