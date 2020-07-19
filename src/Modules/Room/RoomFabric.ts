import { IRoom, ARoom, default_room } from "./IRoom";
import { Room } from "./Room";

export class RoomFabric {

    static fCreateDefaultRoom(aRoom: ARoom): Room {
        let resp = new Room();

        resp.aClient = [];
        resp.caption = default_room;
        resp.token = default_room;
        aRoom[default_room] = resp;

        return resp;
    }
}