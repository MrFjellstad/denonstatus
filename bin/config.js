const convict = require('convict');

// Define a schema
const config = convict({
    env: {
        doc: 'The applicaton environment.',
        format: [
            'production', 'development', 'test',
        ],
        default: 'development',
        env: 'NODE_ENV',
    },
    reciever: {
        doc: 'Reciever adress',
        format: String,
        default: '192.168.1.188',
    },
    port: {
        doc: 'Server port',
        format: 'port',
        default: 3000,
    },
});

// Load environment dependent configuration
const env = config.get('env');
config.loadFile(`./config/${env}.json`);

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;
