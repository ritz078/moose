import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { stream } from "./controllers/stream";
import { search } from "./controllers/search";
import { subtitles } from "./controllers/subtitles";
import { Server } from "http";

const app = express();

app.use(bodyParser.json());
app.use(cors());

let server: Server;
export function createServer(port) {
  app.get("/stream/:infoHash/:fileIndex/:name", stream);
  app.get("/subtitles/:infoHash/:fileIndex", subtitles);
  app.get("/search", search);
  server = app.listen(port);
}

export function closeServer() {
  if (server) {
    server.close();
  }
}
