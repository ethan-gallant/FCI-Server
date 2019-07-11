const mysql = require('mysql');
const config = require('./config');
const log = require('./tools').log;

let state = {
    pool: null,
    mode: null,
};

exports.connect = ()=> {
    log("Connecting to host " + config.get("mysql-host"))
    state.pool = mysql.createPool({
        host: config.get("mysql-host"),
        user: config.get("mysql-user"),
        password: config.get("mysql-password"),
        database: config.get("mysql-database")
    });
};

exports.get = ()=> {
    return state.pool
};
