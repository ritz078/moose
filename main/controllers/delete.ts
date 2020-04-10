import { Request, Response } from "express";
import client from "../utils/webtorrent";
import rimraf from "rimraf";

export async function deleteTorrent(req: Request, res: Response) {
  const { infoHash } = req.params;
  const { deleteLocal } = req.query;

  const torrent = client.get(infoHash);
  if (!torrent) {
    return res.send(`torrent with infoHash ${infoHash} not found.`);
  } else {
    const path = torrent.path;
    torrent.destroy((err) => {
      if (err) {
        res.statusCode = 500;
        return res.send("torrent couldn't be deleted");
      }

      if (deleteLocal) {
        rimraf(path, () => {
          res.statusCode = 200;
          return res.send("torrent deleted");
        });
      }
    });
  }
}
