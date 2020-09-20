// Include Nodejs' net module.
import * as net from "net";
import { MessageFabric } from "./Modules/Message/MessageFabric";
import { default_room } from "./Modules/Room/IRoom";
import { Message } from "./Modules/Message/Message";
import { EAddressType } from "./Modules/Message/IMessage";

import { EventEmitter } from 'events';
import * as readline from 'readline';

// The port number and hostname of the server.
const port = 3007;
const host = '127.0.0.1';

class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();

const client = new net.Socket();

client.connect(port, host, function () {
    console.log(`Connected to server ${host}:${port}`);
    // start the typing event
    myEmitter.emit('event');
});

client.on('data', (data: Buffer) => {
    try {
        const msg = MessageFabric.BuildFromBuffer(data);
        console.log('Received: ' + msg.content);
    } catch (e) {
    }
});

client.on('close', function () {
    console.log('Connection closed');
});


myEmitter.on('event', () => {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.prompt();

    // recerve text from keyboard
    rl.on('line', (line: string) => {

        const m = line.trim();
        const msg = MessageFabric.Build({
            content: m,
            to: default_room,
            from: '',
            address_type: EAddressType.Room,
        });

        // send msg
        client.write(Message.toString(msg));
        rl.prompt();
    }).on('close', () => {
        process.exit(0);
    });
});
