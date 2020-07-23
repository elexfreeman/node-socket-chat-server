import { IARoom } from "./IRoom";


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