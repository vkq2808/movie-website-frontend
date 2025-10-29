// src/api/upload.api.ts
import { VideoType } from '@/dto/movie-video.dto'
import axios from 'axios'

const API_URL = 'http://localhost:2808/video/upload'

// -------------------------
// 1️⃣ Initialize Upload
// -------------------------
export const initUploadApi = async (movie_id: string, filename: string, title: string, videoType: VideoType) => {
  const res = await axios.post(`${API_URL}/init`, { movie_id, filename, title, videoType })
  return res.data
}

// -------------------------
// 2️⃣ Upload Single Chunk
// -------------------------
export const uploadChunkApi = async (sessionId: string, chunk: Blob, index: number) => {
  const res = await axios.put(`${API_URL}/${sessionId}/chunk`, chunk, {
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
export const completeUploadApi = async (sessionId: string) => {
  const res = await axios.post(`${API_URL}/${sessionId}/complete`)
  return res.data
}

// -------------------------
// 4️⃣ Check Upload Status
// -------------------------
export const getUploadStatusApi = async (sessionId: string) => {
  const res = await axios.get(`${API_URL}/${sessionId}/status`)
  return res.data
}
