const User = require('../models/User');

/**
 * Finds user by email.
 * @param {String} email - Email of the user.
 * @returns {Promise} - Data: user
 */
exports.findUser = function findUser(email) {
    return new Promise(async (resolve, reject) => {
        let user;
        try {
            user = await User.findOne({ email: email });
        } catch (findErr) {
            reject(findErr);
        }
        resolve(user);
    });
};

/**
 * Creates new user
 * @param {String} email - Email of the user.
 * @param {String} password - Password of the user.
 * @returns {Promise} - Data: user
 */
exports.createUser = function createUser(email, password) {
    return new Promise(async (resolve, reject) => {
        if (typeof email !== 'string' || email === '')
            reject(new TypeError('Email is not valid string'));
        else if (typeof password !== 'string' || password === '')
            reject(new TypeError('Password is not valid string'));
        else {
            let user;
            try {
                user = await User.findOne({ email: email });
            } catch (findErr) {
                reject(findErr);
            }
            if (user) reject(new Error('Email already exists.'));
            else {
                const newUser = new User();
                newUser.email = email;
                newUser.password = newUser.generateHash(password);

                try {
                    await newUser.save();
                } catch (saveErr) {
                    reject(saveErr);
                }
                resolve(newUser);
            }
        }
    });
};

/**
 * Validates that user exists and password is valid for this user.
 * @param {String} email - Email of the user.
 * @param {String} password - Password of the user.
 * @returns {Promise} - Data: user
 */

exports.validateLogin = function validateLogin(email, password) {
    return new Promise(async (resolve, reject) => {
        let user;
        try {
            user = await User.findOne({ email: email });
        } catch (findErr) {
            reject(findErr);
        }
        if (!user) reject(new Error('Incorrect username.'));
        else if (!user.validPassword(password))
            reject(new Error('Incorrect password.'));
        else resolve(user);
    });
};

