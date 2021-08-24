import { IMessage, EAddressType } from "./IMessage";
import { IASocketClient } from "../socketClient/ISocketClient";
import { MessageValidator } from "./MessageValidator";
import { IARoom } from "../Room/IRoom";
import { Room } from "../Room/Room";
import { ARoom, g_vRooms } from "../Room/ARoom";

import { g_aSocketClient } from "../socketClient";
import { Route } from "./RouteCtrl/Route";
import { MsgRoomRoute } from "./RouteCtrl/MsgRoomRoute";
import { UserListRoute } from "./RouteCtrl/UserListRoute";



/**
 * The class sends and receives messages from clients
 */
export class MsgRouter {

    public rooms: ARoom;

    constructor(rooms: ARoom) {
        this.rooms = rooms;
    }

    /**
     * Received message from client 
     * @param token 
     * @param data  
     */
    async faOnReserveMsg(token: string, data: Buffer): Promise<void> {

        const aRoute: Route[] = [];

        try {
            const vMsg = MessageValidator.BuildFromBuffer(data)
            vMsg.from = token;
            vMsg.sender = g_aSocketClient[token].vUser.id;

            if (!vMsg.to) {
                throw "Message contains no addressee"
            }

            aRoute.push(new MsgRoomRoute(vMsg));

            aRoute.push(new UserListRoute(vMsg));

            for (let k = 0; k < aRoute.length; k++) {
                if (await aRoute[k].faAction(vMsg.route)) {
                    break;
                }
            }

        } catch (e) {
            console.log(e);
        }
    }

    /**
     * send msg to client
     * @param msg 
     */
    async faSendMsg(msg: IMessage): Promise<boolean> {
        let resp = true;
        try {
            g_aSocketClient[msg.to].socket.write(JSON.stringify(msg));
        } catch {
            resp = false;
        }
        return resp;
    }

    /**
     * Sends a message to all clients 
     * @param msg 
     */
    async faSendMsgAll(msg: IMessage): Promise<boolean> {
        // The fastest cycle-busting object elements
        const aClientKey = Object.keys(g_aSocketClient);
        for (let i = 0; i < aClientKey.length; i++) {
            // the socket may not exist, try..catch help us
            try {
                g_aSocketClient[aClientKey[i]].socket.write(JSON.stringify(msg));
            } catch { }
        }
        return true;
    }

}

export const g_vMsgRouter = new MsgRouter(g_vRooms);