const express = require('express');
const passport = require('passport');

const router = express.Router();

/**
 * @api {post} /createlist Create List
 * @apiGroup List
 * @apiDescription Creates a new List.
 * @apiParam {String} name Name of the list.
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": true
 *          }
 *      }
 *
 * @apiSuccessExample {json} Error-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": false,
 *              "msg": "Error message"
 *          }
 *      }
 */
router.post(
    '/createlist',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if (!req.body.name || req.body.name === '') {
            res.send({ success: false, msg: 'No name was provided' });
        } else if (
            req.user.codelists.filter(list => {
                return list.name === req.body.name;
            }).length > 0
        ) {
            res.send({ success: false, msg: 'List name must be unique' });
        } else {
            req.user.codelists.push({ name: req.body.name });
            req.user.save(err => {
                if (err) res.send({ success: false, msg: err.message });
                else res.send({ success: true });
            });
        }
    }
);

/**
 * @api {get} /lists Get Lists
 * @apiGroup List
 * @apiDescription Returns all lists.
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": [
 *              {
 *                  "name": "mylist",
 *                  "_id": "59e716c146f5d45e913479b1",
 *                  "items": [
 *                      {
 *                          "name": "itemname",
 *                          "_id": "59e7c71146f5d45e913479b5"
 *                      },
 *                      {
 *                          "name": "other_itemname",
 *                          "_id": "69e7c71146f5d45e913479b6"
 *                      }
 *                  ]
 *              }
 *
 *          ]
 *      }
 *
 * @apiSuccessExample {json} Error-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": false,
 *              "msg": "Error message"
 *          }
 *      }
 */
router.get(
    '/lists',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.send(req.user.codelists);
    }
);

/**
 * @api {post} /createlistitem Create List Item
 * @apiGroup List
 * @apiDescription Creates a new list item.
 * @apiParam {String} listid Id of the list.
 * @apiParam {String} itemname Name of the list item.
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": true
 *          }
 *      }
 *
 * @apiSuccessExample {json} Error-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": false,
 *              "msg": "Error message"
 *          }
 *      }
 */
router.post(
    '/createlistitem',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if (!(typeof req.body.listid === 'string') || req.body.listid === '')
            res.send({
                success: false,
                msg: 'No correct list id was provided'
            });
        else if (
            !(typeof req.body.itemname === 'string') ||
            req.body.itemname === ''
        )
            res.send({ success: false, msg: 'No name was provided' });
        else {
            const list = req.user.codelists.id(req.body.listid);
            if (!list || list === null) {
                res.send({ success: false, msg: 'List was not found' });
            } else if (
                list.items.filter(item => {
                    return item.name === req.body.itemname;
                }).length > 0
            ) {
                res.send({
                    success: false,
                    msg: 'Item name must be unique'
                });
            } else {
                list.items.push({ name: req.body.itemname });
                req.user.save(err => {
                    if (err) res.send({ success: false, msg: err.errmsg });
                    else res.send({ success: true });
                });
            }
        }
    }
);

/**
 * @api {post} /deletelistitem Delete List Item
 * @apiGroup List
 * @apiDescription Deletes a list item.
 * @apiParam {String} listid Id of the list.
 * @apiParam {String} itemid Id of the list item.
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": true
 *          }
 *      }
 *
 * @apiSuccessExample {json} Error-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": false,
 *              "msg": "Error message"
 *          }
 *      }
 */
router.post(
    '/deletelistitem',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        /*
        userController.removeListItemById(
            req.user,
            req.body.listid,
            req.body.itemid,
            err => {
                if (err) res.send({ success: false, msg: err.message });
                else res.send({ success: true });
            }
        );
        */
        if (typeof req.body.listid !== 'string' || req.body.listid === '')
            res.send({
                success: false,
                msg: 'Listid has wrong type or is empty'
            });
        else if (typeof req.body.itemid !== 'string' || req.body.itemid === '')
            res.send({
                success: false,
                msg: 'Itemid has wrong type or is empty'
            });
        else {
            const list = req.user.codelists.id(req.body.listid);
            if (!list || list === null)
                res.send({ success: false, msg: 'List not found' });
            else {
                const filtered = list.items.id(req.body.itemid);
                if (filtered === null)
                    res.send({ success: false, msg: 'Listitem not found' });
                else {
                    filtered.remove();
                    req.user.save(err => {
                        if (err) res.send({ success: false, msg: err.message });
                        else res.send({ success: true });
                    });
                }
            }
        }
    }
);

/**
 * @api {post} /deletelist Delete List
 * @apiGroup List
 * @apiDescription Deletes a list.
 * @apiParam {String} id Id of the list.
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": true
 *          }
 *      }
 *
 * @apiSuccessExample {json} Error-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "body": {
 *              "success": false,
 *              "msg": "Error message"
 *          }
 *      }
 */
router.post(
    '/deletelist',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if (typeof req.body.listid !== 'string' || req.body.listid === '')
            res.send({
                success: false,
                msg: 'Listid has wrong type or is empty'
            });
        else {
            const list = req.user.codelists.id(req.body.listid);
            if (!list || list === null)
                res.send({ success: false, msg: 'List not found' });
            else {
                list.remove();
                req.user.save(err => {
                    if (err) res.send({ success: false, msg: err.message });
                    else res.send({ success: true });
                });
            }
        }
    }
);

module.exports = router;