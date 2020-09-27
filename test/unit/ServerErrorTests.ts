import Assert from "assert";
import ServerError from "../../src/ServerError";

describe("ServerError", () => {
    const testStatus: number = 404;
    const testType: string = "NOT_FOUND";
    const testMsg: string = "Not found";
    let err: ServerError;
    before(() => (err = new ServerError(testStatus, testType, testMsg)));
    describe("constructor()", () => {
        it("should init a server error", () => {
            Assert.notStrictEqual(err, undefined, "ServerError is undefined");
            Assert.notStrictEqual(err, null, "ServerError is null");
            Assert.strictEqual(err.status, testStatus, "Status is wrong");
            Assert.strictEqual(err.type, testType, "Type is wrong");
            Assert.strictEqual(err.msg, testMsg, "Msg is wrong");
        });
    });
    describe("#toJSON()", () => {
        it("should return a serialized JSON representation as string", () => {
            Assert.strictEqual(`{"status":${testStatus},"type":"${testType}","msg":"${testMsg}"}`, err.toJSON(), "JSON is false");
        });
    });
});
