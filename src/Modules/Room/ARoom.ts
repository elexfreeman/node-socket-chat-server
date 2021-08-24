import { default_room, IARoom } from "./IRoom";
import { Room } from "./Room";


/**
 * Array of rooms
 */
export class ARoom {
    public aRoom: IARoom;

    constructor(){
        this.aRoom = {};
    }

    /**
     * user left room
     * @param token 
     */
    public fLeft(token: string) {
        const aKey = Object.keys(this.aRoom);
        for (let i = 0; i < aKey.length; i++) {
            this.aRoom[aKey[i]].fLeft(token);
        }
    }

}

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
// our rooms
export const g_vRooms: ARoom = new ARoom();

// create default room
RoomFabric.fCreateDefaultRoom(g_vRooms);