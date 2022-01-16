import * as nats from 'nats';

const stream = 'stream';
const subject = 'subject';
const consumer = 'consumer';

let nc: nats.NatsConnection | undefined;
let jsm: nats.JetStreamManager | undefined;
let js: nats.JetStreamClient | undefined;
nats.connect({
    servers: ['localhost:4221', 'localhost:4222', 'localhost:4223',],
}).then(_nc => {
    nc = _nc;
    js = nc.jetstream();
    return nc.jetstreamManager();
}).then(c => {
    const opts = nats.consumerOpts({
        durable_name: consumer,
        ack_policy: nats.AckPolicy.Explicit,
        deliver_subject: consumer,
    });
    //opts.durable(consumer);
    opts.manualAck();
    //opts.ackExplicit();
    //opts.deliverTo(consumer);

    return js!.subscribe(subject, opts)
}).then(async (jss) => {

    for await (const s of jss) {
        console.log(nats.JSONCodec().decode(s.data));
        s.ack();
    }
}).catch(error => {
    console.error(error);
});
