'use client'

import { useState, useRef } from 'react'
import { Upload, Film, Check, Loader2, Play } from 'lucide-react'
import {
  initUploadApi,
  uploadChunkApi,
  completeUploadApi,
  getUploadStatusApi
} from '@/apis/upload.api'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB

export default function VideoUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('idle')
  const [progress, setProgress] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const initUpload = async () => {
    if (!file) return alert('Chọn file trước!')
    setStatus('initializing')

    try {
      const data = await initUploadApi('test-movie', file.name)
      setSessionId(data.data.sessionId)
      setStatus('initialized')
      uploadChunks();
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  // -------------------------
  // 2️⃣ Upload Chunks
  // -------------------------
  const uploadChunks = async () => {
    if (!file || !sessionId) return
    setStatus('uploading')

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)

      await uploadChunkApi(sessionId, chunk, i)
      setProgress(Math.round(((i + 1) / totalChunks) * 100))
    }

    setStatus('uploaded')
    completeUpload();
  }

  const completeUpload = async () => {
    if (!sessionId) return
    setStatus('assembling')

    await completeUploadApi(sessionId)
    setStatus('converting')
    pollStatus()
  }

  const pollStatus = () => {
    if (!sessionId) return

    intervalRef.current = window.setInterval(async () => {
      const data = await getUploadStatusApi(sessionId)
      console.log(data)
      setStatus(data.data.message)

      if (data.data.progress === 100 && intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        setStatus('complete')
      }
    }, 5000)
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'idle': return 'Ready to upload'
      case 'initializing': return 'Initializing upload session...'
      case 'initialized': return 'Session ready - ready to upload chunks'
      case 'uploading': return 'Uploading video chunks...'
      case 'uploaded': return 'All chunks uploaded successfully'
      case 'assembling': return 'Assembling video chunks...'
      case 'converting': return 'Converting to HLS format...'
      case 'complete': return 'Upload complete! Video ready to stream'
      default: return status
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const isProcessing = ['initializing', 'uploading', 'assembling', 'converting'].includes(status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Film className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Video Uploader</h1>
            </div>
            <p className="text-violet-100">Upload and convert your videos to HLS format</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* File Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging
                ? 'border-violet-500 bg-violet-50 scale-105'
                : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="video/*"
              />

              {file ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      setSessionId(null)
                      setProgress(0)
                      setStatus('idle')
                    }}
                    className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full">
                    <Upload className="w-8 h-8 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {isDragging ? 'Drop your video here' : 'Choose a video or drag it here'}
                    </p>
                    <p className="text-sm text-gray-500">MP4, MOV, AVI or any video format</p>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {progress > 0 && status !== 'complete' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Upload Progress</span>
                  <span className="font-bold text-violet-600">{progress}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Message */}
            <div className={`rounded-xl p-4 flex items-center gap-3 ${status === 'complete'
              ? 'bg-green-50 border border-green-200'
              : isProcessing
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 border border-gray-200'
              }`}>
              {isProcessing && <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />}
              {status === 'complete' && <Check className="w-5 h-5 text-green-600" />}
              {status === 'idle' && <Play className="w-5 h-5 text-gray-400" />}
              <p className="text-sm font-medium text-gray-900">{getStatusMessage()}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={initUpload}
                disabled={!sessionId || !file || status !== 'initialized'}
                className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${!sessionId || !file || status !== 'initialized'
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-fuchsia-600 text-white hover:bg-fuchsia-700 hover:shadow-lg active:scale-95'
                  }`}
              >
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Your videos are processed securely and converted to HLS format for optimal streaming</p>
        </div>
      </div>
    </div>
  )
}