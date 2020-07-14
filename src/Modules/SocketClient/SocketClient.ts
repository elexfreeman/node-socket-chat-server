import { ISocketClient } from "./ISocketClient";
import { IUser } from "../User/User";
import * as net from "net";


export class SocketClient implements ISocketClient {
    public user: IUser; // user info
    public socket: net.Socket // pointer to client socket

    constructor(client: ISocketClient) {
        this.socket = client.socket;
        this.user = client.user;
    }
}