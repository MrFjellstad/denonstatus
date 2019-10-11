const Hapi = require('@hapi/hapi');
const Denon = require('denon-client');
const config = require('./config');

const DenonAVRHost = config.get('reciever');

const denonClient = new Denon.DenonClient(`${DenonAVRHost}`);

let powerStatus;
let inputStatus;
let currentVolume;

denonClient.on('masterVolumeChanged', (volume) => {
    currentVolume = volume;
});

denonClient.on('powerChanged', (state) => {
    powerStatus = state;
});

denonClient.on('inputChanged', (state) => {
    inputStatus = state;
});

denonClient.connect().then(() => denonClient.getPower())
    .then((status) => {
        powerStatus = status;
        return denonClient.getInput();
    })
    .then((status) => {
        inputStatus = status;
        return denonClient.getVolume();
    })
    .then((volume) => {
        currentVolume = volume;
        return `${powerStatus} ${inputStatus}`;
    })

    .catch((error) => {
    // Oh noez.
        console.error(error); // eslint-disable-line
    });


const server = new Hapi.Server();

server.connection({
    port: config.get('port'),
});


server.route([
    {
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            reply('Denon status API');
        },
    },
    {
        method: 'GET',
        path: '/power',
        handler: (request, reply) => {
            reply({
                power: powerStatus,
            });
        },
    },
    {
        method: 'GET',
        path: '/input',
        handler: (request, reply) => {
            reply({
                input: inputStatus,
            });
        },
    },
    {
        method: 'GET',
        path: '/volume',
        handler: (request, reply) => {
            reply({
                volume: currentVolume,
            });
        },
    },
    {
        method: 'GET',
        path: '/status',
        handler: (request, reply) => {
            reply({
                power: powerStatus,
                input: inputStatus,
                volume: currentVolume,
            });
        },
    },
]);

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running on port ${config.get('port')}`); // eslint-disable-line
});
