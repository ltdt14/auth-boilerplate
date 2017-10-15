const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const userController = require('./controller/user.controller');

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
if (!process.env.SESSION_SECRET)
    throw new ReferenceError(
        'You need an .env file with SESSION_SECRET defined'
    );

if (!process.env.SECRET)
    throw new ReferenceError('You need an .env file with SECRET defined');

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
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

app.post(
    '/createlist',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if (!req.body.name || req.body.name === '') {
            res.send({ success: false, msg: 'No name was provided' });
        } else if (
            req.user.codelists.filter(list => {
                return list.name === req.body.name;
            }).length > 0
        ) {
            res.send({ success: false, msg: 'List name must be unique' });
        } else {
            req.user.codelists.push({ name: req.body.name });
            req.user.save(err => {
                if (err) res.send({ success: false, msg: err.message });
                else res.send({ success: true });
            });
        }
    }
);

app.get(
    '/lists',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.send(req.user.codelists);
    }
);

app.post(
    '/createlistitem',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if (!(typeof req.body.listid === 'string') || req.body.listid === '')
            res.send({
                success: false,
                msg: 'No correct list id was provided'
            });
        else if (
            !(typeof req.body.itemname === 'string') ||
            req.body.itemname === ''
        )
            res.send({ success: false, msg: 'No name was provided' });
        else {
            const list = req.user.codelists.id(req.body.listid);
            if (!list || list === null) {
                res.send({ success: false, msg: 'List was not found' });
            } else if (
                list.items.filter(item => {
                    return item.name === req.body.itemname;
                }).length > 0
            ) {
                res.send({
                    success: false,
                    msg: 'Item name must be unique'
                });
            } else {
                list.items.push({ name: req.body.itemname });
                req.user.save(err => {
                    if (err) res.send({ success: false, msg: err.errmsg });
                    else res.send({ success: true });
                });
            }
        }
    }
);

app.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) next(err);
        if (!user) res.send({ success: false, msg: info.message });
        else res.send({ success: true });
    })(req, res, next);
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) next(err);
        if (!user) res.send({ success: false, msg: info.message });
        else {
            const token = jwt.sign(user._doc, process.env.SECRET, {
                expiresIn: 1000000
            });
            res.send({
                success: true,
                token: `JWT ${token}`
            });
        }
    })(req, res, next);
});

app.post(
    '/deletelistitem',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        /*
        userController.removeListItemById(
            req.user,
            req.body.listid,
            req.body.itemid,
            err => {
                if (err) res.send({ success: false, msg: err.message });
                else res.send({ success: true });
            }
        );
        */
        if (typeof req.body.listid !== 'string' || req.body.listid === '')
            res.send({
                success: false,
                msg: 'Listid has wrong type or is empty'
            });
        else if (typeof req.body.itemid !== 'string' || req.body.itemid === '')
            res.send({
                success: false,
                msg: 'Itemid has wrong type or is empty'
            });
        else {
            const list = req.user.codelists.id(req.body.listid);
            if (!list || list === null)
                res.send({ success: false, msg: 'List not found' });
            else {
                const filtered = list.items.id(req.body.itemid);
                if (filtered === null)
                    res.send({ success: false, msg: 'Listitem not found' });
                else {
                    filtered.remove();
                    req.user.save(err => {
                        if (err) res.send({ success: false, msg: err.message });
                        else res.send({ success: true });
                    });
                }
            }
        }
    }
);

app.post(
    '/deletelist',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if (typeof req.body.listid !== 'string' || req.body.listid === '')
            res.send({
                success: false,
                msg: 'Listid has wrong type or is empty'
            });
        else {
            const list = req.user.codelists.id(req.body.listid);
            if (!list || list === null)
                res.send({ success: false, msg: 'List not found' });
            else {
                list.remove();
                req.user.save(err => {
                    if (err) res.send({ success: false, msg: err.message });
                    else res.send({ success: true });
                });
            }
        }
    }
);

// only for testing purposes
app.get('/removetestuser', (req, res) =>
    userController.removeByEmail('test@test.de', err => {
        if (err) res.send({ success: false, msg: err.message });
        else res.send({ success: true });
    })
);

// listen
app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
});

exports.app = app;
