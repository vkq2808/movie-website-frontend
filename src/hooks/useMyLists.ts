import useSWR from "swr";
import { movieListApi } from "@/apis/movie-list.api";

export const useMyLists = () => {
  const key = "/movie-lists/me";
  const fetcher = () => movieListApi.getMyLists();
  const { data, error, mutate } = useSWR(key, fetcher);
  return { data, error, loading: !data && !error, mutate };
};
