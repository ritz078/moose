import { Request, Response } from "express";
import { parse } from "parse-torrent-title";
import { isMovieOrShow } from "../utils/isMovieOrShow";
import { Description } from "../helpers/Description";

const tvdb = new Description();

export async function description(
  req: Request<any, any, any, { name: string }>,
  res: Response
) {
  const { name } = req.query;

  const info = parse(name);
  const response = isMovieOrShow(name) ? await tvdb.find(info) : null;

  res.json(response);
}
