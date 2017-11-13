const mongoose = require('../lib/mongo_connection');

const logSchema = mongoose.mongoconn.Schema({
    route: String,
    log: String,
    time: Date
});

module.exports = mongoose.mongoconn.model('AuthLogs', logSchema);