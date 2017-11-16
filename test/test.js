'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const server = require('../index').app;

//test specific user controller
const testUserController = require('./controller/user.controller');

chai.use(chaiHttp);

describe('api', () => {
    let token;
    let lists;

    describe('signup', () => {
        it('should sign up', done => {
            chai
                .request(server)
                .post('/signup')
                .send({ email: 'test@test.de', password: 'password' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });
        it('should not sign up', done => {
            chai
                .request(server)
                .post('/signup')
                .send({ email: 'test@test.de', password: 'password' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('Email already exists.');
                    done();
                });
        });

        it('should not sign up empty username', done => {
            chai
                .request(server)
                .post('/signup')
                .send({ email: '', password: 'password' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('Missing credentials');
                    done();
                });
        });

        it('should not sign up empty password', done => {
            chai
                .request(server)
                .post('/signup')
                .send({ email: 'test2@test.de', password: '' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('Missing credentials');
                    done();
                });
        });

        it('should not sign up empty password', done => {
            chai
                .request(server)
                .post('/signup')
                .send({ email: 'test2@test.de', password: null })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('Missing credentials');
                    done();
                });
        });

        it('should not sign up empty password', done => {
            chai
                .request(server)
                .post('/signup')
                .send({ email: 'test2@test.de', password: undefined })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('Missing credentials');
                    done();
                });
        });

        it('should not sign up empty password', done => {
            chai
                .request(server)
                .post('/signup')
                .send({ email: 'test2@test.de', password: { hello: 1 } })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('Missing credentials');
                    done();
                });
        });
    });

    describe('login', () => {
        it('should login', done => {
            chai
                .request(server)
                .post('/login')
                .send({ email: 'test@test.de', password: 'password' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(true);
                    token = res.body.token;
                    done();
                });
        });

        it('should not login', done => {
            chai
                .request(server)
                .post('/login')
                .send({ email: 'test@tes.de', password: 'password' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('Incorrect username.');
                    done();
                });
        });

        it('should not login', done => {
            chai
                .request(server)
                .post('/login')
                .send({ email: 'test@test.de', password: 'passwor' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('Incorrect password.');
                    done();
                });
        });
    });

    describe('create list', () => {
        it('should create a list', done => {
            chai
                .request(server)
                .post('/createlist')
                .set('Authorization', token)
                .send({ name: 'mylist' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('should not create a list - duplicate list name', done => {
            chai
                .request(server)
                .post('/createlist')
                .set('Authorization', token)
                .send({ name: 'mylist' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('List name must be unique');
                    done();
                });
        });

        it('should not create a list - no token', done => {
            chai
                .request(server)
                .post('/createlist')
                .send({ name: 'mylist' })
                .end((err, res) => {
                    expect(err.response.text).to.equal('Unauthorized');
                    done();
                });
        });

        it('should not create a list - no list name', done => {
            chai
                .request(server)
                .post('/createlist')
                .set('Authorization', token)
                .send({ name: '' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('No name was provided');
                    done();
                });
        });

        it('should not create a list - list name is object', done => {
            chai
                .request(server)
                .post('/createlist')
                .set('Authorization', token)
                .send({ name: null })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('No name was provided');
                    done();
                });
        });

        it('should not create a list - list name is function', done => {
            chai
                .request(server)
                .post('/createlist')
                .set('Authorization', token)
                .send({
                    name: function test() {
                        console.log('test');
                    }
                })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('No name was provided');
                    done();
                });
        });
    });

    describe('get lists', () => {
        it('should get the lists', done => {
            chai
                .request(server)
                .get('/lists')
                .set('Authorization', token)
                .end((err, res) => {
                    lists = res.body;
                    expect(res.body[0].name).to.equal('mylist');
                    done();
                });
        });

        it('should not the lists - no token', done => {
            chai.request(server).get('/lists').end((err, res) => {
                expect(err.response.text).to.equal('Unauthorized');
                done();
            });
        });
    });

    describe('create list item', () => {
        it('should create a list item', done => {
            chai
                .request(server)
                .post('/createlistitem')
                .set('Authorization', token)
                .send({ listid: lists[0]['_id'], itemname: 'myitem' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('should not create a list item - duplicate item name', done => {
            chai
                .request(server)
                .post('/createlistitem')
                .set('Authorization', token)
                .send({ listid: lists[0]['_id'], itemname: 'myitem' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('Item name must be unique');
                    done();
                });
        });

        it('should not create a list item - no token', done => {
            chai
                .request(server)
                .post('/createlistitem')
                .send({ listid: lists[0]['_id'], itemname: 'myitem' })
                .end((err, res) => {
                    expect(err.response.text).to.equal('Unauthorized');
                    done();
                });
        });

        it('should not create a list item - no list id', done => {
            chai
                .request(server)
                .post('/createlistitem')
                .set('Authorization', token)
                .send({ listid: '', itemname: 'myitem' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal(
                        'No correct list id was provided'
                    );
                    done();
                });
        });

        it('should not create a list item - list id wrong type', done => {
            chai
                .request(server)
                .post('/createlistitem')
                .set('Authorization', token)
                .send({ listid: null, itemname: 'myitem' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal(
                        'No correct list id was provided'
                    );
                    done();
                });
        });

        it('should not create a list item - list not existent', done => {
            chai
                .request(server)
                .post('/createlistitem')
                .set('Authorization', token)
                .send({ listid: 'test', itemname: 'myitem' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('List was not found');
                    done();
                });
        });

        it('should not create a list item - no item name', done => {
            chai
                .request(server)
                .post('/createlistitem')
                .set('Authorization', token)
                .send({ listid: lists[0]['_id'], itemname: '' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('No name was provided');
                    done();
                });
        });

        it('should not create a list item - item name wrong type', done => {
            chai
                .request(server)
                .post('/createlistitem')
                .set('Authorization', token)
                .send({ listid: lists[0]['_id'], itemname: null })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('No name was provided');
                    done();
                });
        });
    });

    describe('update list (only for testing purposes)', () => {
        it('should get the lists', done => {
            chai
                .request(server)
                .get('/lists')
                .set('Authorization', token)
                .end((err, res) => {
                    lists = res.body;
                    expect(res.body[0].name).to.equal('mylist');
                    done();
                });
        });
    });

    describe('delete list item', () => {
        it('should not delete the list item - wrong list id', done => {
            chai
                .request(server)
                .post('/deletelistitem')
                .set('Authorization', token)
                .send({
                    listid: 'jlksjlfkjslf',
                    itemid: lists[0].items[0]['_id']
                })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('List not found');
                    done();
                });
        });

        it('should not delete the list item - wrong list id type', done => {
            chai
                .request(server)
                .post('/deletelistitem')
                .set('Authorization', token)
                .send({ listid: null, itemid: lists[0].items[0]['_id'] })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal(
                        'Listid has wrong type or is empty'
                    );
                    done();
                });
        });

        it('should not delete the list item - wrong item id', done => {
            chai
                .request(server)
                .post('/deletelistitem')
                .set('Authorization', token)
                .send({ listid: lists[0]['_id'], itemid: 'kjkdfjksfjka' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('Listitem not found');
                    done();
                });
        });

        it('should not delete the list item - wrong item id type', done => {
            chai
                .request(server)
                .post('/deletelistitem')
                .set('Authorization', token)
                .send({ listid: lists[0]['_id'], itemid: null })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal(
                        'Itemid has wrong type or is empty'
                    );
                    done();
                });
        });

        it('should delete the list item', done => {
            chai
                .request(server)
                .post('/deletelistitem')
                .set('Authorization', token)
                .send({
                    listid: lists[0]['_id'],
                    itemid: lists[0].items[0]['_id']
                })
                .end((err, res) => {
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });
    });

    describe('delete list', () => {
        it('should not delete the list - wrong list id', done => {
            chai
                .request(server)
                .post('/deletelist')
                .set('Authorization', token)
                .send({ listid: 'jlksjlfkjslf' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal('List not found');
                    done();
                });
        });

        it('should not delete the list - wrong list id type', done => {
            chai
                .request(server)
                .post('/deletelist')
                .set('Authorization', token)
                .send({ listid: null })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal(
                        'Listid has wrong type or is empty'
                    );
                    done();
                });
        });

        it('should not delete the list - list id is empty', done => {
            chai
                .request(server)
                .post('/deletelist')
                .set('Authorization', token)
                .send({ listid: '' })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    expect(res.body.msg).to.equal(
                        'Listid has wrong type or is empty'
                    );
                    done();
                });
        });

        it('should delete the list', done => {
            chai
                .request(server)
                .post('/deletelist')
                .set('Authorization', token)
                .send({ listid: lists[0]['_id'] })
                .end((err, res) => {
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });
    });

    after(async () => {
        try {
            await testUserController.removeByEmail('test@test.de');
        } catch (removeErr) {
            throw new Error('Test user could not be deleted!');
        }
    });
});
