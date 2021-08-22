import { Room } from "../Room/Room";
import { aSocketClient } from "../socketClient";
import { EAddressType, IMessage } from "./IMessage";
import { MessageFabric } from "./MessageFabric";
import { RequestI, Route } from "./Route"

export class MsgRoomRoute extends Route {

    constructor(vReq: RequestI) {
        vReq.sRoute = 'msg_room';
        super(vReq);
    }

    public async faAction(sRoute: string): Promise<boolean> {
        console.log('sRouter',sRoute);
        
        if (sRoute !== this.vReq.sRoute) {
            return false;
        }

        try {
            this.vReq.vMsg.from = this.vReq.sToken;
            this.vReq.vMsg.sender = aSocketClient[this.vReq.sToken].vUser.id;
            // received messages from the room
            console.log(`Msg from ${this.vReq.sToken} >>`, this.vReq.vMsg.content);
            await this.faSendMsgToRoom(this.vReq.vMsg, this.vReq.vRooms.aRoom[this.vReq.vMsg.to]);
        } catch (e) {
            console.log(e);
        }

    }


    /**
     * Sends a message to the room
     * @param msg 
     * @param room 
     */
    async faSendMsgToRoom(data: IMessage, room: Room): Promise<boolean> {

        if (!this.vReq.vRooms.aRoom[room.token]) {
            throw 'This room is not exist!';
        }

        // we sort out clients in the room and send them messages
        for (let k = 0; k < room.aClient.length; k++) {
            // try-catch so how can there be no client 
            try {
                if (room.aClient[k] == data.from) { continue }

                const msg = MessageFabric.Build(data);
                msg.route = this.vReq.sRoute;
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