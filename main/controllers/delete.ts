import { Request, Response } from "express";
import client from "../utils/webtorrent";
import fs from "fs";

export async function deleteTorrent(req: Request, res: Response) {
  const { infoHash } = req.params;
  const { deleteLocal } = req.query;

  const torrent = client.get(infoHash);
  if (!torrent) {
    return res.send(`torrent with infoHash ${infoHash} not found.`);
  } else {
    const path = `${torrent.path}/${torrent.name}`;
    torrent.destroy((err) => {
      if (err) {
        return res.status(404).json({
          message: "Torrent couldn't be deleted.",
        });
      }

      if (deleteLocal) {
        fs.rmdir(path, { recursive: true }, (err) => {
          if (err) {
            return res.status(403).json({
              message: err.message,
            });
          }

          return res.status(200).json({
            message: "Torrent deleted",
          });
        });
      }
    });
  }
}
