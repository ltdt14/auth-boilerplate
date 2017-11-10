const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');

const app = express();

// load env vars if .env exists
if (fs.existsSync(path.join(__dirname, './.env'))) dotenv.load();

if (process.env.MONGO_URI) mongoose.connect(process.env.MONGO_URI);
else throw new Error('You need to load an .env file with MONGO_URI defined');

// mongo connection etc
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.info('Server is connected to Mongo DB');
});

// check if needed env vars are available
if (!process.env.TOKEN_SIGN_SECRET)
    throw new ReferenceError('You need an .env file with TOKEN_SIGN_SECRET defined');

const port =
    process.env.NODE_ENV === 'production'
        ? process.env.PORT || 3000
        : process.env.DEV_PORT || 3000;

// pass passport for configuration
require('./lib/passport')(passport);

// middleware
// log every request to the console
app.use(morgan(':method :url :status :response-time ms'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/lists'));
app.use('/', require('./routes/user'));

// listen
app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
});

exports.app = app;
