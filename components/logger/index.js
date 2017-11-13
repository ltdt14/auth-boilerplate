const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// load env vars if .env exists
if (fs.existsSync(path.join(__dirname, '../../.env'))) dotenv.load();

const logController = require('./controller/log.controller');

exports.createLog = function createLog(route, log){
    return new Promise((resolve, reject) => {
        logController.createLog(route, log).then(
            success => resolve(success),
            error => reject(error)
        )
    });
};