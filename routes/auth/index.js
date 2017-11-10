const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();


/**
 * @api {post} /signup Signup
 * @apiGroup Auth
 * @apiDescription Signs up a new user
 * @apiParam {String} email Email of the user.
 * @apiParam {String} password Password of the user.
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": true
 *          }
 *      }
 *
 * @apiSuccessExample {json} Email-taken-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": false,
 *              "msg": "That email is already taken"
 *          }
 *      }
 */
router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) next(err);
        if (!user) res.send({ success: false, msg: info.message });
        else res.send({ success: true });
    })(req, res, next);
});

/**
 * @api {post} /login Login
 * @apiGroup Auth
 * @apiDescription Logs in a user.
 * @apiParam {String} email Email of the user.
 * @apiParam {String} password Password of the user.
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": true,
 *              "token": "someauthtoken"
 *          }
 *      }
 *
 * @apiSuccessExample {json} Credentials-Wrong-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": false,
 *              "msg": "Incorrect password"
 *          }
 *      }
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) next(err);
        if (!user) res.send({ success: false, msg: info.message });
        else {
            const token = jwt.sign(user._doc, process.env.TOKEN_SIGN_SECRET, {
                expiresIn: 1000000
            });
            res.send({
                success: true,
                token: `JWT ${token}`
            });
        }
    })(req, res, next);
});

module.exports = router;