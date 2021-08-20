import { IMessage, EAddressType } from "./IMessage";

export class Message implements IMessage {

    public content: string;
    public from: string;
    public to: string;
    public route: string;
    public sender: string;


    static toString(msg: Message) {
        return JSON.stringify({
            content: msg.content,
            from: msg.from,
            to: msg.to,
            route: msg.route,
            sender: msg.sender,
        })
    }

}