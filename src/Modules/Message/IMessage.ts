export enum EAddressType {
    Private = 1,
    Room = 2,
    Cmd = 3,
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
    sender?: number;
    to?: string;
    route?: string;
}


export type MsgCallback = (msg: IMessage) => void;


