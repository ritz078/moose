import axios, { AxiosInstance, CancelTokenSource } from "axios";

const base = "https://api.themoviedb.org/3/";

interface MovieDetails {
  title: string;
  description: string;
  poster: string;
  released: string;
  backdrop: string | null;
}

export class Description {
  instance: AxiosInstance;
  token: CancelTokenSource = null;

  constructor() {
    this.instance = axios.create({
      baseURL: base,
      timeout: 1000,
      headers: { "Content-Type": "application/json" },
    });
  }

  static decorate(data, info): MovieDetails {
    return {
      title: data?.title || info.title,
      description: data?.overview,
      poster: data?.poster_path
        ? `https://image.tmdb.org/t/p/w200/${data.poster_path}`
        : `/cover-video.png`,
      released: data?.release_date,
      backdrop: data?.backdrop_path
        ? `https://image.tmdb.org/t/p/w780/${data.backdrop_path}`
        : null,
    };
  }

  static decorateTV(data, title, poster) {
    return {
      title,
      name: data.name,
      description: data.overview,
      poster: poster
        ? `https://image.tmdb.org/t/p/w200/${poster}`
        : `/cover-video.png`,
      released: data.release_date,
      season: data.season_number,
      episode: data.episode_number,
    };
  }

  private async findMovie(info): Promise<MovieDetails> {
    const { data } = await this.instance.get("/search/movie", {
      params: {
        query: info.title,
        year: info.year,
        api_key: TMDB_API,
      },
      cancelToken: this.token.token,
    });
    const result = data?.results?.[0];
    return Description.decorate(result, info);
  }

  private async findEpisode(id: number, season: number, episode: number) {
    try {
      const { data } = await this.instance.get(
        `/tv/${id}/season/${season}/episode/${episode}`,
        {
          params: {
            api_key: TMDB_API,
          },
        }
      );
      return data;
    } catch (e) {}
  }

  private async findTVSeries(info) {
    const {
      data: { results },
    } = await this.instance.get("/search/tv", {
      params: {
        query: info.title,
        first_air_date_year: info.year,
        api_key: TMDB_API,
      },
      cancelToken: this.token.token,
    });

    const result = results?.[0];
    const res = await this.findEpisode(
      results?.[0]?.id,
      info.season,
      info.episode
    );
    return Description.decorateTV(res, info.title, result?.poster_path);
  }

  async find(info): Promise<MovieDetails | any> {
    if (this.token) {
      this.token.cancel();
    }

    this.token = axios.CancelToken.source();
    if (!info.season && !info.episode) {
      return this.findMovie(info);
    } else {
      return this.findTVSeries(info);
    }
  }
}
