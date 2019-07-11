const config = require('./config');

exports.log = (msg)=>{
    if(config.get("verbose")){
        const date = new Date().toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '');     // delete the dot and everything after
        console.log(`${date} | DEBUG | ${msg}`)
    }
};