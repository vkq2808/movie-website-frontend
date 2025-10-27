export interface MovieCastPersonResponseDto {
  id: string;
  name: string;
  gender: number;
  adult: boolean;
  profile_image?: {
    url: string;
    alt: string;
    server_path?: string;
  };
}

export interface MovieCastItemResponseDto {
  id: string;
  character: string;
  order: number;
  credit_id?: string;
  person: MovieCastPersonResponseDto;
}

export interface MovieCastResponseDto {
  movie_id: string;
  cast: MovieCastItemResponseDto[];
}

export default MovieCastResponseDto;
