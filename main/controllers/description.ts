import { Request, Response } from "express";
import { parse } from "parse-torrent-title";
import { isMovieOrShow } from "../utils/isMovieOrShow";
import { OMDB } from "../helpers/OMDB";
import { sampleDescriptions } from "../../sample/descriptions";

const tvdb = new OMDB();

export async function description(req: Request, res: Response) {
  const { name } = req.query;

  const sample = sampleDescriptions.filter(
    (sample) => sample.title.toLowerCase() === name.toLowerCase()
  );
  if (sample.length) return res.json(sample[0]);

  const info = parse(name);
  const response = isMovieOrShow(name) ? await tvdb.find(info) : null;

  res.json(response);
}
