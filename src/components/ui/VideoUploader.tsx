'use client'

import { useState, useRef } from 'react'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB

export default function VideoUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('idle')
  const [progress, setProgress] = useState<number>(0)
  const intervalRef = useRef<number | null>(null)


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const initUpload = async () => {
    if (!file) return alert('Chọn file trước!')
    setStatus('Initializing upload...')
    const res = await fetch('http://localhost:2808/video/upload/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie_id: 'test-movie', filename: file.name })
    })
    const data = await res.json()
    setSessionId(data.data.sessionId)
    setStatus('Initialized')
  }

  const uploadChunks = async () => {
    if (!file || !sessionId) return
    setStatus('Uploading chunks...')
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)

      await fetch(`http://localhost:2808/video/upload/${sessionId}/chunk`, {
        method: 'PUT',
        headers: { 'x-chunk-index': i.toString() },
        body: chunk
      })

      setProgress(Math.round(((i + 1) / totalChunks) * 100))
    }

    setStatus('All chunks uploaded')
  }

  const completeUpload = async () => {
    if (!sessionId) return
    setStatus('Assembling chunks...')
    await fetch(`http://localhost:2808/video/upload/${sessionId}/complete`, { method: 'POST' })
    setStatus('Chunks assembled, converting to HLS...')
    pollStatus()
  }

  const pollStatus = () => {
    if (!sessionId) return
    intervalRef.current = window.setInterval(async () => {
      const res = await fetch(`http://localhost:2808/video/upload/${sessionId}/status`)
      const data = await res.json()
      console.log(data)
      setStatus(data.data.message)
      if (data.data.progress === 100 && intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }, 2000)
  }

  return (
    <div className="p-4 border rounded space-y-3 max-w-md">
      <h2 className="text-lg font-bold">Video Upload Tester</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={initUpload} disabled={!file || !!sessionId} className="px-3 py-1 bg-blue-500 text-white rounded">
        Init Upload
      </button>

      <button onClick={uploadChunks} disabled={!sessionId || !file} className="px-3 py-1 bg-green-500 text-white rounded">
        Upload Chunks
      </button>

      <button onClick={completeUpload} disabled={!sessionId} className="px-3 py-1 bg-purple-500 text-white rounded">
        Complete Upload
      </button>

      <div>Status: {status}</div>
      {progress > 0 && <div>Progress: {progress}%</div>}
    </div>
  )
}
