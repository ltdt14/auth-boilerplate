const Mongoose = require('mongoose').Mongoose;

const mongologconnection = new Mongoose();
if (process.env.MONGO_LOG_URI) mongologconnection.connect(process.env.MONGO_LOG_URI);
else throw new Error('You need to load an .env file with MONGO_LOG_URI defined');

// mongo connection etc
const db = mongologconnection.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.info('Server is connected to Mongo DB');
});

// Use native promises
mongologconnection.Promise = Promise;

exports.mongoconn = mongologconnection;