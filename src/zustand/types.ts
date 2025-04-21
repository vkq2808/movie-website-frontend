
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
  generes: Genre[];
  title: string;
  description: string;
  releasedDate: string;
  duration: number;
  posterUrl: Image;
  backdropUrl: Image;
  trailerUrl: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  _id: string;
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