import { IMessage, EErrMsg } from "./IMessage";
import { Message } from "./Message";

export class MessageValidator {
    static Build(msg: IMessage) {
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
        return MessageValidator.Build(JSON.parse(data.toString()))
    }
}