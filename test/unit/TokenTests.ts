import Assert from "assert";
import Token from "../../src/Token";

describe("Token", () => {
    let token: Token;
    before(() => (token = new Token()));
    describe("constructor()", () => {
        it("should init a correct token of type string", () => {
            Assert.notStrictEqual(token, undefined, "Token is undefined");
            Assert.notStrictEqual(token, null, "Token is null");
            Assert.notStrictEqual(token.toString(), undefined, "Token string is undefined");
            Assert.notStrictEqual(token.toString(), null, "Token string is null");
            Assert.strictEqual(typeof token.toString(), "string", "Token is not of type string");
            Assert.strictEqual(/AW2\w+/.test(token.toString()), true, "Token string is incorrect");
        });
    });
    describe("#toString()", () => {
        it("should return the token string", () => {
            Assert.notStrictEqual(token.toString(), undefined, "Token string is undefined");
            Assert.notStrictEqual(token.toString(), null, "Token string is null");
            Assert.strictEqual(typeof token.toString(), "string", "Token is not of type string");
        });
    });
    describe("#toJSON()", () => {
        it("should return a serialized JSON representation of the token as string", () => {
            Assert.strictEqual(/\{\"token\":\"AW2\w+\"\}/.test(token.toJSON()), true, "JSON is false");
        });
    });
    describe("#equals()", () => {
        it("should return false (both tokens are not equal)", () => {
            const token2: Token = new Token();
            Assert.strictEqual(token.equals(token2), false, "Tokens are false equal");
        });
        it("should return true (both tokens are equal)", () => {
            const token2: Token = Token.parse(token.toString());
            Assert.strictEqual(token.equals(token2), true, "Tokens are false inequal");
        });
    });
    describe("#parse()", () => {
        const testTokenString = "TestToken123TestToken";
        it("should return the token as string '" + testTokenString + "'", () => {
            const testToken: Token = Token.parse(testTokenString);
            Assert.strictEqual(testToken.toString(), testTokenString, "Tokens are not equal");
        });
    });
});
