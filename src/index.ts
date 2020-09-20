import * as net from "net";
const moment = require('moment');

import { fGenerateToken } from "./Lib/HashFunc";
import { User } from "./Modules/User/User";
import { MsgProvider } from "./Modules/Message/MsgProvider";
import { default_room } from "./Modules/Room/IRoom";
import { RoomFabric } from "./Modules/Room/RoomFabric";
import { ARoom } from "./Modules/Room/ARoom";

import { aSocketClient } from "./Modules/socketClient";

/**
 * The current date
 */
const fGetNowDataStr = (): string => moment().format('DD.MM.YYYY HH:mm:ss');

// our clients

// our rooms
const rooms: ARoom = new ARoom();
// create default room
RoomFabric.fCreateDefaultRoom(rooms);

const msgProvider = new MsgProvider(rooms);

/**
 * Server handler
 */
const server = net.createServer((socket: net.Socket) => {

    const user = new User();

    /* we generate a token to the client */
    user.token = fGenerateToken();

    // add client info to shared memmory
    aSocketClient[user.token] = {
        user: user,
        socket: socket,
    };

    // say all new client enter
    msgProvider.faSendMsgAll({
        from: '',
        to: '',
        content: `Client ${user.token} connected.`,
    });

    console.log(`[${fGetNowDataStr()}] Client connect ${user.token}`);
    rooms.aRoom[default_room].fJoin(user);


    /* receiving data from a client */
    socket.on('data', async (data: Buffer) => {
        console.log(data.toString());
        msgProvider.faOnReserveMsg(user.token, data);
    });

    /* client disconnect */
    socket.on('close', () => {
        console.log(`[${fGetNowDataStr()}] Client ${user.token} disconnect`);
        rooms.fLeft(user.token);
        delete aSocketClient[user.token];

        // say all client exit
        msgProvider.faSendMsgAll({
            from: '',
            to: '',
            content: `Client ${user.token} disconnected.`,
        });
    });

    /* socket error */
    socket.on('error', (err) => {
        console.log(`[${fGetNowDataStr()}] Error:`, err);
    });

});

/* server error */
server.on('error', (err: any) => {
    console.log(`[${fGetNowDataStr()}] >>> Error:`, err);
});


/* start the server */
server.listen({
    port: 3007, family: 'IPv4', address: '127.0.0.1'
}, () => {
    console.log('opened server on', server.address());
});

