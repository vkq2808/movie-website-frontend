export enum VideoType {
  TRAILER = "Trailer",
  CLIP = "Clip",
  MOVIE = "Movie",
  FEATURETTE = "Featurette",
  OTHER = "Other"
}

export enum VideoQuality {
  LOW = '480p',
  MEDIUM = '720p',
  HD = '1080p'
}

export enum UploadStatus {
  IN_PROGRESS = 'in_progress',
  ASSEMBLING = 'assembling',
  CONVERTING = 'converting',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface ProfileImage {
  url: string;
  alt: string;
}

export interface Person {
  id: string;
  name: string;
  gender: number;
  adult: boolean;
  profile_image: ProfileImage | null;
}

export interface Cast {
  id: string;
  character: string;
  order: number;
  person: Person;
}

export interface Crew {
  id: string;
  department: string;
  job: string;
  person: Person;
}

export interface Genre {
  id: string;
  names: Array<{ name: string; iso_639_1: string }>;
}

export interface Language {
  id: string;
  name: string;
  iso_639_1: string;
}

export interface Video {
  id: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  name: string;
  url: string;
  site: string;
  type: VideoType;
  official: boolean;
  embed_url: string;
  thumbnail: string;
  watch_provider: WatchProvider;
  duration: number;
  qualities?: {
    quality: VideoQuality;
    url: string;
  }[]
  created_at: string;
}

export interface WatchProvider {
  id: number;
  logo_path: string;
  name: string;
  display_priority: number;
}

export interface Feedback {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
}
export interface Image {
  url: string;
  alt: string;
}

export interface Movie {
  id: string;
  title: string;
  overview: string;
  cast?: Cast[];
  crew?: Crew[];
  original_language: Language;
  status: string;
  price: number;
  genres?: Genre[];
  spoken_languages?: Language[];
  release_date: string;
  videos: Video[];
  posters: Image[];
  backdrops: Image[];
  feedbacks?: Feedback[];
  vote_average?: number;
  vote_count?: number;
}


export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  birthdate: string | null;
  photo_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  favoriteMovies: Movie[];
  created_at: string;
}

export enum MovieListVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface MovieListItem {
  id: string;
  movie: Movie;
  position?: number;
  created_at: string;
}

export interface MovieList {
  id: string;
  name: string;
  description?: string;
  visibility: MovieListVisibility;
  user: User;
  items?: MovieListItem[];
  moviesCount?: number;
  created_at: string;
  updated_at: string;
}