import { g_vRooms } from "../../Room/ARoom";
import { Room } from "../../Room/Room";
import { g_aSocketClient } from "../../socketClient";
import { IMessage } from "../IMessage";
import { Message } from "../Message";
import { MessageValidator } from "../MessageValidator";
import { Route } from "./Route"

export class MsgRoomRoute extends Route {

    constructor(vReq: Message) {
        super(vReq);
        this.sRoute = 'msg_room';
    }

    public async faAction(sRoute: string): Promise<boolean> {
        console.log('sRouter', sRoute);

        if (sRoute !== this.sRoute) {
            return false;
        }

        try {
            this.vReq.sender = g_aSocketClient[this.vReq.from].vUser.id;
            // received messages from the room
            console.log(`Msg from ${this.vReq.from} >>`, this.vReq.content);
            await this.faSendMsgToRoom(this.vReq, g_vRooms.aRoom[this.vReq.to]);
        } catch (e) {
            console.log(e);
        }

    }


    /**
     * Sends a message to the room
     * @param msg 
     * @param room 
     */
    private async faSendMsgToRoom(data: IMessage, room: Room): Promise<boolean> {

        if (!g_vRooms.aRoom[room.token]) {
            throw 'This room is not exist!';
        }

        // we sort out clients in the room and send them messages
        for (let k = 0; k < room.aClient.length; k++) {
            // try-catch so how can there be no client 
            try {
                if (room.aClient[k] == data.from) { continue }

                const msg = MessageValidator.Build(data);
                msg.route = this.sRoute;
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