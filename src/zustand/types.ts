
export interface User {
  _id: string;
  email: string;
  username: string;
  role: string;
  birthdate: string;
  photoUrl: string;

  favoriteMovies: Movie[];

  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  genres: Genre[];
  title: string;
  description: string;
  releasedDate: string;
  duration: number;
  posterUrl: Image;
  backdropUrl: Image;
  trailerUrl: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
  _id: string;
  videos: Video[];
}

export interface Video {
  movieId: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  iso_639_1: string;
  iso_3166_1: string;
  _id: string;
  publishedAt: Date;
  createdAt: Date;
}

export interface Image {
  url: string;
  alt: string;
  width: number;
  height: number;
  bytes: number;
}

export interface Genre {
  _id: string;
  name: string;
  slug: string;
}