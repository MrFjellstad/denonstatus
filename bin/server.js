const Hapi = require('@hapi/hapi');
const config = require('./config');

const createServer = async (state) => {
    const server = Hapi.Server({
        port: config.get('port'),
        host: 'localhost',
    });

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: () => 'Denon status API',
        },
        {
            method: 'GET',
            path: '/power',
            handler: () => ({
                power: state.power,
            }),
        },
        {
            method: 'GET',
            path: '/input',
            handler: () => ({
                input: state.input,
            }),
        },
        {
            method: 'GET',
            path: '/volume',
            handler: () => ({
                volume: state.volume,
            }),
        },
        {
            method: 'GET',
            path: '/status',
            handler: () => ({
                power: state.power,
                input: state.input,
                volume: state.volume,
            }),
        },
    ]);

    return server;
};

module.exports = { createServer };
