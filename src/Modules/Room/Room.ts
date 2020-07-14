import { IRoom } from "./IRoom";

export class Room implements IRoom {
    public token: string;
    public caption: string;
    public aClient: string[];
}