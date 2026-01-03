import useSWR from "swr";
import { movieListApi } from "@/apis/movie-list.api";

export const useMovieListDetail = (id: string) => {
  const { data, error, mutate } = useSWR(id ? `/movie-lists/${id}` : null, () =>
    movieListApi.getOne(id)
  );
  return { data, error, loading: !data && !error, mutate };
};
