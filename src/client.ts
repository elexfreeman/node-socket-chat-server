// Include Nodejs' net module.
import * as net from "net";
import { MessageValidator } from "./Modules/Message/MessageValidator";
import { default_room } from "./Modules/Room/IRoom";
import { Message } from "./Modules/Message/Message";

import { EventEmitter } from 'events';
import * as readline from 'readline';

// The port number and hostname of the server.
const port = 3007;
const host = '127.0.0.1';

class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();

const client = new net.Socket();


const fPrintUserList = (vMsg: Message) => {
    console.log('---------------------');
    console.log('User list');
    const aUser = JSON.parse(vMsg.content);
    for (let k = 0; k < aUser.user_list.length; k++) {
        console.log(`${aUser.user_list[k].id}: ${aUser.user_list[k].username}`);
    }
    console.log('---------------------');
}

client.connect(port, host, function () {
    console.log(`Connected to server ${host}:${port}`);
    // start the typing event
    myEmitter.emit('event');
});

client.on('data', (data: Buffer) => {
    try {
        const vMsg = MessageValidator.BuildFromBuffer(data);
        if (vMsg.route == 'user_list') {
            fPrintUserList(vMsg);
        }
        if (vMsg.route == 'msg_room') {
            console.log('Received: ' + vMsg.content);
        }
    } catch (e) {
        console.log(e);
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
        let sRoute = 'msg_room';

        if (m == 'user_list') {
            sRoute = 'user_list';
        }

        const vMsg = MessageValidator.Build({
            content: m,
            to: default_room,
            from: '',
            route: sRoute,
        });

        // send msg
        client.write(Message.toString(vMsg));
        rl.prompt();
    }).on('close', () => {
        process.exit(0);
    });
});
