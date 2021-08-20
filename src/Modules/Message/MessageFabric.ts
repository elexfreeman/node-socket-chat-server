import { IMessage, EErrMsg } from "./IMessage";
import { Message } from "./Message";

export class MessageFabric {
    static Build(msg: IMessage) {
        console.log(msg);
        
        let resp = new Message();

        if (!msg) {
            throw EErrMsg.msg_is_empty;
        }

        if (!msg.route) {
            throw EErrMsg.address_type;
        }

        resp.content = msg.content;
        resp.from = msg.from;
        resp.to = msg.to;
        resp.route = msg.route;
        resp.sender = msg.sender;

        return resp;
    }


    static BuildFromBuffer(data: Buffer) {
        console.log('buffer.length', data.length);
        return MessageFabric.Build(JSON.parse(data.toString()))
    }
}