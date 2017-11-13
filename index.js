const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const logger = require('./components/logger');
const app = express();

//load .env vars
require('./lib/load_env_vars');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
if(process.env.NODE_ENV === 'production'){
    app.use(async (req, res, next) => {
        try{
            await logger.createLog(req.path, `${req.method} from ${req.headers['x-real-ip']} via origin ${req.headers['origin']} with ${req.headers['user-agent']} to ${req.url}`);
        } catch (loggerError) {}
        next();
    });
}

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/lists'));
app.use('/', require('./routes/user'));

// listen
app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
});

exports.app = app;
