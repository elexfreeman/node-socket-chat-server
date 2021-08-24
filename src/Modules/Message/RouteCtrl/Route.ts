import { ARoom } from "../../Room/ARoom";
import { g_aSocketClient } from "../../socketClient";
import { IMessage } from "../IMessage";
import { Message } from "../Message";


export class Route {

    protected vReq: Message;

    protected sRoute: string = '';

    constructor(vReq: Message) {
        this.vReq = vReq;
        this.sRoute = vReq.route;
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
            g_aSocketClient[vMsg.to].socket.write(JSON.stringify(vMsg));
        } catch {
            resp = false;
        }
        return resp;
    }

}