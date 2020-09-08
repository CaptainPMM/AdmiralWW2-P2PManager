import ID from "uniqid";
import ISerializable from "./ISerializable";

export default class Token implements ISerializable {
    private token: string;

    constructor() {
        this.token = ID("AW2");
    }

    public toString(): string {
        return this.token;
    }

    public toJSON(): string {
        return JSON.stringify({
            token: this.token,
        });
    }

    public equals(other: Token): boolean {
        return this.token === other.toString();
    }

    public static parse(tokenString: string): Token {
        const t: Token = new Token();
        t.token = tokenString;
        return t;
    }
}
