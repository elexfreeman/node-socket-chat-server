import * as net from "net";
const moment = require('moment');

import { fGenerateToken } from "./Lib/HashFunc";
import { User } from "./Modules/User/User";
import { IASocketClient } from "./Modules/SocketClient/ISocketClient";
import { MsgProvider } from "./Modules/Message/MsgProvider";
import { IMessage } from "./Modules/Message/IMessage";
import { ARoom, default_room } from "./Modules/Room/IRoom";
import { RoomFabric } from "./Modules/Room/RoomFabric";

/**
 * The current date
 */
const fGetNowDataStr = (): string => moment().format('DD.MM.YYYY HH:mm:ss');

// our clients
const aSocketClient: IASocketClient = {};

// our rooms
const aRoom: ARoom = {};
// create default room
RoomFabric.fCreateDefaultRoom(aRoom);

const msgProvider = new MsgProvider(aSocketClient, aRoom);



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
    aRoom[default_room].fJoin(user);


    /* receiving data from a client */
    socket.on('data', async (data: Buffer) => {
        msgProvider.faOnReserveMsg(user.token, data);
    });

    /* client disconnect */
    socket.on('end', () => {
        delete aSocketClient[user.token];
        console.log(`[${fGetNowDataStr()}] Client ${user.token} disconnect`);
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
    console.log(`[${fGetNowDataStr()}] Error:`, err);
});


/* start the server */
server.listen({
    port: 3007, family: 'IPv4', address: '127.0.0.1'
}, () => {
    console.log('opened server on', server.address());
});