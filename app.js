const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const appointmentsRouter = require('./routes/appointments');
const patientsRouter = require('./routes/patient');
const db = require('./db');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const log = require("./tools").log;

let app = express();
let config = require("./config.js");
//

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
}));

app.use( (req, res, next) => {
    let authString = null;
    if (req.headers.hasOwnProperty("authorization") || req.headers.hasOwnProperty("Authorization")) {
        authString = req.headers.authorization.replace("FCI Key ", "");
        log("User requested to authenticate via url token.");
        log("Header for authentication sent is: " + authString);
    } else if (req.query.hasOwnProperty("auth")) {
        authString = req.query.auth;
        log("User requested to authenticate via url token.");
        log("Header for authentication sent is: " + authString);
    } else {
        log("User requested to authenticate via useragent.");
        log("UserAgent sent is: " + req.get('User-Agent'));
    }
    console.log("here")
    for (let i = 0; i < config.get("api-keys").length; i++) {
        let currKey = config.get("api-keys")[i];
        if (currKey === req.get('User-Agent') || currKey === authString) {
            next();
            break;
        }
        if (i === config.get("api-keys").length - 1) {
            res.status(403);
            res.end(JSON.stringify({"error": "auth failed."}))
        }
    }
});

app.use('/appointments', appointmentsRouter);
app.use('/patients', patientsRouter);
// catch 404 and forward to error handler
/*app.use( (req, res, next) => {
    next(createError(404));
});*/

// error handler
app.use( (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});


// Connect to MySQL on start

db.connect((err) =>{
    if (err) {
        console.log('Unable to connect to MySQL.')
        process.exit(1)
    } else {
        console.log('connected to mysql server')
    }
})
module.exports = app;
