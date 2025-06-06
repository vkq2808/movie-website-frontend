interface Model {
}

interface BaseModelWithoutId extends Model {
  created_at: string;
  updated_at: string;
}

interface BaseModelWithId extends Model {
  id: string;
  created_at: string;
  updated_at: string;
}

interface BaseModelWithId {
  id: string;
  created_at: string;
  updated_at: string;
}
export interface User extends BaseModelWithId {
  email: string;
  username: string;
  role: string;
  birthdate: string;
  photo_url: string;

  favoriteMovies: Movie[];
}

export interface Movie extends BaseModelWithId {
  genres: Genre[];
  title: string;
  overview: string;
  release_date: string;
  duration: number;
  poster: Image;
  backdrop: Image;
  trailer_url: string | null;
  rating: number;
  videos: Video[];
  vote_average: number;
  vote_count: number;
  alternative_titles: AlternativeTitle[];
  alternative_overviews: AlternativeOverview[];
  original_language: string;
  original_title: string;
}

export interface Video extends BaseModelWithId {
  movieId: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  iso_639_1: string;
  iso_3166_1: string;
  published_at: Date;
}

export interface Image extends BaseModelWithId {
  url: string;
  alt: string;
  width: number;
  height: number;
  bytes: number;
}

export interface Genre extends BaseModelWithId {
  original_id: string;
  names: {
    iso_639_1: string;
    name: string;
  }[]
}

export interface Language extends Model {
  iso_639_1: string;
  name: string;
};

export interface AlternativeTitle {
  title: string;
  iso_639_1: string;
}

export interface AlternativeOverview {
  overview: string;
  iso_639_1: string;
}