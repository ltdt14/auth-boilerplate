'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const server = require('../index').app;

chai.use(chaiHttp);

describe('api', () => {
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
                    expect(res.body.msg).to.equal(
                        'That email is already taken.'
                    );
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

    describe('delete test user', () => {
        it('should delete test user', done => {
            chai.request(server).get('/removetestuser').end((err, res) => {
                expect(res.body.success).to.equal(true);
                done();
            });
        });

        it('should not delete test user', done => {
            chai.request(server).get('/removetestuser').end((err, res) => {
                expect(res.body.success).to.equal(false);
                expect(res.body.msg).to.equal('User not found');
                done();
            });
        });
    });
});
