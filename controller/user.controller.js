const User = require('../models/User');

/*
exports.findByEmail = function findByEmail(email, callback){
    User.findOne({ email }, (err, codeRes) => callback(err, codeRes));
};

exports.remove = function remove(user, callback){
    if (typeof user === 'object' && code !== null) {
        user.remove(err => callback(err, null));
    } else {
        callback(new TypeError('User was not an User object'), null);
    }
};
*/

/**
 * Removes user by email.
 * @param {String} email - Email of the user.
 * @param callback
 */
exports.removeByEmail = function removeByEmail(email, callback) {
    User.findOne({ email }, (err, user) => {
        if (err) callback(err, user);
        if (user) user.remove(err => callback(err, null));
        else callback(new Error('User not found'));
    });
};

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

/*
exports.removeListItemById = function removeListItem(user, listid, itemid, callback){
    //if(typeof user !== 'obj') callback(new Error('User is not an object'));
    if(typeof listid !== 'string' || listid === '') callback(new Error('Listid has wrong type or is empty'));
    if(typeof itemid !== 'string' || itemid === '') callback(new Error('Itemid has wrong type or is empty'));
    const list = user.codelists.id(listid);
    if(!list || list === null) callback(new Error('List not found'));
    if(list.items.filter(item => {return item['_id'] === itemid}).length === 0) callback(new Error('Listitem not found'));
    list.items.id(itemid).remove();
    user.save(err => {
        if(err) callback(err);
        callback(null);
    })
};
*/
