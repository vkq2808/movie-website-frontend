import { ApiResponse } from "@/types/api.response";
import { MovieList } from "@/types/api.types";
import api from "@/utils/api.util";

export const movieListApi = {
  create: (payload: any) =>
    api.post("/movie-lists", payload).then((r) => r.data.data ?? r.data),
  getMyLists: () =>
    api.get("/movie-lists/me").then((r) => r.data.data ?? r.data),
  getOne: (id: string) =>
    api.get(`/movie-lists/${id}`).then((r) => r.data.data ?? r.data),
  update: (id: string, payload: any) =>
    api.patch(`/movie-lists/${id}`, payload).then((r) => r.data.data ?? r.data),
  remove: (id: string) => api.delete(`/movie-lists/${id}`),
  addMovie: (id: string, payload: any) =>
    api
      .post(`/movie-lists/${id}/movies`, payload)
      .then((r) => r.data.data ?? r.data),
  createAndAdd: (payload: any) =>
    api
      .post(`/movie-lists/create-and-add`, payload)
      .then((r) => r.data.data ?? r.data),
  removeMovie: (id: string, movieId: string) =>
    api.delete(`/movie-lists/${id}/movies/${movieId}`),
  publicLists: (page = 1, limit = 20) =>
    api
      .get<
        ApiResponse<{
          data: MovieList[];
          meta: { page: number; limit: number; total: number };
        }>
      >("/movie-lists/public", { params: { page, limit } })
      .then((r) => r.data),
  publicByUser: (userId: string, page = 1, limit = 20) =>
    api
      .get(`/movie-lists/user/${userId}`, { params: { page, limit } })
      .then((r) => r.data),
  recommendedLists: (page = 1, limit = 20) =>
    api
      .get("/movie-lists/recommended", { params: { page, limit } })
      .then((r) => r.data.data ?? r.data),
};
