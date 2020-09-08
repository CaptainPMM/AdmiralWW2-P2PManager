import ISerializable from "./ISerializable";

export default class Peer implements ISerializable {
    public peerIP: string;
    public peerPort: number;

    constructor(peerIP: string, peerPort: number) {
        this.peerIP = peerIP;
        this.peerPort = peerPort;
    }

    public toJSON(): string {
        return JSON.stringify({
            peerIP: this.peerIP,
            peerPort: this.peerPort,
        });
    }
}
