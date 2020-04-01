import { parse } from "parse-torrent-title";

function isMovie(parsed) {
  return !!parsed.year;
}

function isTVShow(parsed) {
  return !!(parsed.season && parsed.episode);
}

export function isMovieOrShow(name: string) {
  const parsed = parse(name);

  return isMovie(parsed) || isTVShow(parsed);
}
