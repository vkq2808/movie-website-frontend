"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
} from "lucide-react";
import Hls from "hls.js";
import Cookies from "js-cookie";

/**
 * Parses an M3U8 playlist file to extract the total duration
 * by summing up all EXTINF values
 */
const parseM3U8Duration = async (m3u8Url: string): Promise<number> => {
  try {
    const response = await fetch(m3u8Url, {
      credentials: "include", // Include cookies in the request
      headers: {
        Cookie: document.cookie, // Explicitly send cookies
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch M3U8 file: ${response.status}`);
    }

    const content = await response.text();
    const lines = content.split("\n");
    let totalDuration = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("#EXTINF:")) {
        // Extract duration from #EXTINF:6.000 format
        const durationMatch = trimmedLine.match(/#EXTINF:(\d+\.?\d*)/);
        if (durationMatch && durationMatch[1]) {
          const duration = parseFloat(durationMatch[1]);
          if (!isNaN(duration)) {
            totalDuration += duration;
          }
        }
      }
    }

    return totalDuration;
  } catch (error) {
    console.error("Error parsing M3U8 file:", error);
    return 0;
  }
};

interface VideoPlayerProps {
  videoSrc: string;
  resolutions: string[];
}

export default function VideoPlayer({
  videoSrc,
  resolutions,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRes, setSelectedRes] = useState("1080");
  const [buffered, setBuffered] = useState(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedVolume = Cookies.get("player_volume");
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
    }
  }, []);

  // Fetch M3U8 duration when component mounts
  useEffect(() => {
    const fetchDuration = async () => {
      try {
        // Try different URL patterns to find the index.m3u8 file
        let m3u8Url = "";

        // Pattern 1: If videoSrc already points to index.m3u8, use it directly
        if (videoSrc.endsWith("index.m3u8")) {
          m3u8Url = videoSrc;
        }
        // Pattern 2: If videoSrc points to a numbered m3u8 file, replace with index.m3u8
        else if (videoSrc.match(/\/[^/]+\.m3u8$/)) {
          m3u8Url = videoSrc.replace(/\/[^/]+\.m3u8$/, "/index.m3u8");
        }
        // Pattern 3: If videoSrc is a directory, append index.m3u8
        else if (videoSrc.endsWith("/")) {
          m3u8Url = `${videoSrc}index.m3u8`;
        }
        // Pattern 4: If videoSrc is a base URL without trailing slash
        else {
          m3u8Url = `${videoSrc}/index.m3u8`;
        }

        console.log("Attempting to fetch M3U8 from:", m3u8Url);
        const duration = await parseM3U8Duration(m3u8Url);
        if (duration > 0) {
          console.log("Successfully parsed M3U8 duration:", duration);
          setDuration(duration);
        } else {
          console.log(
            "M3U8 parsing returned 0 duration, falling back to video metadata"
          );
        }
      } catch (error) {
        console.error("Failed to fetch M3U8 duration:", error);
      }
    };

    fetchDuration();
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;

    let hls: Hls | null = null;

    // Nếu browser hỗ trợ native HLS (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
    } else if (Hls.isSupported()) {
      // Nếu Chrome, Firefox, Edge,...
      hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest loaded");
        video.play().catch(() => { }); // optional
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        console.log("Switched to level:", data.level);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS Error:", data);
      });
    } else {
      console.error("HLS not supported by this browser.");
    }

    const handleLoadedMetadata = () => {
      // Only set duration from video metadata if we don't already have a duration from M3U8
      if (video.duration && !isNaN(video.duration) && duration === 0) {
        setDuration(video.duration);
      }
    };

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(
          (video.buffered.end(video.buffered.length - 1) / video.duration) * 100
        );
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current)
      return;
    if (selectedRes === "auto") return;
    if (selectedRes === "1080") {
      videoRef.current.src = videoSrc.replace(/\/[^/]+\.m3u8$/, "/1080p/index.m3u8");
    } else if (selectedRes === "720") {
      videoRef.current.src = videoSrc.replace(/\/[^/]+\.m3u8$/, "/720p/index.m3u8");
    } else if (selectedRes === "480") {
      videoRef.current.src = videoSrc.replace(/\/[^/]+\.m3u8$/, "/480p/index.m3u8");
    }
  }, [selectedRes])

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    // Validate rectangle dimensions
    if (width <= 0) {
      console.warn("Cannot seek: progress bar width is invalid");
      return;
    }

    const pos = clickX / width;

    // Validate position calculation
    if (isNaN(pos) || !isFinite(pos)) {
      console.warn("Cannot seek: position calculation is invalid", {
        clickX,
        width,
        pos,
      });
      return;
    }

    // Validate duration before seeking
    if (!duration || isNaN(duration) || duration <= 0) {
      console.warn("Cannot seek: video duration is not available or invalid", {
        duration,
      });
      return;
    }

    // Calculate new time and validate it's within bounds
    const newTime = pos * duration;
    if (isNaN(newTime) || !isFinite(newTime)) {
      console.warn("Cannot seek: calculated time is invalid", {
        pos,
        duration,
        newTime,
      });
      return;
    }

    // Ensure the new time is within valid range
    const safeTime = Math.max(0, Math.min(newTime, duration));

    try {
      videoRef.current.currentTime = safeTime;
      console.log("Successfully seeked to:", safeTime);
    } catch (error) {
      console.error("Failed to seek video:", error);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
    // ✅ Lưu vào cookie
    Cookies.set("player_volume", vol.toString(), { expires: 365 });
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleResolutionChange = (res: string) => {
    setSelectedRes(res);
    setShowSettings(false);
    // In real implementation, this would reload the HLS source
  };
  useEffect(() => {
    console.log(buffered);
  }, [buffered]);

  return (
    <div
      ref={containerRef}
      className="relative w-full mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black"
        onClick={togglePlay}
        src={videoSrc}
      />

      {/* Gradient Overlays */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
          }`}
        style={{ zIndex: 10 }}
      />

      {/* Center Play Button (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={togglePlay}
            className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-purple-500/50"
          >
            <Play className="w-12 h-12 text-white ml-2" fill="white" />
          </button>
        </div>
      )}

      {/* Controls Container */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 ${showControls ? "translate-y-0" : "translate-y-full"
          }`}
        style={{ zIndex: 20 }}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="relative h-2 bg-white/20 rounded-full mb-4 cursor-pointer group backdrop-blur-sm"
          onClick={handleSeek}
        >
          {/* Buffered */}
          <div
            className="absolute h-full bg-white/30 rounded-full"
            style={{ width: `${buffered}%` }}
          />
          {/* Progress */}
          <div
            className="absolute h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white">
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-1" />
              )}
            </button>

            <button
              type="button"
              onClick={() => skip(-10)}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => skip(10)}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 group">
              <button
                type="button"
                onClick={toggleMute}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover:w-24 transition-all duration-300 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            <span className="text-sm font-medium backdrop-blur-md bg-white/10 px-3 py-1 rounded-full">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Settings Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-xl rounded-xl p-3 min-w-[160px] shadow-2xl border border-white/10">
                  <div className="text-xs font-semibold text-gray-400 mb-2">
                    Quality
                  </div>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => handleResolutionChange("auto")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedRes === "auto"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "hover:bg-white/10 text-white/80"
                        }`}
                    >
                      Auto
                    </button>
                    {resolutions.map((res) => (
                      <button
                        type="button"
                        key={res}
                        onClick={() => handleResolutionChange(res)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedRes === res
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "hover:bg-white/10 text-white/80"
                          }`}
                      >
                        {res}p
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {duration === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
