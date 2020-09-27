import Assert from "assert";
import P2PManager from "../../src/P2PManager";
import MPGame from "../../src/MPGame";
import Token from "../../src/Token";

describe("P2PManager", () => {
    let p2p: P2PManager;
    before(() => (p2p = new P2PManager()));
    describe("constructor()", () => {
        it("should init a P2PManager", () => {
            Assert.notStrictEqual(p2p, undefined, "P2PManager is undefined");
            Assert.notStrictEqual(p2p, null, "P2PManager is null");
        });
    });
    describe("#fetchMPGames()", () => {
        it("should fetch all multiplayer games as array (none)", () => {
            Assert.strictEqual(p2p.fetchMPGames().length, 0);
        });
    });
    describe("#registerMPGame()", () => {
        it("should register a new multiplayer game", () => {
            Assert.strictEqual(p2p.fetchMPGames().length, 0, "P2PManager had mp games before");
            Assert.strictEqual(p2p.registerMPGame(new MPGame("Test1", "192.168.0.111", 1234)), true);
            Assert.strictEqual(p2p.fetchMPGames().length, 1);
        });
        it("should not register a new multiplayer game (duplicate name)", () => {
            Assert.strictEqual(p2p.registerMPGame(new MPGame("Test1", "192.168.0.222", 2222)), false);
            Assert.strictEqual(p2p.fetchMPGames().length, 1, "New mp game was created");
        });
        it("should not register a new multiplayer game (duplicate ip and port combination)", () => {
            Assert.strictEqual(p2p.registerMPGame(new MPGame("Test2", "192.168.0.111", 1234)), false);
            Assert.strictEqual(p2p.fetchMPGames().length, 1, "New mp game was created");
        });
        it("should register a new multiplayer game", () => {
            Assert.strictEqual(p2p.registerMPGame(new MPGame("Test2", "192.168.0.111", 4321)), true);
            Assert.strictEqual(p2p.fetchMPGames().length, 2, "New mp game was not created");
        });
        it("should register a new multiplayer game", () => {
            Assert.strictEqual(p2p.registerMPGame(new MPGame("Test3", "192.168.0.222", 1234)), true);
            Assert.strictEqual(p2p.fetchMPGames().length, 3, "New mp game was not created");
        });
    });
    describe("#fetchMPGameByName()", () => {
        it("should fetch a multiplayer game by name", () => {
            Assert.strictEqual(p2p.fetchMPGames().length, 3, "P2PManager is not initialized");
            Assert.notStrictEqual(p2p.fetchMPGame("Test1"), undefined);
        });
    });
    describe("#fetchMPGameByToken()", () => {
        it("should fetch a multiplayer game by token", () => {
            Assert.strictEqual(p2p.fetchMPGames().length, 3, "P2PManager is not initialized");
            Assert.notStrictEqual(p2p.fetchMPGameByToken(p2p.fetchMPGames()[0].getToken()), undefined);
        });
    });
    describe("#removeMPGame()", () => {
        it("should remove a multiplayer game", () => {
            Assert.strictEqual(p2p.fetchMPGames().length, 3, "P2PManager is not initialized");
            const game: MPGame | undefined = p2p.fetchMPGame("Test3");
            if (game != undefined) p2p.removeMPGame(game.getToken());
            Assert.strictEqual(p2p.fetchMPGames().length, 2, "Remove failed");
        });
        it("should not remove a multiplayer game (not existing)", () => {
            Assert.strictEqual(p2p.fetchMPGames().length, 2, "P2PManager is not initialized");
            Assert.strictEqual(p2p.removeMPGame(new Token()), false);
            Assert.strictEqual(p2p.fetchMPGames().length, 2, "Remove executed falsely");
        });
    });
    describe("#stringifyMPGamesList()", () => {
        it("should return a serialized mp games JSON representation as string", () => {
            Assert.strictEqual(`{"mpGames":[{"name":"Test1","hostIP":"192.168.0.111","hostPort":1234},{"name":"Test2","hostIP":"192.168.0.111","hostPort":4321}]}`, p2p.stringifyMPGamesList(), "JSON is false");
        });
    });
});
