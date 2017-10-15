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

exports.removeByEmail = function removeByEmail(email, callback){
    User.findOne({ email }, (err, user) => {
        if(err) callback(err, user);
        if(user) user.remove(err => callback(err, null));
        else callback(new Error('User not found'));
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