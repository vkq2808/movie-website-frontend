'use client';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  videoKey: string;
}

const resolutions = ['1080', '720', '480']; // resolutions có sẵn

export default function VideoPlayer({ videoKey }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hls, setHls] = useState<Hls | null>(null);
  const [selectedRes, setSelectedRes] = useState('1080');

  const getPlaylistUrl = (res: string) => {
    if (res === 'auto') return `/video/stream/${videoKey}/master.m3u8`;
    return `/video/stream/${videoKey}/${res}/index.m3u8`;
  };

  useEffect(() => {
    if (!videoRef.current) return;

    if (Hls.isSupported()) {
      const hlsInstance = new Hls();
      hlsInstance.loadSource(`http://localhost:2808${getPlaylistUrl(selectedRes)}`);
      hlsInstance.attachMedia(videoRef.current);
      setHls(hlsInstance);

      return () => {
        hlsInstance.destroy();
      };
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = getPlaylistUrl(selectedRes);
    }
  }, [videoKey, selectedRes]);

  return (
    <div>
      <video ref={videoRef} controls style={{ width: '100%' }} />
      <div style={{ marginTop: 8 }}>
        <span>Resolution: </span>
        <select
          value={selectedRes}
          onChange={(e) => setSelectedRes(e.target.value)}
        >
          <option value="auto">Auto</option>
          {resolutions.map((r) => (
            <option key={r} value={r}>{r}p</option>
          ))}
        </select>
      </div>
    </div>
  );
}
