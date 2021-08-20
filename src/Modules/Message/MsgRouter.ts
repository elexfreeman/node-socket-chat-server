import { IMessage, EAddressType } from "./IMessage";
import { IASocketClient } from "../socketClient/ISocketClient";
import { MessageFabric } from "./MessageFabric";
import { IARoom } from "../Room/IRoom";
import { Room } from "../Room/Room";
import { ARoom } from "../Room/ARoom";

import { aSocketClient } from "../socketClient";
import { Route } from "./Route";
import { MsgRoomRoute } from "./MsgRoomRoute";

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
            const msg = MessageFabric.BuildFromBuffer(data)
            msg.from = token;
            msg.sender = token;

            if (!msg.to) {
                throw "Message contains no addressee"
            }

            aRoute.push(new MsgRoomRoute({
                vMsg: msg,
                vRooms: this.rooms,
                sRoute: msg.route,
                sToken: token,
            }));

            for (let k = 0; k < aRoute.length; k++) {
                if (await aRoute[k].faAction(msg.route)) {
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
            aSocketClient[msg.to].socket.write(JSON.stringify(msg));
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
        const aClientKey = Object.keys(aSocketClient);
        for (let i = 0; i < aClientKey.length; i++) {
            // the socket may not exist, try..catch help us
            try {
                aSocketClient[aClientKey[i]].socket.write(JSON.stringify(msg));
            } catch { }
        }
        return true;
    }

}