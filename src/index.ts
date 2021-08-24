import * as net from "net";
const moment = require('moment');

import { fGenerateToken } from "./Lib/HashFunc";
import { User } from "./Modules/User/User";
import { default_room } from "./Modules/Room/IRoom";

import { g_aSocketClient } from "./Modules/socketClient";
import { UserListRoute } from "./Modules/Message/RouteCtrl/UserListRoute";
import { g_vRooms } from "./Modules/Room/ARoom";
import { g_vMsgRouter } from "./Modules/Message/MsgRouter";

/**
 * The current date
 */
const fGetNowDataStr = (): string => moment().format('DD.MM.YYYY HH:mm:ss');

let userId = 0;

// our clients



/**
 * Server handler
 */
const server = net.createServer(async (socket: net.Socket) => {

    const vUser = new User();
    vUser.id = userId;
    userId++;

    /* we generate a token to the client */
    vUser.token = fGenerateToken();

    // add client info to shared memmory
    g_aSocketClient[vUser.token] = {
        vUser: vUser,
        socket: socket,
    };

    // say all new client enter
    // vMsgRouter.faSendMsgAll({
    //     from: '',
    //     to: '',
    //     content: `Client ${vUser.token} connected.`,
    // });

    console.log(`[${fGetNowDataStr()}] Client connect ${vUser.username} \r\n`);
    g_vRooms.aRoom[default_room].fJoin(vUser);

    await UserListRoute.faReloadUserList(g_vRooms);


    /* receiving data from a client */
    socket.on('data', async (data: Buffer) => {
        g_vMsgRouter.faOnReserveMsg(vUser.token, data);
    });

    /* client disconnect */
    socket.on('close', () => {
        console.log(`[${fGetNowDataStr()}] Client ${vUser.username} disconnect`);
        g_vRooms.fLeft(vUser.token);
        delete g_aSocketClient[vUser.token];

        // say all client exit
        g_vMsgRouter.faSendMsgAll({
            from: vUser.token,
            to: '',
            route:'msg_room',
            content: `Client ${vUser.username} disconnected.`,
        });

        // reload user list from all client
        UserListRoute.faReloadUserList(g_vRooms);
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

