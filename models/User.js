const bcrypt = require('bcrypt-nodejs');
const mongoose = require('../lib/mongo_connection');

const Item = new mongoose.mongoconn.Schema({
    name: { type: String }
});

const CodeList = new mongoose.mongoconn.Schema({
    name: { type: String },
    items: [Item]
});

const userSchema = mongoose.mongoconn.Schema({
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

module.exports = mongoose.mongoconn.model('User', userSchema);
