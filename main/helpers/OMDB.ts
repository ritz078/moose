import axios, { AxiosInstance } from "axios";

const base = "http://www.omdbapi.com/";

interface MovieDetails {
  title: string;
  description: string;
  poster: string;
  year: number;
  runtime: string;
  rated: string;
  released: string;
  genre: string;
}

export class OMDB {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: base,
      timeout: 1000,
      headers: { "Content-Type": "application/json" },
    });
  }

  static decorate(data): MovieDetails {
    return {
      title: data.Title,
      description: data.Plot,
      poster: data.Poster,
      year: data.Year,
      runtime: data.Runtime,
      rated: data.Rated,
      released: data.Released,
      genre: data.Genre,
    };
  }

  async findMovie(info): Promise<MovieDetails> {
    const { data } = await this.instance.get("/", {
      params: {
        t: info.title,
        y: info.year,
        apiKey: OMDB_API,
      },
    });

    return OMDB.decorate(data);
  }

  async find(info): Promise<MovieDetails> {
    if (!info.season && !info.episode) {
      return this.findMovie(info);
    }
  }
}
