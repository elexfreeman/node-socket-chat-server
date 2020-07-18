import { IMessage, EAddressType } from "./IMessage";

export class Message implements IMessage {

    public content: string;
    public from: string;
    public to: string;
    public address_type: EAddressType;


    static toString(msg: Message) {
        return JSON.stringify({
            content: msg.content,
            from: msg.from,
            to: msg.to,
            address_type: msg.address_type,
        })
    }

}