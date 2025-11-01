'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
  initUploadApi,
  uploadChunkApi,
  completeUploadApi,
  getUploadStatusApi,
  UploadStatusResponseDto
} from '@/apis/upload.api'
import { MovieFormValues } from './MovieForm'
import VideoCard from '@/components/ui/VideoCard'
import { VideoType } from '@/types/api.types'
import { adminApi } from '@/apis/admin.api'
import { AxiosError } from 'axios'
import { WatchProviderResponseDto } from '@/dto/watch-provider.dto'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB

interface Props {
  movie: MovieFormValues;
  setValues: React.Dispatch<React.SetStateAction<MovieFormValues>>
}

export default function MovieVideoManager({ movie, setValues }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [status, setStatus] = useState<string>('idle')
  const intervalRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState<string>('')
  const [titleError, setTitleError] = useState<string>('');
  const [videoType, setVideoType] = useState<VideoType>(VideoType.MOVIE)
  const [statusMap, setStatusMap] = useState<{ video_id: string, status: UploadStatusResponseDto }[]>([]);
  const [activeTab, setActiveTab] = useState(VideoType.TRAILER)
  const [watchProviders, setWatchProviders] = useState<WatchProviderResponseDto[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>();

  useEffect(() => {
    if (title.length > 100) {
      setTitleError('Title can not contain over 200 characters.');
      setTitle((p) => p.slice(0, 199))
      return;
    }

    setTitleError('');
  }, [title])

  useEffect(() => {
    const fetchWatchProviders = async () => {
      const { data } = await adminApi.getWatchProviders();
      setWatchProviders(data);
      setSelectedProvider(data[0].name);
    }
    fetchWatchProviders();
  }, [])

  // 🧱 Khởi tạo upload session
  const initUpload = async () => {
    if (!file) return alert('Chọn video trước!')
    setStatus('initializing')

    if (videoType === VideoType.MOVIE && movie.videos.some(v => v.type === VideoType.MOVIE)) {
      if (movie.videos.some(v => v.watch_provider?.name === selectedProvider)) {
        setStatus('Can not upload same Server for this video type Movie')
        return;
      }
    }

    const provider = watchProviders.find(p => p.name === selectedProvider)
    if (!provider) {
      setStatus('Select server first')
      return;
    }

    try {
      const res = await initUploadApi(movie.id, file.name, title.trim(), videoType, provider)
      setSessionId(res.data.plan.sessionId)
      setStatus('uploading')
      await uploadChunks(res.data.plan.sessionId)
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error('Error when uploading:', err.response?.data?.message)
      } else {
        console.error('Unknown error:', err)
      }
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
    const { data } = await completeUploadApi(sessionId)
    setStatus('processing')
    pollStatus(sessionId, data.video_id)
  }

  // 🧱 Theo dõi tiến trình xử lý server
  const pollStatus = async (sessionId: string, video_id: string) => {
    const { data: video } = await adminApi.getVideoById(video_id);
    if (video) {
      setActiveTab(videoType);
      setValues(p => ({ ...p, videos: [...p.videos, video] }))
    }

    intervalRef.current = window.setInterval(async () => {
      try {
        const res = await getUploadStatusApi(sessionId)
        const backendStatus = res.data.status;
        const newStatusMap = [...statusMap].filter(sm => sm.video_id != video_id);
        newStatusMap.push({ video_id, status: res.data })
        setStatusMap(newStatusMap);

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  useEffect(() => {
    if (!file) {
      setVideoType(activeTab);
    }
  }, [activeTab, file])

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
              onChange={(e) => { setVideoType(e.target.value as VideoType); }}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
            >
              {Object.values(VideoType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* Chọn Server  */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Server</label>
            <select
              value={selectedProvider}
              onChange={(e) => { setSelectedProvider(e.target.value) }}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
            >
              {watchProviders?.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
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
      <VideoTabs movie={movie} statusMap={statusMap} activeTab={activeTab} setActiveTab={setActiveTab} setValues={setValues} />
    </div>
  )
}
function VideoTabs({ movie, setValues, statusMap, activeTab, setActiveTab }: {
  movie: MovieFormValues,
  setValues: React.Dispatch<React.SetStateAction<MovieFormValues>>,
  statusMap: { video_id: string, status: UploadStatusResponseDto }[],
  activeTab: VideoType,
  setActiveTab: (t: VideoType) => void
}) {

  const types = Object.values(VideoType)
  const videosByType = movie?.videos?.filter(v => v.type === activeTab) || []
  const [deletingVideoIds, setDeletingVideoIds] = useState<string[]>([]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleDeleteVideo = async (videoId: string) => {
    try {
      setDeletingVideoIds(p => [...p, videoId])
      const response = await adminApi.deleteVideoById(videoId);
      if (response.success) {
        setValues((p) => ({ ...p, videos: p.videos.filter(v => v.id != videoId) }))
        setDeletingVideoIds(p => p.filter(id => id != videoId))
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message)
      }
    }
  }

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
            onClick={() => { setActiveTab(type); }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Nội dung tab */}
      <div className="divide-y divide-gray-800 w-full">
        {videosByType.length > 0 ? (
          videosByType.map((v, i) => (
            <div key={i} className={`flex relative items-center px-4 py-3 w-full ${deletingVideoIds.includes(v.id) ? 'opacity-70' : ''} `}>
              <div className="w-40 h-24 bg-gray-700 rounded-lg overflow-hidden relative mr-4">
                <VideoCard video={v} />
                <span className="absolute bottom-1 right-1 bg-black/70 text-xs px-2 py-0.5 rounded">
                  {v.site}
                </span>
              </div>
              <div className="flex-1 w-full">
                <p className="font-medium">{`${v.name}`}</p>
                <p>{`${formatDate(v.created_at)}`}</p>
                {(() => {
                  const data = statusMap.find(sm => sm.video_id === v.id)
                  if (!data) return null;
                  return (
                    <>
                      <p className='text-red-500'>
                        {data.status.message}
                      </p>
                      {(data.status.progress && data.status.progress >= 0) ? (
                        <div className="h-2 bg-gray-700 rounded-full mt-3 overflow-hidden">
                          <div
                            className="h-full bg-fuchsia-500 transition-all"
                            style={{ width: `${data.status.progress}%` }}
                          ></div>
                        </div>
                      ) : null}
                    </>
                  )
                })()}

              </div>
              <div className='absolute z-10 top-2 right-2 rounded-full border px-2 text-red-500 border-red-500'>
                <button
                  type='button'
                  className='text-xl cursor-pointer'
                  onClick={() => handleDeleteVideo(v.id)}
                  disabled={deletingVideoIds.includes(v.id)}
                >
                  X
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-6">
            Chưa có video {activeTab.toLowerCase()} nào.
          </div>
        )}
      </div>
    </div >
  )
}
