'use client'

import { useEffect, useRef } from 'react'

export default function HeroVideo({ videoUrl }: { videoUrl: string }) {
  const videoRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const iframe = videoRef.current
    if (!iframe) return
    const pauseVideo = () => {
      if (!iframe) return
      switch (true) {
        case videoUrl.includes('youtube'):
          iframe.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'pauseVideo' }),
            '*'
          )
          break
        case videoUrl.includes('vimeo'):
          iframe.contentWindow?.postMessage({ method: 'pause' }, '*')
          break
        case videoUrl.includes('dailymotion'):
          iframe.contentWindow?.postMessage({ command: 'pause' }, '*')
          break
      }
    }
    // ⚙️ 1. Khi người dùng chuyển tab -> tự động pause
    const handleVisibilityChange = () => {
      if (document.hidden) {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: pauseVideo }),
          '*'
        )
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // ⚙️ 2. Khi người dùng cuộn ra khỏi vùng hero -> pause video
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            iframe.contentWindow?.postMessage(
              JSON.stringify({ event: 'command', func: pauseVideo }),
              '*'
            )
          }
        })
      },
      { threshold: 0.3 } // chỉ cần 30% hero còn trong màn hình
    )

    observer.observe(iframe)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      observer.disconnect()
    }
  }, [])

  return (
    <section className="relative w-full aspect-video overflow-hidden">
      <iframe
        ref={videoRef}
        src={`${videoUrl}?enablejsapi=1&autoplay=1`}
        title="Hero Video"
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-full h-full rounded-2xl"
      />
    </section>
  )
}
