import { IMessage, EAddressType } from "./IMessage";

export class Message implements IMessage {

    public content: string;
    public from: string;
    public to: string;
    public address_type: EAddressType;

}