import ISerializable from "./ISerializable";

export default class ServerError implements ISerializable {
    public status: number;
    public type: string;
    public msg: string;

    constructor(status: number, type: string, msg: string) {
        this.status = status;
        this.type = type;
        this.msg = msg;
    }

    public toJSON(): string {
        return JSON.stringify({
            status: this.status,
            type: this.type,
            msg: this.msg,
        });
    }
}
