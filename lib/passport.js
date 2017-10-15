const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');

module.exports = (passport) => {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser((user, done) => done(null, user.id));

    // used to deserialize the user
    passport.deserializeUser((id, done) =>
        User.findById(id, (err, user) => done(err, user))
    );

    // signup
    passport.use(
        'local-signup',
        new LocalStrategy(
            {
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            (req, email, password, done) => {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'email': email }, (err, user) => {
                    // if there are any errors, return the error
                    if (err) return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, {
                            message: 'That email is already taken.'
                        });
                    }
                    const newUser = new User();

                    // set the user's local credentials
                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(saveErr => {
                        if (saveErr) return done(saveErr);
                        return done(null, newUser);
                    });
                });
            }
        )
    );

    // login
    passport.use(
        'local-login',
        new LocalStrategy(
            {
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'email',
                passwordField: 'password',
                // allows us to pass back the entire request to the callback
                passReqToCallback: true
            },
            (req, email, password, done) => {
                User.findOne({ 'email': email }, (err, user) => {
                    // if there are any errors, return the error before anything else
                    if (err) return done(err);
                    if (!user)
                        return done(null, false, {
                            message: 'Incorrect username.'
                        });
                    if (!user.validPassword(password))
                        return done(null, false, {
                            message: 'Incorrect password.'
                        });

                    return done(null, user);
                });
            }
        )
    );

    // token auth after login
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: process.env.SECRET
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findOne(
                { 'email': jwt_payload.email },
                (err, user) => {
                    if (err) return done(err, false);
                    if (!user) return done(null, false);
                    return done(null, user);
                }
            );
        })
    );
};