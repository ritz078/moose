import TorrentSearchApi from "torrent-search-api";
import { Request, Response } from "express";

TorrentSearchApi.enableProvider("Limetorrents");
// TorrentSearchApi.enableProvider("ThePirateBay");

export async function search(req: Request, res: Response) {
  const { query } = req.query;

  try {
    const results = await TorrentSearchApi.search(query, undefined, 40);
    res.status(200).json(results);
  } catch (e) {
    res.status(404);
  }
}

export async function magnet(req: Request, res: Response) {
  res.status(200).json({
    magnet: await TorrentSearchApi.getMagnet(req.body),
  });
}
