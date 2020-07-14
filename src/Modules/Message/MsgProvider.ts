import { IMsgProvider, MsgCallback, IMessage, EAddressType } from "./IMessage";
import { IASocketClient } from "../SocketClient/ISocketClient";
import { MessageFabric } from "./MessageFabric";
import { IARoom, IRoom } from "../Room/IRoom";
import { Room } from "../Room/Room";

/**
 * Класс отправляет и получает сообщения от клиентов
 */
export class MsgProvider implements IMsgProvider {

    public aClient: IASocketClient;
    public aRoom: IARoom;

    constructor(aClient: IASocketClient, aRoom: IARoom) {
        this.aClient = aClient;
        this.aRoom = aRoom;
    }

    /**
     * Полученно сообщение от клиента
     * @param token - токен клиента
     * @param data  - данные сообщения
     */
    async faOnReserveMsg(token: string, data: Buffer): Promise<void> {
        console.log(data.toString());
        try {

            const msg = MessageFabric.BuildFromBuffer(data)

            msg.from = token;

            if (!msg.to) {
                throw "Message contains no addressee"
            }

            if (!this.aClient[msg.to]) {
                throw "Address is invalid";
            }

            this.faSendMsg({
                to: msg.to,
                from: token,
                content: msg.content,
            });

        } catch (e) {
            this.faSendMsg({
                to: token,
                from: "",
                content: e,
            });
        }
    }

    /**
     * Отправляет сообщение клиенту
     * @param msg 
     */
    async faSendMsg(msg: IMessage): Promise<boolean> {
        let resp = true;
        try {
            this.aClient[msg.from].socket.write(JSON.stringify(msg));
        } catch {
            resp = false;
        }
        return resp;
    }

    /**
     * Отправляет сообщение всем клиентам
     * @param msg 
     */
    async faSendMsgAll(msg: IMessage): Promise<boolean> {
        // The fastest cycle-busting object elements
        const aClientKey = Object.keys(this.aClient);
        for (let i = 0; i < aClientKey.length; i++) {
            // the socket may not exist, try..catch help us
            try {
                this.aClient[aClientKey[i]].socket.write(JSON.stringify(msg));

            } catch { }
        }
        return true;
    }

    /**
     * Отправляет сообщение в комнату
     * @param msg 
     * @param room 
     */
    async faSendMsgToRoom(data: IMessage, room: Room): Promise<boolean> {

        if (!this.aRoom[room.token]) {
            throw 'This room is not exist!';
        }

        const msg = MessageFabric.Build(data);
        msg.address_type = EAddressType.Room;
        msg.to = room.token;

        for (let k = 0; k < room.aClient.length; k++) {
            await this.faSendMsg(msg);
        }

        return true;
    }
}