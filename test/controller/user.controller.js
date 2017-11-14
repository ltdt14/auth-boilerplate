const User = require('../../models/User');

/**
 * Removes user by email.
 * @param {String} email - Email of the user.
 * @param callback
 */
exports.removeByEmail = function removeByEmail(email, callback) {
    return new Promise(async (resolve, reject) => {
        let user;
        try{
            user = await User.findOne({email});
        } catch(findErr){
            reject(findErr);
        }
        if(!user) reject(new Error('User not found'));
        else{
            try{
                user.remove();
            } catch(removeErr){
                reject(removeErr);
            }
            resolve();
        }
    });
    /*
    User.findOne({ email }, (err, user) => {
        if (err) callback(err, user);
        if (user) user.remove(err => callback(err, null));
        else callback(new Error('User not found'));
    });
    */
};