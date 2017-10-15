const User = require('../models/User');



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

exports.removeByEmail = function removeByEmail(email, callback){
    User.findOne({ email }, (err, user) => {
        if(err) callback(err, user);
        if(user) user.remove(err => callback(err, null));
        else callback(new Error('User not found'));
    });
};