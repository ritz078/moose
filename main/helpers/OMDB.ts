import axios, { AxiosInstance, CancelTokenSource } from "axios";

const base = "https://api.themoviedb.org/3/";

interface MovieDetails {
  title: string;
  description: string;
  poster: string;
  released: string;
}

export class OMDB {
  instance: AxiosInstance;
  token: CancelTokenSource = null;

  constructor() {
    this.instance = axios.create({
      baseURL: base,
      timeout: 1000,
      headers: { "Content-Type": "application/json" },
    });
  }

  static decorate(data): MovieDetails {
    return {
      title: data.title,
      description: data.overview,
      poster: `https://image.tmdb.org/t/p/w200/${data.still_path}`,
      released: data.release_date,
    };
  }

  static decorateTV(data, title, poster) {
    return {
      title,
      name: data.name,
      description: data.overview,
      poster: `https://image.tmdb.org/t/p/w200/${poster}`,
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

    return OMDB.decorate(data?.results?.[0]);
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
      console.log(id, data);
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

    console.log(results);

    const result = results?.[0];
    const res = await this.findEpisode(
      results?.[0]?.id,
      info.season,
      info.episode
    );
    return OMDB.decorateTV(res, info.title, result?.poster_path);
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
