export interface MovieProductionCompanyResponseDto {
  id: string;
  name: string;
  description?: string;
  homepage?: string;
  headquarters?: string;
  origin_country?: string;
  logo_id?: string;
  is_active?: boolean;
}

export default MovieProductionCompanyResponseDto;
