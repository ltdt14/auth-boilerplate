const express = require('express');
const userController = require('../../controller/user.controller');

const router = express.Router();


// only for testing purposes
router.get('/removetestuser', (req, res) =>
    userController.removeByEmail('test@test.de', err => {
        if (err) res.send({ success: false, msg: err.message });
        else res.send({ success: true });
    })
);

module.exports = router;