import Assert from "assert";
import MPGame from "../../src/MPGame";

describe("MPGame", () => {
    let mpgame: MPGame;
    before(() => (mpgame = new MPGame("Test", "192.168.0.111", 1234)));
    describe("constructor()", () => {
        it("should init a MPGame", () => {
            Assert.notStrictEqual(mpgame, undefined, "MPGame is undefined");
            Assert.notStrictEqual(mpgame, null, "MPGame is null");
            Assert.strictEqual(mpgame.name, "Test", "Name invalid");
            Assert.strictEqual(mpgame.hostIP, "192.168.0.111", "IP invalid");
            Assert.strictEqual(mpgame.hostPort, 1234, "Port invalid");
            Assert.notStrictEqual(mpgame.getToken(), undefined, "No token was generated");
            Assert.notStrictEqual(mpgame.getToken(), null, "No token was generated");
        });
    });
    describe("#getToken()", () => {
        it("should return the game token", () => {
            Assert.notStrictEqual(mpgame.getToken(), undefined, "No token");
            Assert.notStrictEqual(mpgame.getToken(), null, "No token");
        });
    });
    describe("#toJSON()", () => {
        it("should return a serialized mpgame JSON representation as string", () => {
            Assert.strictEqual(`{"name":"Test","hostIP":"192.168.0.111","hostPort":1234}`, mpgame.toJSON(), "JSON is false");
        });
    });
});
