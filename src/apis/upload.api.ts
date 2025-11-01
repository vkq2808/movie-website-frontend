// src/api/upload.api.ts
import { WatchProviderResponseDto } from '@/dto/watch-provider.dto';
import { ApiResponse } from '@/types/api.response'
import { Video, VideoType } from '@/types/api.types'
import api, { apiEndpoint } from '@/utils/api.util'

// -------------------------
// 1️⃣ Initialize Upload
// -------------------------

interface InitUploadResponseDto {
  plan: {
    sessionId: string;
    chunk_size: number;
    total_chunks: number;
    filesize: number;
    available_bytes: number;
  }
}
export const initUploadApi = async (movie_id: string, filename: string, title: string, type: VideoType, provider: WatchProviderResponseDto) => {
  const res = await api.post<ApiResponse<InitUploadResponseDto>>(`${apiEndpoint.VIDEO}/upload/init`, { movie_id, filename, title, type, provider })
  return res.data
}

// -------------------------
// 2️⃣ Upload Single Chunk
// -------------------------
interface UploadChunkResponseDto {
  idx: number;
}
export const uploadChunkApi = async (sessionId: string, chunk: Blob, index: number) => {
  const res = await api.put<ApiResponse<UploadChunkResponseDto>>(`${apiEndpoint.VIDEO}/upload/${sessionId}/chunk`, chunk, {
    headers: {
      'x-chunk-index': index.toString(),
      'Content-Type': 'application/octet-stream'
    }
  })
  return res.data
}

// -------------------------
// 3️⃣ Complete Upload
// -------------------------
interface CompleteUploadResponseDto {
  sessionId: string;
  video_id: string;
}
export const completeUploadApi = async (sessionId: string) => {
  const res = await api.post<ApiResponse<CompleteUploadResponseDto>>(`${apiEndpoint.VIDEO}/upload/${sessionId}/complete`)
  return res.data
}
// b5b684c6-f07c-44e0-bb08-045445758df2
// -------------------------
// 4️⃣ Check Upload Status
// -------------------------

export interface UploadStatusResponseDto {
  status: string;
  sessionId?: string;
  uploaded_chunks?: number[];
  uploaded_count?: number;
  total_chunks?: number;
  created_at?: string;
  updated_at?: string;
  video_key?: string;
  progress?: number;
  message: string;
  error?: string;
}

export const getUploadStatusApi = async (sessionId: string) => {
  const res = await api.get<ApiResponse<UploadStatusResponseDto>>(`${apiEndpoint.VIDEO}/upload/${sessionId}/status`)
  return res.data
}
