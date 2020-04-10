import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { stream } from "./controllers/stream";
import { subtitles } from "./controllers/subtitles";
import { Server } from "http";
import { details } from "./controllers/details";
import { description } from "./controllers/description";
import { deleteTorrent } from "./controllers/delete";

const app = express();

app.use(bodyParser.json());
app.use(cors());

let server: Server;
export function createServer(port, cb) {
  app.get("/stream/:infoHash/:fileIndex/:name", stream);
  app.get("/subtitles/:infoHash/:fileIndex", subtitles);
  app.get("/description", description);
  app.get("/details/:infoHash", details);
  app.delete("/delete/:infoHash", deleteTorrent);
  server = app.listen(port, cb);
}

export function closeServer() {
  if (server) {
    server.close();
  }
}
