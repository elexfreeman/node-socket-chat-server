export class Message  {

    public content: string;
    public from: string;
    public to: string;
    public route: string;
    public sender: number;


    static toString(msg: Message) {
        return JSON.stringify({
            content: msg.content,
            from: msg.from,
            to: msg.to,
            route: msg.route,
            sender: msg.sender,
        })
    }

}