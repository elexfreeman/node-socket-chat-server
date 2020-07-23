import { Room } from "./Room";

/**
 * Комнату чатов
 */
export interface IRoom {
    token: string;
    caption: string;
    aClient: string[];
}

export interface IARoom {
    [key: string]: Room;
}

export const default_room = 'default_room';
