import { Route } from "./Route"
import { g_aSocketClient } from '../../socketClient';
import { Message } from "../Message";
import { ARoom } from "../../Room/ARoom";
import { MessageValidator } from "../MessageValidator";

export interface IUserListItem {
    id: number;
    username: string;
}

export class UserListRoute extends Route {

    constructor(vReq: Message) {
        super(vReq);
        this.sRoute = 'user_list';
    }

    public async faAction(sRoute: string): Promise<boolean> {

        const aUser: IUserListItem[] = [];

        if (sRoute !== this.sRoute) {
            return false;
        }

        for (let k in g_aSocketClient) {
            aUser.push({
                id: g_aSocketClient[k].vUser.id,
                username: g_aSocketClient[k].vUser.username,
            })
        }

        const vMsg = new Message();
        vMsg.content = JSON.stringify({ user_list: aUser });
        vMsg.route = this.sRoute;
        vMsg.from = this.vReq.from
        vMsg.sender = this.vReq.sender;
        vMsg.to = this.vReq.from;

        try {
            await this.faSendMsg(MessageValidator.Build(vMsg));
        } catch (e) {
            console.log(e);
        }

    }

    static async faReloadUserList(vRooms: ARoom) {
        for (let k in g_aSocketClient) {

            const vMsg = new Message();
            vMsg.to = g_aSocketClient[k].vUser.token;
            vMsg.from = g_aSocketClient[k].vUser.token;

            const v = new UserListRoute(vMsg);
            await v.faAction('user_list');

        }
    }

}