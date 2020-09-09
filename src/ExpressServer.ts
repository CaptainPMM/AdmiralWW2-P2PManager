import Express from "express";
import RequestIP from "request-ip";
import P2PManager from "./P2PManager";
import MPGame from "./MPGame";
import ServerError from "./ServerError";
import Token from "./Token";
import Peer from "./Peer";

export default class ExpressServer {
    private readonly JSON_TYPE: string = "application/json";
    private readonly LONG_POLLING_TIMEOUT = 15_000; // in ms
    private readonly PORT: string | number = process.env.PORT || 80;
    private readonly SERVER = Express();

    public constructor(overridePort?: number | undefined) {
        if (overridePort != undefined) this.PORT = overridePort;

        // Setup middleware
        this.SERVER.use(Express.json());
        this.SERVER.use((req, res, next) => {
            console.log("[ * ] Server recieved: " + req.originalUrl);
            next();
        });

        this.setupRoutes();
    }

    public getPort(): string | number {
        return this.PORT;
    }

    public serve(): void {
        this.SERVER.listen(this.PORT, () => {
            console.log("[ * ] ExpressServer listening on " + this.PORT);
        });
    }

    private setupRoutes(): void {
        this.SERVER.get("/", (req, res) => {
            res.status(200).type("text").send("Online");
        });

        this.SERVER.get("/mpgameslist", (req, res) => {
            res.status(200).type(this.JSON_TYPE).send(P2PManager.inst.stringifyMPGamesList());
        });

        this.SERVER.get("/registermpgame", (req, res) => {
            if (req.query.name != undefined && req.query.hostPort != undefined) {
                const hostIP: string | null = RequestIP.getClientIp(req);
                if (hostIP != null) {
                    const newMpGame: MPGame = new MPGame(<string>req.query.name, hostIP, parseInt(<string>req.query.hostPort));
                    const result: boolean = P2PManager.inst.registerMPGame(newMpGame);
                    if (result) res.status(200).type(this.JSON_TYPE).send(newMpGame.getToken().toJSON());
                    else
                        res.status(400)
                            .type(this.JSON_TYPE)
                            .send(new ServerError(400, "REGISTER_MPGAME_DUPLICATE_ERROR", "Could not register a new mutiplayer game. Maybe the name is already used and/or the ip port combination is blocked.").toJSON());
                } else res.status(503).type(this.JSON_TYPE).send(new ServerError(503, "REGISTER_MPGAME_HOST_IP_FAILED_ERROR", "Your (host) public IP could not be detected.").toJSON());
            } else res.status(400).type(this.JSON_TYPE).send(new ServerError(400, "REGISTER_MPGAME_PARAMETERS_MISSING_ERROR", "Please provide all 2 get query parameters (name, hostPort).").toJSON());
        });

        this.SERVER.get("/joinmpgame", (req, res) => {
            if (req.query.name != undefined && req.query.ownPort != undefined) {
                const mpGame: MPGame | undefined = P2PManager.inst.fetchMPGame(<string>req.query.name);
                if (mpGame != undefined) {
                    const peerIP: string | null = RequestIP.getClientIp(req);
                    if (peerIP != null) {
                        if (mpGame.onNewPeer != undefined) {
                            mpGame.onNewPeer(new Peer(peerIP, parseInt(<string>req.query.ownPort)));
                            res.status(200).type(this.JSON_TYPE).send(mpGame.toJSON());
                        } else res.status(418).type(this.JSON_TYPE).send(new ServerError(418, "JOIN_MPGAME_HOST_SLEEPS_ERROR", "The host of the game is currently sleeping, try again.").toJSON());
                    } else res.status(503).type(this.JSON_TYPE).send(new ServerError(503, "JOIN_MPGAME_PEER_IP_FAILED_ERROR", "Your public IP could not be detected.").toJSON());
                } else
                    res.status(400)
                        .type(this.JSON_TYPE)
                        .send(new ServerError(400, "JOIN_MPGAME_NAME_NOT_FOUND_ERROR", "A multiplayer game with the given get query parameter <" + <string>req.query.name + "> does not exist.").toJSON());
            } else res.status(400).type(this.JSON_TYPE).send(new ServerError(400, "JOIN_MPGAME_PARAMETERS_MISSING_ERROR", "Please provide all 2 get query parameters (name, ownPort).").toJSON());
        });

        this.SERVER.get("/listenforjoin", (req, res) => {
            if (req.query.token != undefined) {
                const mpGame: MPGame | undefined = P2PManager.inst.fetchMPGameByToken(Token.parse(<string>req.query.token));
                if (mpGame != undefined) {
                    const timeout: NodeJS.Timeout = setTimeout(() => {
                        mpGame.onNewPeer = undefined;
                        res.status(204).end();
                    }, this.LONG_POLLING_TIMEOUT);
                    mpGame.onNewPeer = (peer: Peer) => {
                        clearTimeout(timeout);
                        mpGame.onNewPeer = undefined;
                        res.status(200).type(this.JSON_TYPE).send(peer.toJSON());
                    };
                } else
                    res.status(400)
                        .type(this.JSON_TYPE)
                        .send(new ServerError(400, "LISTEN_FOR_JOIN_TOKEN_NOT_FOUND_ERROR", "The game with the provided token parameter <" + <string>req.query.token + "> does not exist.").toJSON());
            } else res.status(400).type(this.JSON_TYPE).send(new ServerError(400, "LISTEN_FOR_JOIN_PARAMETERS_MISSING_ERROR", "Please provide the get query parameter (token).").toJSON());
        });

        this.SERVER.get("/startorremovempgame", (req, res) => {
            if (req.query.token != undefined) {
                if (P2PManager.inst.removeMPGame(Token.parse(<string>req.query.token))) {
                    res.status(200).type("text").send("OK");
                } else
                    res.status(400)
                        .type(this.JSON_TYPE)
                        .send(new ServerError(400, "START_OR_REMOVE_MPGAME_TOKEN_NOT_FOUND_ERROR", "The game with the provided token parameter <" + <string>req.query.token + "> does not exist.").toJSON());
            } else res.status(400).type(this.JSON_TYPE).send(new ServerError(400, "START_OR_REMOVE_MPGAME_PARAMETERS_MISSING_ERROR", "Please provide the get query parameter (token).").toJSON());
        });

        // 404 Not found
        this.SERVER.route("*").all((req, res) => {
            res.status(404).type(this.JSON_TYPE).send(new ServerError(404, "REQUEST_NOT_FOUND", "The requested route does not exist.").toJSON());
        });
    }
}
