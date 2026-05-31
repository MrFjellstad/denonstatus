'use strict';

process.env.NODE_ENV = 'test';

const t = require('tap');

t.test('config loads without errors', (t) => {
    t.doesNotThrow(() => require('../bin/config'));
    t.end();
});

t.test('config provides expected keys', (t) => {
    const config = require('../bin/config');
    t.ok(config.get('reciever'), 'reciever should be defined');
    t.ok(config.get('port'), 'port should be defined');
    t.ok(config.get('env'), 'env should be defined');
    t.end();
});

t.test('config env is set to test', (t) => {
    const config = require('../bin/config');
    t.equal(config.get('env'), 'test');
    t.end();
});

t.test('config port is a valid port number', (t) => {
    const config = require('../bin/config');
    const port = config.get('port');
    t.type(port, 'number');
    t.ok(port > 0 && port <= 65535, 'port is within valid range');
    t.end();
});

t.test('config reciever is a string', (t) => {
    const config = require('../bin/config');
    const reciever = config.get('reciever');
    t.type(reciever, 'string');
    t.ok(reciever.length > 0, 'reciever is non-empty string');
    t.end();
});

t.test('config test.json sets reciever to 127.0.0.1', (t) => {
    const config = require('../bin/config');
    t.equal(config.get('reciever'), '127.0.0.1');
    t.end();
});

t.test('config test.json sets port to 3001', (t) => {
    const config = require('../bin/config');
    t.equal(config.get('port'), 3001);
    t.end();
});
