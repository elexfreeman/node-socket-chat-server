import { IMsgProvider, IMessage, EAddressType } from "./IMessage";
import { IASocketClient } from "../socketClient/ISocketClient";
import { MessageFabric } from "./MessageFabric";
import { IARoom } from "../Room/IRoom";
import { Room } from "../Room/Room";
import { ARoom } from "../Room/ARoom";

import { aSocketClient } from "../socketClient";

/**
 * The class sends and receives messages from clients
 */
export class MsgProvider implements IMsgProvider {

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
        try {

            const msg = MessageFabric.BuildFromBuffer(data)

            msg.from = token;

            if (!msg.to) {
                throw "Message contains no addressee"
            }

            // received messages from the room
            if (msg.address_type == EAddressType.Room) {
                console.log(`Msg from ${token} >>`, msg.content);
                await this.faSendMsgToRoom(msg, this.rooms.aRoom[msg.to]);
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

    /**
     * Sends a message to the room
     * @param msg 
     * @param room 
     */
    async faSendMsgToRoom(data: IMessage, room: Room): Promise<boolean> {

        if (!this.rooms.aRoom[room.token]) {
            throw 'This room is not exist!';
        }

        // we sort out clients in the room and send them messages
        for (let k = 0; k < room.aClient.length; k++) {
            // try-catch so how can there be no client 
            try {
                if (room.aClient[k] == data.from) { continue }

                const msg = MessageFabric.Build(data);
                msg.address_type = EAddressType.Room;
                msg.from = room.token;
                msg.to = room.aClient[k];
                await this.faSendMsg(msg);
            } catch (e) {
                console.log(e);
            }
        }

        return true;
    }
}