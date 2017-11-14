const Mongoose = require('mongoose').Mongoose;

const mongoinstance = new Mongoose();
if (process.env.MONGO_URI) mongoinstance.connect(process.env.MONGO_URI);
else throw new Error('You need to load an .env file with MONGO_URI defined');

// mongo connection etc
const db = mongoinstance.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.info('Server is connected to Mongo DB');
});

exports.mongoconn = mongoinstance;