import { IMessage, EAddressType } from "./IMessage";
import { MessageFabric } from "./MessageFabric";
import { Room } from "../Room/Room";
import { ARoom } from "../Room/ARoom";

import { aSocketClient } from "../socketClient";

/**
 * The class sends and receives messages from clients
 */
export class MsgSender {

    public rooms: ARoom;

    constructor(rooms: ARoom) {
        this.rooms = rooms;
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