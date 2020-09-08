/**
 * ENTRY POINT / BOOTSTRAP APP
 */

import ExpressServer from "./ExpressServer";

const server: ExpressServer = new ExpressServer();
server.serve();
