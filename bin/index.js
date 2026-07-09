const Denon = require('denon-client');
const config = require('./config');
const { createServer } = require('./server');

const DenonAVRHost = config.get('reciever');

const denonClient = new Denon.DenonClient(`${DenonAVRHost}`);

const state = {};

denonClient.on('masterVolumeChanged', (volume) => {
    state.volume = volume;
});

denonClient.on('powerChanged', (power) => {
    state.power = power;
});

denonClient.on('inputChanged', (input) => {
    state.input = input;
});

denonClient.connect().then(() => denonClient.getPower())
    .then((status) => {
        state.power = status;
        return denonClient.getInput();
    })
    .then((status) => {
        state.input = status;
        return denonClient.getVolume();
    })
    .then((volume) => {
        state.volume = volume;
        return `${state.power} ${state.input}`;
    })
    .catch((error) => {
    // Oh noez.
        console.error(error); // eslint-disable-line
    });

const init = async () => {
    const server = await createServer(state);
    await server.start();
    console.log(`Server running on port ${config.get('port')}`); // eslint-disable-line
};

init();
