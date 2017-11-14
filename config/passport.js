const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userController = require('../controller/user.controller');

module.exports = passport => {
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
            async (req, email, password, done) => {
                let user;
                try {
                    user = await userController.createUser(email, password);
                } catch (err) {
                    return done(err);
                }
                return done(null, user);
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
            async (req, email, password, done) => {
                let user;
                try {
                    user = await userController.validateLogin(email, password);
                } catch (validateErr) {
                    return done(validateErr);
                }
                return done(null, user);
            }
        )
    );

    // token auth after login
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: process.env.TOKEN_SIGN_SECRET
    };
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            let user;
            try{
                user = await userController.findUser(jwt_payload.email);
            } catch(fingErr) {
                return done(err, false);
            }
            if(!user) return done(null, false);
            else return done(null, user);
        })
    );
};
