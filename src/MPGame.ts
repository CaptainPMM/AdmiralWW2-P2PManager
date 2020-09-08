import ISerializable from "./ISerializable";
import Token from "./Token";
import Peer from "./Peer";

export default class MPGame implements ISerializable {
    public name: string;
    public hostIP: string;
    public hostPort: number;

    public onNewPeer: NewPeerEvent | undefined;

    private token: Token;

    public constructor(name: string, hostIP: string, hostPort: number) {
        this.name = name;
        this.hostIP = hostIP;
        this.hostPort = hostPort;

        this.token = new Token();
    }

    public getToken(): Token {
        return this.token;
    }

    public toJSON(): string {
        return JSON.stringify({
            name: this.name,
            hostIP: this.hostIP,
            hostPort: this.hostPort,
        });
    }
}

export interface NewPeerEvent {
    (peer: Peer): void;
}
