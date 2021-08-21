import { Room } from "../Room/Room";
import { EAddressType, IMessage } from "./IMessage";
import { MessageFabric } from "./MessageFabric";
import { RequestI, Route } from "./Route"
import { aSocketClient } from '../socketClient';
import { Message } from "./Message";

export interface IUserListItem {
    id: number;
    username: string;
}

export class UserListRoute extends Route {

    constructor(vReq: RequestI) {
        vReq.sRoute = 'user_list';
        super(vReq);
    }

    public async faAction(sRoute: string): Promise<boolean> {
        console.log('sRouter', sRoute);
        const aUser: IUserListItem[] = [];

        if (sRoute !== this.vReq.sRoute) {
            return false;
        }

        for (let k in aSocketClient) {
            aUser.push({
                id: aSocketClient[k].vUser.id,
                username: aSocketClient[k].vUser.username,
            })
        }

        const vMsg = new Message();
        vMsg.content = JSON.stringify(aUser);
        vMsg.route = this.vReq.sRoute;
        vMsg.from = '',
        vMsg.sender = '',
        vMsg.to = this.vReq.sToken;

        try {
            await this.faSendMsg(vMsg)
        } catch (e) {
            console.log(e);
        }

    }



}