import MPGame from "./MPGame";
import Token from "./Token";

export default class P2PManager {
    public static inst: P2PManager;

    private mpGames: MPGame[];

    constructor() {
        P2PManager.inst = this;
        this.mpGames = [];
    }

    public stringifyMPGamesList(): string {
        return JSON.stringify({
            mpGames: this.mpGames.map((g) => g.toJSON()),
        });
    }

    public fetchMPGames(): MPGame[] {
        return this.mpGames;
    }

    public fetchMPGame(name: string): MPGame | undefined {
        return this.mpGames.find((g) => g.name == name);
    }

    public fetchMPGameByToken(token: Token): MPGame | undefined {
        return this.mpGames.find((g) => g.getToken().equals(token));
    }

    public registerMPGame(mpGameData: MPGame): boolean {
        if (this.mpGames.findIndex((g) => (g.hostIP == mpGameData.hostIP && g.hostPort == mpGameData.hostPort) || g.name == mpGameData.name) == -1) {
            this.mpGames.push(mpGameData);
            return true;
        } else return false;
    }

    public removeMPGame(token: Token): boolean {
        const index = this.mpGames.findIndex((g) => g.getToken().equals(token));
        if (index != -1) {
            this.mpGames.splice(index, 1);
            return true;
        } else return false;
    }
}
