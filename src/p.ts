import * as nats from 'nats';

const stream = 'stream';
const subject = 'subject';

const message = process.argv[2] || 'Hello!';

let nc: nats.NatsConnection | undefined;
let jsm: nats.JetStreamManager | undefined;
let js: nats.JetStreamClient | undefined;
nats.connect({
    servers: ['localhost:4221', 'localhost:4222', 'localhost:4223',],
}).then(_nc => {
    nc = _nc;
    js = nc.jetstream();
    return nc.jetstreamManager();
}).then(_jsm => {
    jsm = _jsm;
    return jsm!.streams.add({
        name: stream,
        subjects: [subject],
        no_ack: false,
    });
}).then(si => {
    return js!.publish(subject,
        nats.JSONCodec().encode({ hello: message }));
}).then(pa => {
    setTimeout(() => {
        process.exit(0);
    }, 50);
}).catch(error => {
    console.error(error);
})
