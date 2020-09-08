import Express from "express";

export default class ExpressServer {
    private readonly PORT: string | number = process.env.PORT || 80;
    private readonly SERVER = Express();

    public constructor(overridePort?: number | undefined) {
        if (overridePort != undefined) this.PORT = overridePort;
        this.SERVER.use(Express.json());
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
            res.send("Online");
        });
    }
}
