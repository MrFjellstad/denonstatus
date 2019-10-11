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

const init = async () => {
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
                power: powerStatus,
            }),
        },
        {
            method: 'GET',
            path: '/input',
            handler: () => ({
                input: inputStatus,
            }),
        },
        {
            method: 'GET',
            path: '/volume',
            handler: () => ({
                volume: currentVolume,
            }),
        },
        {
            method: 'GET',
            path: '/status',
            handler: () => ({
                power: powerStatus,
                input: inputStatus,
                volume: currentVolume,
            }),
        },
    ]);

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running on port ${config.get('port')}`); // eslint-disable-line
    });
};

init();
