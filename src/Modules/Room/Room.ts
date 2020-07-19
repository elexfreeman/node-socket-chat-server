import { IRoom } from "./IRoom";
import { User } from "../User/User";

export class Room implements IRoom {
    public token: string;
    public caption: string;
    public aClient: string[];

    public fJoin(user: User) {
        this.aClient.push(user.token);
    }

    public fLeft(user: User) {
        const index = this.aClient.indexOf(user.token);
        if (index > -1) {
            this.aClient.splice(index, 1);
        }
    }
}