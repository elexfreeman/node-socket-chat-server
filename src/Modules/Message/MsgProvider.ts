import { IMsgProvider, IMessage, EAddressType } from "./IMessage";
import { IASocketClient } from "../socketClient/ISocketClient";
import { MessageFabric } from "./MessageFabric";
import { IARoom } from "../Room/IRoom";
import { Room } from "../Room/Room";
import { ARoom } from "../Room/ARoom";

import { aSocketClient } from "../socketClient";

/**
 * Класс отправляет и получает сообщения от клиентов
 */
export class MsgProvider implements IMsgProvider {

    public rooms: ARoom;

    constructor(rooms: ARoom) {
        this.rooms = rooms;
    }

    /**
     * Полученно сообщение от клиента
     * @param token - токен клиента
     * @param data  - данные сообщения
     */
    async faOnReserveMsg(token: string, data: Buffer): Promise<void> {
        try {

            const msg = MessageFabric.BuildFromBuffer(data)

            msg.from = token;

            if (!msg.to) {
                throw "Message contains no addressee"
            }

            // получили сообщенеи из комнаты
            if (msg.address_type == EAddressType.Room) {
                console.log(`Msg from ${token} >>`, msg.content);
                await this.faSendMsgToRoom(msg, this.rooms.aRoom[msg.to]);
            }


        } catch (e) {
            // ошибка при приеме сообщения
            console.log(e);
            // отправляем обратно клиенту ошибку
           /*  this.faSendMsg({
                to: token,
                from: "",
                content: e,
            }); */
        }
    }

    /**
     * Отправляет сообщение клиенту
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
     * Отправляет сообщение всем клиентам
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
     * Отправляет сообщение в комнату
     * @param msg 
     * @param room 
     */
    async faSendMsgToRoom(data: IMessage, room: Room): Promise<boolean> {

        if (!this.rooms.aRoom[room.token]) {
            throw 'This room is not exist!';
        }

        // перебираем клиентов в комнате и отправляем им сообщения
        for (let k = 0; k < room.aClient.length; k++) {
            // try-catch так-как клиента может не быть
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