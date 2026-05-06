import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const root = process.cwd();
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

createServer((request, response) => {
  const path = request.url === "/" ? "/preview.html" : request.url || "/preview.html";
  const requestedFile = join(root, path.split("?")[0]);
  const file = extname(requestedFile) ? requestedFile : join(root, "preview.html");

  response.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
  createReadStream(file)
    .on("error", () => {
      response.statusCode = 404;
      response.end("Niet gevonden");
    })
    .pipe(response);
}).listen(port, host, () => {
  console.log(`Preview draait op http://${host}:${port}`);
});
