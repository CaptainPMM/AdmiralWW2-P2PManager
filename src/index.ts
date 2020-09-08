/**
 * ENTRY POINT / BOOTSTRAP APP
 */

import ExpressServer from "./ExpressServer";
import P2PManager from "./P2PManager";

{
    console.log("### ADMIRALWW2 P2P MANAGER ###");

    console.log("[ * ] Starting app");
    const p2pManager: P2PManager = new P2PManager();

    console.log("[ * ] Starting server");
    const server: ExpressServer = new ExpressServer();
    server.serve();
}
