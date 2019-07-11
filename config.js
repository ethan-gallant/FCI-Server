const fs = require('fs');
const log = require('./tools').log;
let config = {};

exports.initialize = ()=>{
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    log("Reading configuration file. Config is as follows: " + JSON.stringify(config));
};

exports.get = (key)=>{
    return config[key];
};