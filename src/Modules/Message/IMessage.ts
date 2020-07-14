import { IASocketClient } from "../SocketClient/ISocketClient";

export enum EAddressType {
    Private = 1,
    Room = 2,
}

export enum EErrMsg {
    content = 1,
    from = 2,
    to = 3,
    address_type = 4,
    msg_is_empty = 5,
}

export interface IMessage {
    content?: any;
    from?: string;
    to?: string;
    address_type?: EAddressType;
}


export type MsgCallback = (msg: IMessage) => void;

export interface IMsgProvider {
    aClient: IASocketClient;
    faOnReserveMsg: (token: string, data: Buffer) => Promise<void>;
    faSendMsg: (msg: IMessage) => Promise<boolean>;
    faSendMsgAll: (msg: IMessage) => Promise<boolean>;
}

