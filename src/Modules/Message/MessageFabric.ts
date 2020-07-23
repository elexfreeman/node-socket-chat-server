import { IMessage, EErrMsg } from "./IMessage";
import { Message } from "./Message";

export class MessageFabric {
    static Build(msg: IMessage) {
        let resp = new Message();

        if (!msg) {
            throw EErrMsg.msg_is_empty;
        }

        if (!msg.address_type) {
            throw EErrMsg.address_type;
        }

        resp.content = msg.content;
        resp.from = msg.from;
        resp.to = msg.to;
        resp.address_type = msg.address_type;

        return resp;
    }


    static BuildFromBuffer(data: Buffer) {
        console.log('buffer.length', data.length);
        return MessageFabric.Build(JSON.parse(data.toString()))
    }
}