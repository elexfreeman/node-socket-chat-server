import { RequestI, Route } from "./Route"
import { aSocketClient } from '../socketClient';
import { Message } from "./Message";
import { ARoom } from "../Room/ARoom";

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
        vMsg.content = JSON.stringify({ user_list: aUser });
        vMsg.route = this.vReq.sRoute;
        vMsg.from = '';
        vMsg.sender = -1;
        vMsg.to = this.vReq.sToken;

        try {
            await this.faSendMsg(vMsg)
        } catch (e) {
            console.log(e);
        }

    }

    static async faReloadUserList(vRooms: ARoom) {
        for (let k in aSocketClient) {
            const v = new UserListRoute({
                vMsg: new Message(),
                sRoute: 'user_list',
                sToken: aSocketClient[k].vUser.token,
                vRooms: vRooms,
            });
            await v.faAction('user_list');
        }
    }

}