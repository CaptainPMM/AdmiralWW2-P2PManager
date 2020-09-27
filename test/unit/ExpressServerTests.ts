import Assert from "assert";
import Chai from "chai";
import ChaiHTTP from "chai-http";
import ExpressServer from "../../src/ExpressServer";
import MPGame from "../../src/MPGame";
import P2PManager from "../../src/P2PManager";

Chai.use(ChaiHTTP);

describe("ExpressServer", () => {
    let s: ExpressServer;
    before(() => {
        s = new ExpressServer(1234);
        const p2p: P2PManager = new P2PManager();
    });
    describe("constructor()", () => {
        it("should init a ExpressServer", () => {
            Assert.notStrictEqual(s, undefined, "ExpressServer is undefined");
            Assert.notStrictEqual(s, null, "ExpressServer is null");
        });
    });
    describe("#getPort()", () => {
        it("should return the port the server is listening on", () => {
            Assert.strictEqual(s.getPort(), 1234, "Port has wrong value");
        });
    });
    describe("#serve()", () => {
        it("should start the server", () => {
            s.serve();
        });
    });
    describe("Routes", () => {
        it("GET /", (done) => {
            Chai.request(s.getServer())
                .get("/")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 200);
                    done();
                });
        });
        it("GET /mpgameslist", (done) => {
            P2PManager.inst.resetList();
            P2PManager.inst.registerMPGame(new MPGame("Test", "192.168.0.111", 1234));
            Chai.request(s.getServer())
                .get("/mpgameslist")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 200);
                    Assert.strictEqual(res.body.mpGames[0].name, JSON.parse(`{"mpGames":[{"name":"Test","hostIP":"192.168.0.111","hostPort":1234}]}`).mpGames[0].name);
                    Assert.strictEqual(res.body.mpGames[0].hostIP, JSON.parse(`{"mpGames":[{"name":"Test","hostIP":"192.168.0.111","hostPort":1234}]}`).mpGames[0].hostIP);
                    Assert.strictEqual(res.body.mpGames[0].hostPort, JSON.parse(`{"mpGames":[{"name":"Test","hostIP":"192.168.0.111","hostPort":1234}]}`).mpGames[0].hostPort);
                    done();
                });
        });
        it("GET /registermpgame", (done) => {
            P2PManager.inst.resetList();
            Chai.request(s.getServer())
                .get("/registermpgame?name=Test&hostIP=192.168.0.111&hostPort=1234")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 200);
                    Assert.strictEqual(/\{\"token\":\"AW2\w+\"\}/.test(JSON.stringify(res.body)), true, "Response did not contain token");
                    done();
                });
        });
        it("GET /registermpgame (duplicate name)", (done) => {
            Chai.request(s.getServer())
                .get("/registermpgame?name=Test&hostIP=192.168.0.222&hostPort=4321")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400);
                    done();
                });
        });
        it("GET /registermpgame (duplicate ip&port)", (done) => {
            Chai.request(s.getServer())
                .get("/registermpgame?name=Test2&hostIP=192.168.0.111&hostPort=1234")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400);
                    done();
                });
        });
        it("GET /registermpgame (parameters missing)", (done) => {
            P2PManager.inst.resetList();
            Chai.request(s.getServer())
                .get("/registermpgame?hostIP=192.168.0.111&hostPort=1234")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400);
                    done();
                });
        });
        it("GET /registermpgame (parameters missing)", (done) => {
            P2PManager.inst.resetList();
            Chai.request(s.getServer())
                .get("/registermpgame?name=Test&hostPort=1234")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400);
                    done();
                });
        });
        it("GET /registermpgame (parameters missing)", (done) => {
            P2PManager.inst.resetList();
            Chai.request(s.getServer())
                .get("/registermpgame?name=Test&hostIP=192.168.0.111")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400);
                    done();
                });
        });
        it("GET /joinmpgame", (done) => {
            P2PManager.inst.resetList();
            P2PManager.inst.registerMPGame(new MPGame("Test", "192.168.0.111", 1234));
            Chai.request(s.getServer())
                .get("/joinmpgame?name=Test&ownIP=111.168.0.111&ownPort=1111")
                .end((err, res) => {
                    if (err) throw err;
                    if (res.status != 200 && res.status != 418) throw new Error("Wrong http status code " + res.status);
                    done();
                });
        });
        it("GET /joinmpgame (parameters missing)", (done) => {
            Chai.request(s.getServer())
                .get("/joinmpgame?ownIP=111.168.0.111&ownPort=1111")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400);
                    done();
                });
        });
        it("GET /joinmpgame (parameters missing)", (done) => {
            Chai.request(s.getServer())
                .get("/joinmpgame?name=Test&ownPort=1111")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400);
                    done();
                });
        });
        it("GET /joinmpgame (parameters missing)", (done) => {
            Chai.request(s.getServer())
                .get("/joinmpgame?name=Test&ownIP=111.168.0.111")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400);
                    done();
                });
        });
        it("GET /joinmpgame (invalid name)", (done) => {
            Chai.request(s.getServer())
                .get("/joinmpgame?name=FalseName&ownIP=111.168.0.111&ownPort=1111")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400);
                    done();
                });
        });
        it("GET /startorremovempgame", (done) => {
            P2PManager.inst.resetList();
            const game: MPGame = new MPGame("Test", "192.168.0.111", 1234);
            P2PManager.inst.registerMPGame(game);
            Chai.request(s.getServer())
                .get("/startorremovempgame?token=" + game.getToken())
                .end((err, res) => {
                    if (err) throw err;
                    if (res.status != 200 && res.status != 204) throw new Error("Wrong http status code " + res.status);
                    Assert.strictEqual(P2PManager.inst.fetchMPGameByToken(game.getToken()), undefined), "Game was not removed";
                    done();
                });
        });
        it("GET /startorremovempgame (missing parameters)", (done) => {
            Chai.request(s.getServer())
                .get("/startorremovempgame")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400), "Game was not removed";
                    done();
                });
        });
        it("GET /startorremovempgame (wrong token)", (done) => {
            Chai.request(s.getServer())
                .get("/startorremovempgame?token=AW2WRONGTOKEN")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 400), "Game was not removed";
                    done();
                });
        });
        it("GET /invalidroute", (done) => {
            Chai.request(s.getServer())
                .get("/invalidroute")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 404);
                    done();
                });
        });
        it("POST /mpgameslist (wrong method)", (done) => {
            Chai.request(s.getServer())
                .post("/mpgameslist")
                .end((err, res) => {
                    if (err) throw err;
                    Assert.strictEqual(res.status, 404);
                    done();
                });
        });
    });
    describe("#stop()", () => {
        it("should stop the server", () => {
            s.stop();
        });
    });
    after(() => s.stop());
});
