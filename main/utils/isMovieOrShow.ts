import parseTorrentName from "parse-torrent-name";

function isMovie(parsed) {
  return !!parsed.year;
}

function isTVShow(parsed) {
  return !!(parsed.season && parsed.episode);
}

export function isMovieOrShow(name: string) {
  const parsed = parseTorrentName(name);

  return isMovie(parsed) || isTVShow(parsed);
}
