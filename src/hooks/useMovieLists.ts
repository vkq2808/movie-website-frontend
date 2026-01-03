"use client";

import useSWR from "swr";
import { movieListApi } from "@/apis/movie-list.api";

export const useMovieLists = (page = 1, limit = 20) => {
  const key = `/movie-lists/public?page=${page}&limit=${limit}`;
  const fetcher = () => movieListApi.publicLists(page, limit);
  const { data, error, mutate } = useSWR(key, fetcher);
  return { data, error, loading: !data && !error, mutate };
};
