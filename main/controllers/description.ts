import { Request, Response } from "express";
import { parse } from "parse-torrent-title";
import { isMovieOrShow } from "../utils/isMovieOrShow";
import { Description } from "../helpers/Description";
import { sampleDescriptions } from "../../sample/descriptions";

const tvdb = new Description();

export async function description(
  req: Request<any, any, any, { name: string }>,
  res: Response
) {
  const { name } = req.query;

  const sample = sampleDescriptions.filter(
    (sample) => sample.title.toLowerCase() === name.toLowerCase()
  );
  if (sample.length) return res.json(sample[0]);

  const info = parse(name);
  const response = isMovieOrShow(name) ? await tvdb.find(info) : null;

  res.json(response);
}
