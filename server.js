/**
 * Entry point for cPanel's Passenger (Setup Node.js App).
 *
 * Passenger runs this file and passes the port to listen on through PORT.
 * `next start` cannot be used directly here because Passenger needs to own
 * the HTTP server instance.
 *
 * Run `npm run build` before starting — this serves the prebuilt output.
 */

const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Ready on port ${port}`);
  });
});
