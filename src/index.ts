import * as net from "net";
const moment = require('moment');

import { fGenerateToken } from "./Lib/HashFunc";
import { User } from "./Modules/User/User";
import { MsgRouter } from "./Modules/Message/MsgRouter";
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
const vRooms: ARoom = new ARoom();
// create default room
RoomFabric.fCreateDefaultRoom(vRooms);

const vMsgRouter = new MsgRouter(vRooms);

/**
 * Server handler
 */
const server = net.createServer((socket: net.Socket) => {

    const vUser = new User();

    /* we generate a token to the client */
    vUser.token = fGenerateToken();

    // add client info to shared memmory
    aSocketClient[vUser.token] = {
        vUser: vUser,
        socket: socket,
    };

    // say all new client enter
    vMsgRouter.faSendMsgAll({
        from: '',
        to: '',
        content: `Client ${vUser.token} connected.`,
    });

    console.log(`[${fGetNowDataStr()}] Client connect ${vUser.token}`);
    vRooms.aRoom[default_room].fJoin(vUser);


    /* receiving data from a client */
    socket.on('data', async (data: Buffer) => {
        vMsgRouter.faOnReserveMsg(vUser.token, data);
    });

    /* client disconnect */
    socket.on('close', () => {
        console.log(`[${fGetNowDataStr()}] Client ${vUser.token} disconnect`);
        vRooms.fLeft(vUser.token);
        delete aSocketClient[vUser.token];

        // say all client exit
        vMsgRouter.faSendMsgAll({
            from: '',
            to: '',
            content: `Client ${vUser.token} disconnected.`,
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

