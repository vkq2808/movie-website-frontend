'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Movie } from '@/zustand'
import Script from 'next/script'
import clsx from 'clsx'
import { getMovieVideos } from '@/apis/movie.api'
import type { VideoResponseDto } from '@/dto/movie-video.dto'

interface MovieDetailTabProps {
  movie: Movie
}

type YTPlayer = {
  destroy(): void;
  playVideo(): void;
  pauseVideo(): void;
};

interface YTPlayerOptions {
  videoId: string;
  playerVars?: {
    controls?: 0 | 1;
    modestbranding?: 0 | 1;
    rel?: 0 | 1;
  };
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onError?: (event: { target: YTPlayer; data: number }) => void;
    onStateChange?: (event: { target: YTPlayer; data: number }) => void;
  };
}

const MovieDetailTab: React.FC<MovieDetailTabProps> = ({ movie }) => {
  const [videos, setVideos] = useState<VideoResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isVideoError, setIsVideoError] = useState(false)
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState(false)
  const playerRef = useRef<YTPlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const [mainVideo, setMainVideo] = useState<VideoResponseDto | null>(null)

  // Handle YouTube API Ready
  useEffect(() => {
    if (window.YT?.Player) {
      setIsYouTubeApiReady(true);
    } else {
      const originalCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        setIsYouTubeApiReady(true);
        if (originalCallback) {
          originalCallback();
        }
      };
    }
  }, []);

  // Fetch videos when component mounts
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await getMovieVideos(movie.id);
        console.log(response)
        if (response.success && response.data) {
          setMainVideo(response.data?.find(v => v.type === 'Trailer') || response.data[0] || null);
        } else {
          console.error('Failed to fetch videos:', response.message);
          setIsVideoError(true);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setIsVideoError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (movie.id) {
      fetchVideos();
    } else {
      console.error('No movie ID provided');
      setIsVideoError(true);
    }
  }, [movie.id]);

  // Initialize YouTube player when API is ready and we have video data
  useEffect(() => {
    if (isYouTubeApiReady && mainVideo?.site === 'YouTube' && !isVideoError) {
      initializeYouTubePlayer();
    }
  }, [isYouTubeApiReady, mainVideo, isVideoError]);

  // Xử lý khởi tạo YouTube player
  const initializeYouTubePlayer = () => {
    if (!isYouTubeApiReady) {
      console.log('YouTube API not ready yet');
      return;
    }

    console.log('Initializing YouTube player:', {
      mainVideo,
      hasContainer: !!playerContainerRef.current,
      hasYT: !!window.YT
    });

    // Ensure we have valid data and DOM element
    if (!mainVideo?.key || !playerContainerRef.current) {
      console.warn('Missing required data for YouTube player:', {
        hasVideo: !!mainVideo,
        videoKey: mainVideo?.key,
        hasContainer: !!playerContainerRef.current
      });
      return;
    }

    // Create new player instance
    try {
      console.log('Creating YouTube player with video key:', mainVideo.key);
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: mainVideo.key,
        playerVars: {
          controls: 1, // Hiển thị controls để user có thể play/pause
          modestbranding: 1,
          rel: 0, // Không hiện video liên quan khi kết thúc
        },
        events: {
          onReady: (event) => {
            console.log('YouTube player ready');
          },
          onError: (error) => {
            console.error('YouTube player error:', error);
            setIsVideoError(true);
          },
          onStateChange: (event) => {
            console.log('YouTube player state changed:', event.data);
          }
        }
      });
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      setIsVideoError(true);
    }
  };

  // Xử lý cho Vimeo
  const vimeoUrl = mainVideo?.site === 'Vimeo'
    ? `https://player.vimeo.com/video/${mainVideo.key}`
    : null;

  return (
    <div className="space-y-8">
      {/* --- Title --- */}
      <h2 className="text-2xl font-bold text-white">Thông tin phim</h2>

      {/* --- Trailer Player Section --- */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="aspect-video bg-black flex items-center justify-center">
          <div className="text-xs text-gray-500 absolute top-2 left-2">
            Debug: {isLoading ? 'Loading' : videos?.length ? `Found ${videos?.length} videos` : 'No videos'}
          </div>

          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-gray-400 mt-4">Đang tải video...</p>
            </div>
          ) : mainVideo?.site === 'YouTube' && !isVideoError ? (
            <>
              <Script
                src="https://www.youtube.com/iframe_api"
                strategy="lazyOnload"
                async
                onReady={() => {
                  // Set up the global callback that YouTube API will call when ready
                  window.onYouTubeIframeAPIReady = () => {
                    if (window.YT?.Player) {
                      initializeYouTubePlayer();
                    }
                  };

                  // If YT API is already loaded, initialize directly
                  if (window.YT?.Player) {
                    initializeYouTubePlayer();
                  }
                }}
              />
              <div ref={playerContainerRef} className="w-full h-full" />
            </>
          ) : vimeoUrl ? (
            <iframe
              src={vimeoUrl}
              title={mainVideo?.name || 'Trailer'}
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl text-gray-600 mb-4">📽</div>
              <p className="text-gray-400">
                {isVideoError ? 'Không thể tải video trailer' : 'Không có video trailer'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- Movie Info --- */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Năm phát hành:</span>
            <span className="text-white ml-2">
              {movie.release_date?.split('-')[0] || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-gray-400">Đánh giá:</span>
            <span className="text-white ml-2">
              {movie.vote_average?.toFixed(1) || '?'}
              /10 ({movie.vote_count || 0} lượt)
            </span>
          </div>

          <div>
            <span className="text-gray-400">Thời lượng:</span>
            <span className="text-white ml-2">
              {movie.duration ? `${movie.duration} phút` : 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-gray-400">Thể loại:</span>
            <span className="text-white ml-2">
              {movie.genres?.map(g => g.names?.[0]?.name).join(', ') || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* --- Overview --- */}
      {movie.overview && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-2">Nội dung phim</h3>
          <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
        </div>
      )}

      {/* --- Watch Button --- */}
      <div className="flex justify-center">
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition">
          🎬 Xem phim ngay
        </button>
      </div>
    </div>
  )
}

export default MovieDetailTab
