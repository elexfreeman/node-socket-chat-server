import { IRoom, IARoom, default_room } from "./IRoom";
import { Room } from "./Room";
import { ARoom } from "./ARoom";

export class RoomFabric {

    static fCreateDefaultRoom(rooms: ARoom): Room {
        let resp = new Room();

        resp.aClient = [];
        resp.caption = default_room;
        resp.token = default_room;
        rooms.aRoom[default_room] = resp;

        return resp;
    }
}