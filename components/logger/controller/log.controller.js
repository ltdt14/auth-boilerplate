const Log = require('../models/Log');

exports.createLog = function createLog(route, log) {
    return new Promise((resolve, reject) => {
        if (typeof route !== 'string')
            reject(new TypeError('Param route has to be a String'));
        else if (typeof log !== 'string')
            reject(new TypeError('Param log has to be a String'));
        else {
            const newLog = new Log();
            newLog.route = route;
            newLog.log = log;
            newLog.time = Date.now();
            newLog
                .save()
                .then(
                    () => resolve({ success: true }),
                    saveErr => reject(saveErr)
                );
        }
    });
};