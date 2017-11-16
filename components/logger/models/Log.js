const mongoose = require('../lib/mongo_connection');

const logSchema = mongoose.mongoconn.Schema({
    route: String,
    log: String,
    time: Date
});

if (!process.env.LOG_COLLECTION_NAME) throw new Error('You need to load an .env file with LOG_COLLECTION_NAME defined');
module.exports = mongoose.mongoconn.model(process.env.LOG_COLLECTION_NAME, logSchema);