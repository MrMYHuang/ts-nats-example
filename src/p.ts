import * as nats from 'nats';

nats.connect({
    servers: ['localhost:4221', 'localhost:4222', 'localhost:4223',],
}).then(nc => {
    nc.publish('subject',
        nats.JSONCodec().encode({ hello: 'world' })
    );

    setTimeout(() => {
        process.exit(0);
    }, 500);
});
