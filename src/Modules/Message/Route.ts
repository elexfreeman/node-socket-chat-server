import { ARoom } from "../Room/ARoom";
import { aSocketClient } from "../socketClient";
import { IMessage } from "./IMessage";
import { Message } from "./Message";

export interface RequestI {
    vMsg: Message;
    sRoute: string;
    sToken: string;
    vRooms: ARoom;
}

export class Route {

    protected vReq: RequestI;

    constructor(vReq: RequestI) {
        this.vReq = vReq;
    }

    public async faAction(sRoute: string): Promise<boolean> {
        return false;
    }


    /**
     * send msg to client
     * @param vMsg 
     */
    public async faSendMsg(vMsg: IMessage): Promise<boolean> {
        let resp = true;
        try {
            aSocketClient[vMsg.to].socket.write(JSON.stringify(vMsg));
        } catch {
            resp = false;
        }
        return resp;
    }

}