"use client";

import React, { useState } from "react";

export default function LiveVideoControls({
  isHost,
  playing,
  progress,
  onPlay,
  onPause,
  onSeek,
}: {
  isHost: boolean;
  playing: boolean;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (position: number) => void;
}) {
  const [seekValue, setSeekValue] = useState(progress);

  return (
    <div className="flex items-center gap-3 p-2 bg-black/40 rounded">
      <button
        className={`px-3 py-1 rounded text-white ${isHost ? 'bg-blue-600' : 'bg-gray-600 cursor-not-allowed'}`}
        onClick={() => {
          if (!isHost) return;
          if (playing) onPause(); else onPlay();
        }}
        disabled={!isHost}
      >
        {playing ? 'Pause' : 'Play'}
      </button>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={3600}
          step={0.1}
          value={seekValue}
          onChange={(e) => {
            setSeekValue(Number(e.target.value));
          }}
          onMouseUp={() => {
            if (!isHost) return;
            onSeek(seekValue);
          }}
          disabled={!isHost}
          className={`w-64 ${isHost ? '' : 'opacity-60'}`}
        />
        <div className="text-white text-xs">{seekValue.toFixed(1)}s</div>
      </div>
    </div>
  );
}
