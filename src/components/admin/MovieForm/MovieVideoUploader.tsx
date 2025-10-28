'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
  initUploadApi,
  uploadChunkApi,
  completeUploadApi,
  getUploadStatusApi
} from '@/apis/upload.api'
import { Upload, Check, Loader2, Play, Lock } from 'lucide-react'
import { AdminVideo } from '@/apis/admin.api'
import { MovieFormValues } from './MovieForm'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB

interface Props {
  movie: MovieFormValues
}

export default function MovieVideoUploader({ movie }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [status, setStatus] = useState<string>('idle')
  const [videos, setVideos] = useState<AdminVideo[]>(movie.videos ?? [])
  const intervalRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)


  // 🧱 Khởi tạo upload session
  const initUpload = async () => {
    if (!file) return alert('Chọn video trước!')
    setStatus('initializing')
    try {
      const res = await initUploadApi(movie.id, file.name)
      setSessionId(res.data.sessionId)
      setStatus('uploading')
      await uploadChunks(res.data.sessionId)
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  // 🧱 Upload theo chunk
  const uploadChunks = async (sessionId: string) => {
    if (!file) return
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)
      await uploadChunkApi(sessionId, chunk, i)
      setProgress(Math.round(((i + 1) / totalChunks) * 100))
    }

    setStatus('assembling')
    await completeUploadApi(sessionId)
    setStatus('processing')
    pollStatus(sessionId)
  }

  // 🧱 Theo dõi tiến trình xử lý server
  const pollStatus = (sessionId: string) => {
    intervalRef.current = window.setInterval(async () => {
      const data = await getUploadStatusApi(sessionId)
      if (data.data.progress === 100) {
        clearInterval(intervalRef.current!)
        setStatus('complete')
        setFile(null)
      }
    }, 5000)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="bg-neutral-900 text-gray-100 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800">
        <h2 className="text-lg font-semibold">Video</h2>
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className="bg-fuchsia-600 hover:bg-fuchsia-700 px-4 py-2 rounded-lg font-medium text-white cursor-pointer"
        >
          Thêm video
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Upload Area */}
      {file && (
        <div className="p-4 border-b border-gray-800 bg-neutral-800">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{file.name}</p>
              <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
            </div>

            <div>
              {status === 'idle' && (
                <button
                  onClick={initUpload}
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 px-3 py-2 rounded-lg text-white font-medium"
                >
                  Upload
                </button>
              )}
              {status !== 'idle' && (
                <p className="text-sm text-gray-300">
                  {status === 'uploading'
                    ? `Đang tải lên... ${progress}%`
                    : status === 'assembling'
                      ? 'Đang ghép video...'
                      : status === 'processing'
                        ? 'Đang xử lý video...'
                        : 'Hoàn tất ✅'}
                </p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {progress > 0 && (
            <div className="h-2 bg-gray-700 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-fuchsia-500 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Video List */}
      <div className="divide-y divide-gray-800">
        {videos.map((v, i) => (
          <div key={i} className="flex items-center px-4 py-3">
            {/* Thumbnail */}
            <div className="w-40 h-24 bg-gray-700 rounded-lg overflow-hidden relative mr-4">
              <video
                src={v.preview_url}
                className="w-full h-full object-cover"
                muted
              />
              <span className="absolute bottom-1 right-1 bg-black/70 text-xs px-2 py-0.5 rounded">
                {v.duration}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="font-medium">{`${movie.title} - ${v.type} - ${v.site}` || 'Video không tiêu đề'}</p>
            </div>

            {/* Date */}
            <div className="w-40 text-center">
              <p>{formatDate(v.created_at)}</p>
              <p className="text-xs text-gray-500">Đã tải lên</p>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="text-center text-gray-400 py-6">Chưa có video nào</div>
        )}
      </div>
    </div>
  )
}
