import * as net from "net";
import { IUser } from "../User/User";

/**
 * Интерфейс клиента подключенного к соединеню
 */
export interface ISocketClient {
    user?: IUser, // user info
    socket: net.Socket, // pointer to client socket
}

// clients
export interface IASocketClient {
    [key: string]: ISocketClient;
}