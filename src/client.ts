// Include Nodejs' net module.
import * as net from "net";
import { MessageFabric } from "./Modules/Message/MessageFabric";
import { default_room } from "./Modules/Room/IRoom";
import { Message } from "./Modules/Message/Message";
import { EAddressType } from "./Modules/Message/IMessage";

const EventEmitter = require('events');


const readline = require('readline');

// The port number and hostname of the server.
const port = 3007;
const host = '127.0.0.1';

var client = new net.Socket();
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();


client.connect(port, host, function () {
    console.log('Connected');
    client.write('Hello, server! Love, Client.');
    myEmitter.emit('event');

});

client.on('data', function (data: Buffer) {
    try {
        const msg = MessageFabric.BuildFromBuffer(data);

        console.log('Received: ' + msg.content);
    } catch (e) {

    }

    //client.destroy(); // kill client after server's response
});

client.on('close', function () {
    console.log('Connection closed');
});


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



rl.prompt();

rl.on('line', (line: string) => {

    const m = line.trim();
    const msg = MessageFabric.Build({
        content: m,
        to: default_room,
        from: '',
        address_type: EAddressType.Room,
    });

    client.write(Message.toString(msg));


    rl.prompt();
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});