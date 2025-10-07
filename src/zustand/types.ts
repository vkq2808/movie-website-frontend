interface BaseModelWithId {
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
  posters: Image[];
  backdrops: Image[];
  trailer_url: string | null;
  videos: Video[];
  vote_average: number;
  vote_count: number;
  price: number;
  alternative_titles: AlternativeTitle[];
  alternative_overviews: AlternativeOverview[];
  original_language: string;
  original_title: string;
  // movie.cast on backend is an array of MovieCast records that include a person relation
  cast?: MovieCast[];
}

export interface Person extends BaseModelWithId {
  original_id: number;
  name: string;
  biography?: string;
  birthday?: string | null;
  place_of_birth?: string | null;
  // profile_url is a fully built URL to the person's profile image
  profile_image?: {
    url: string;
    alt: string;
  }
}

export interface MovieCast extends BaseModelWithId {
  person: Person;
  character?: string | null;
  order?: number | null;
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

export interface Language {
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