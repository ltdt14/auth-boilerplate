const expect = require('chai').expect;
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// load env vars if .env exists
if (fs.existsSync(path.join(__dirname, '../../../.env'))) dotenv.load();
const Log = require('../models/Log');

const logController = require('../controller/log.controller');
const api = require('../index');

describe('controller', () => {
    describe('create log', () => {
        it('should create log', async () => {
            let result;
            try {
                result = await logController.createLog('test', 'test');
            } catch (createErr) {
                throw createErr;
            }
            expect(result.success).to.equal(true);
        });

        it('should not create log because param route is null', async () => {
            try {
                await logController.createLog(null, 'test');
            } catch (createErr) {
                expect(createErr).to.not.equal(null);
            }
        });

        it('should not create log because param log is null', async () => {
            try {
                await logController.createLog('test', null);
            } catch (createErr) {
                expect(createErr).to.not.equal(null);
            }
        });
    });

    after(async () => {
        let logs;
        try {
            logs = await Log.find({ route: 'test' }).exec();
        } catch (err) {
            throw new Error('Deleting test items failed');
        }
        await Promise.all(
            logs.map(async log => {
                try {
                    await log.remove();
                } catch (removeErr) {
                    throw new Error('Deleting test items failed');
                }
            })
        );
    });
});

describe('api', () => {
    describe('create log', () => {
        it('should create log', async () => {
            let result;
            try {
                result = await api.createLog('test', 'test');
            } catch (createErr) {
                throw createErr;
            }
            expect(result.success).to.equal(true);
        });

        it('should not create log because param route is null', async () => {
            try {
                await api.createLog(null, 'test');
            } catch (createErr) {
                expect(createErr).to.not.equal(null);
            }
        });

        it('should not create log because param log is null', async () => {
            try {
                await api.createLog('test', null);
            } catch (createErr) {
                expect(createErr).to.not.equal(null);
            }
        });
    });

    after(async () => {
        let logs;
        try {
            logs = await Log.find({ route: 'test' }).exec();
        } catch (err) {
            throw new Error('Deleting test items failed');
        }
        await Promise.all(
            logs.map(async log => {
                try {
                    await log.remove();
                } catch (removeErr) {
                    throw new Error('Deleting test items failed');
                }
            })
        );
    });
});
