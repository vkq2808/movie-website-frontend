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
import { UploadStatus, VideoType } from '@/dto/movie-video.dto'
import VideoCard from '@/components/ui/VideoCard'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB

interface Props {
  movie: MovieFormValues
}

export default function MovieVideoUploader({ movie }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [status, setStatus] = useState<string>('idle')
  const intervalRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState<string>('')
  const [titleError, setTitleError] = useState<string>('');
  const [videoType, setVideoType] = useState<VideoType>(VideoType.MOVIE)

  useEffect(() => {
    if (title.length > 100) {
      setTitleError('Title can not contain over 100 characters.');
      setTitle((p) => p.slice(0, 99))
      return;
    }

    setTitleError('');
  }, [title])

  // 🧱 Khởi tạo upload session
  const initUpload = async () => {
    if (!file) return alert('Chọn video trước!')
    setStatus('initializing')
    try {
      const res = await initUploadApi(movie.id, file.name, title.trim(), videoType)
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
      try {
        const res = await getUploadStatusApi(sessionId)
        const backendStatus = res.data.status as UploadStatus

        switch (backendStatus) {
          case 'in_progress':
            setStatus('uploading')
            break

          case 'assembling':
            setStatus('assembling')
            break

          case 'converting':
            setStatus('processing')
            setFile(null)
            setTitle('')
            break

          case 'completed':
            clearInterval(intervalRef.current!)
            setStatus('complete')
            setFile(null)
            setTitle('')
            break

          case 'failed':
            clearInterval(intervalRef.current!)
            setStatus('error')
            console.error('Upload failed:', res.data.error || 'Unknown error')
            break

          default:
            setStatus('unknown')
        }
      } catch (error) {
        console.error('Polling error:', error)
        setStatus('error')
        clearInterval(intervalRef.current!)
      }
    }, 4000) // 4 giây/lần, có thể tuỳ chỉnh
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
        <div className="p-4 border-b border-gray-800 bg-neutral-800 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{file.name}</p>
              <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
            </div>
          </div>

          {/* Nhập tiêu đề video */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tiêu đề video</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
              placeholder="Nhập tiêu đề..."
            />
          </div>
          {titleError && (
            <div className='text-red-500'>
              {titleError}
            </div>
          )}
          {/* Chọn loại video */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Loại video</label>
            <select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value as VideoType)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
            >
              {Object.values(VideoType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center">
            {status === 'idle' ? (
              <button
                type='button'
                onClick={initUpload}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 px-3 py-2 rounded-lg text-white font-medium cursor-poitner"
                disabled={!title.trim()}
              >
                {title.trim() ? 'Upload' : 'Nhập tiêu đề trước'}
              </button>
            ) : (
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
      <VideoTabs movie={movie} />
    </div>
  )
}
function VideoTabs({ movie }: { movie: MovieFormValues }) {
  const [activeTab, setActiveTab] = useState(VideoType.TRAILER)

  const types = Object.values(VideoType)
  const videosByType = movie?.videos?.filter(v => v.type === activeTab) || []

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-700 mb-4">
        {types.map(type => (
          <button
            type="button"
            key={type}
            className={`pb-2 px-3 ${activeTab === type
              ? 'border-b-2 border-red-500 text-red-400'
              : 'text-gray-400 hover:text-gray-200'
              }`}
            onClick={() => setActiveTab(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Nội dung tab */}
      <div className="divide-y divide-gray-800">
        {videosByType.length > 0 ? (
          videosByType.map((v, i) => (
            <div key={i} className="flex items-center px-4 py-3">
              <div className="w-40 h-24 bg-gray-700 rounded-lg overflow-hidden relative mr-4">
                <VideoCard video={v} />
                <span className="absolute bottom-1 right-1 bg-black/70 text-xs px-2 py-0.5 rounded">
                  {v.site}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{`${v.name}`}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-6">
            Chưa có video {activeTab.toLowerCase()} nào.
          </div>
        )}
      </div>
    </div>
  )
}
