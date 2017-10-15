const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Item = new mongoose.Schema({
    name: String
});

const CodeList = new mongoose.Schema({
    name: String,
    items: [Item]
});

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    codelists: [CodeList]
});

/**
 * Generates the hash
 * @param password
 * @returns {string} - Hash of the password
 */
userSchema.methods.generateHash = function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Checks if password is correct
 * @param password
 * @returns {boolean} - Result of comparison
 */
userSchema.methods.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
