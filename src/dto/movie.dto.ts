export class CreateMovieDto {
  title!: string;
  overview?: string;
  adult?: boolean;
  poster_url?: string;
  backdrop_url?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  video?: boolean;
  language_iso_code?: string;
  original_title?: string;
  original_id?: number;
  genre_ids?: string[];
  imdb_id?: string;
}

export class UpdateMovieDto {
  title!: string;
}

