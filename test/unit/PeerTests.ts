import Assert from "assert";
import Peer from "../../src/Peer";

describe("Peer", () => {
    const testIP: string = "192.168.0.111";
    const testPort: number = 1234;
    let peer: Peer;
    before(() => (peer = new Peer(testIP, testPort)));
    describe("constructor()", () => {
        it("should init a peer", () => {
            Assert.notStrictEqual(peer, undefined, "Peer is undefined");
            Assert.notStrictEqual(peer, null, "Peer is null");
            Assert.strictEqual(peer.peerIP, testIP, "IP is wrong");
            Assert.strictEqual(peer.peerPort, testPort, "Port is wrong");
        });
    });
    describe("#toJSON()", () => {
        it("should return a serialized JSON representation as string", () => {
            Assert.strictEqual(`{"peerIP":"${testIP}","peerPort":${testPort}}`, peer.toJSON(), "JSON is false");
        });
    });
});
