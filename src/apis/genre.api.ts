import api, { apiEndpoint } from "@/utils/api.util";

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export async function getAllGenres(): Promise<Genre[]> {
  const response = await api.get<{
    data: { id: string; names: { name: string; iso_639_1: string }[] }[];
  }>(`${apiEndpoint.GENRE}`);
  return response.data.data.map((genre) => ({
    id: genre.id,
    name:
      genre.names.find((n) => n.iso_639_1 === "en")?.name ||
      genre.names[0]?.name ||
      "Unknown",
    slug:
      genre.names
        .find((n) => n.iso_639_1 === "en")
        ?.name.toLowerCase()
        .replace(/\s+/g, "-") || "unknown",
  }));
}

export async function submitFavoriteGenres(genreIds: string[]): Promise<void> {
  await api.post(`${apiEndpoint.USER}/me/favorite-genres`, { genreIds });
}
