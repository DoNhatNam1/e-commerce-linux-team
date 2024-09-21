/*
 * This is only a minimal custom server to get started.
 * You may want to consider using Express or another server framework, and enable security features such as CORS.
 *
 * For an example, see the Next.js repo:
 * Node - https://github.com/vercel/next.js/blob/canary/examples/custom-server
 */
import next from "next";

import { createServer } from "http";
import { parse } from "node:url";
import * as path from "path";

// Next.js server options:
// - The environment variable is set by `@nx/next:server` when running the dev server.
// - The fallback `__dirname` is for production builds.
// - Feel free to change this to suit your needs.

const dir =
  process.env.NX_NEXT_DIR ||
  path.join(__dirname, "../../../../apps/auth-buy-step-product");
const dev = process.env.NODE_ENV === "development";

// HTTP Server options:
// - Feel free to change this to suit your needs.
const hostname = process.env.HOST || "localhost";
const port = 3000;

async function main() {
  const nextApp = next({ dev, dir });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "", true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, hostname);

  console.log(`[ ready ] on http://${hostname}:${port}/configure/upload`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
