import * as nats from 'nats';

nats.connect({
    servers: ['localhost:4221', 'localhost:4222', 'localhost:4223',],
}).then(nc => {
    const sub = nc.subscribe('subject');
    (async () => {
        for await (const m of sub) {
            console.log(nats.JSONCodec().decode(m.data));
        }
    })();
});
