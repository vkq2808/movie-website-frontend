export interface MovieCrewPersonResponseDto {
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

export interface MovieCrewItemResponseDto {
  id: string;
  department: string;
  job: string;
  order: number;
  credit_id?: string;
  person: MovieCrewPersonResponseDto;
}

export interface MovieCrewResponseDto {
  movie_id: string;
  crew: MovieCrewItemResponseDto[];
}

export default MovieCrewResponseDto;
