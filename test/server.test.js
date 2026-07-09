'use strict';

process.env.NODE_ENV = 'test';

const t = require('tap');
const { createServer } = require('../bin/server');

t.test('GET / returns info message', async (t) => {
    const server = await createServer({});
    const res = await server.inject({ method: 'GET', url: '/' });
    t.equal(res.statusCode, 200);
    t.equal(res.result, 'Denon status API');
});

t.test('GET /power returns power status', async (t) => {
    const state = { power: 'ON', input: 'SAT/CBL', volume: '50' };
    const server = await createServer(state);
    const res = await server.inject({ method: 'GET', url: '/power' });
    t.equal(res.statusCode, 200);
    t.same(res.result, { power: 'ON' });
});

t.test('GET /power returns undefined when power not yet received', async (t) => {
    const server = await createServer({});
    const res = await server.inject({ method: 'GET', url: '/power' });
    t.equal(res.statusCode, 200);
    t.same(res.result, { power: undefined });
});

t.test('GET /input returns input status', async (t) => {
    const state = { power: 'ON', input: 'DVD', volume: '40' };
    const server = await createServer(state);
    const res = await server.inject({ method: 'GET', url: '/input' });
    t.equal(res.statusCode, 200);
    t.same(res.result, { input: 'DVD' });
});

t.test('GET /input returns undefined when input not yet received', async (t) => {
    const server = await createServer({});
    const res = await server.inject({ method: 'GET', url: '/input' });
    t.equal(res.statusCode, 200);
    t.same(res.result, { input: undefined });
});

t.test('GET /volume returns current volume', async (t) => {
    const state = { power: 'ON', input: 'TUNER', volume: '55' };
    const server = await createServer(state);
    const res = await server.inject({ method: 'GET', url: '/volume' });
    t.equal(res.statusCode, 200);
    t.same(res.result, { volume: '55' });
});

t.test('GET /volume returns undefined when volume not yet received', async (t) => {
    const server = await createServer({});
    const res = await server.inject({ method: 'GET', url: '/volume' });
    t.equal(res.statusCode, 200);
    t.same(res.result, { volume: undefined });
});

t.test('GET /status returns all state fields', async (t) => {
    const state = { power: 'ON', input: 'HDMI1', volume: '45' };
    const server = await createServer(state);
    const res = await server.inject({ method: 'GET', url: '/status' });
    t.equal(res.statusCode, 200);
    t.same(res.result, { power: 'ON', input: 'HDMI1', volume: '45' });
});

t.test('GET /status reflects live state mutations', async (t) => {
    const state = { power: 'OFF', input: 'SAT/CBL', volume: '30' };
    const server = await createServer(state);

    const resBefore = await server.inject({ method: 'GET', url: '/status' });
    t.same(resBefore.result, { power: 'OFF', input: 'SAT/CBL', volume: '30' });

    state.power = 'ON';
    state.volume = '50';

    const resAfter = await server.inject({ method: 'GET', url: '/status' });
    t.same(resAfter.result, { power: 'ON', input: 'SAT/CBL', volume: '50' });
});

t.test('GET /status returns undefined fields when state is empty', async (t) => {
    const server = await createServer({});
    const res = await server.inject({ method: 'GET', url: '/status' });
    t.equal(res.statusCode, 200);
    t.same(res.result, { power: undefined, input: undefined, volume: undefined });
});

t.test('unknown route returns 404', async (t) => {
    const server = await createServer({});
    const res = await server.inject({ method: 'GET', url: '/nonexistent' });
    t.equal(res.statusCode, 404);
});
