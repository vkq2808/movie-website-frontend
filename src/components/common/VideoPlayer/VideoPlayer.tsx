'use client';
import React, { ReactEventHandler } from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface NoControlVideoPlayerProps {
  src: string;
  controls?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  onClick?: (e?: React.SyntheticEvent<HTMLVideoElement>) => void;
  onLoadedData?: (e?: React.SyntheticEvent<HTMLVideoElement>) => void;
  onError?: (e?: React.SyntheticEvent<HTMLVideoElement>) => void;
  text?: string;
}

/**
 * NoControlVideoPlayer component to render a video player with a given source URL.
 * @param {string} src - The source URL of the video to be played.
 * @returns {JSX.Element} - A video player element.
 *
**/

const NoControlVideoPlayer: React.FC<NoControlVideoPlayerProps> = ({
  src,
  controls = false,
  loop = false,
  autoPlay = false,
  muted = false,
  onClick = undefined,
  onLoadedData = undefined,
  onError = undefined,
  text = 'Your browser does not support the video tag.'
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);


  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleClick = () => {
    if (videoRef.current) {
      if (videoRef.current.muted) {
        videoRef.current.muted = false;
      } else {
        videoRef.current.muted = true;
      }
    }
  }

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setIsLoading(false);
    console.error('Error loading video:', e);
  };

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', handleLoadedData);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', handleLoadedData);
      }
    };
  }, []);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg flex items-center justify-center scale-125">
      <video
        ref={videoRef}
        className={`w-auto h-[100vh]`}
        onClick={onClick ?? handleClick}
        onLoadedData={onLoadedData ?? handleLoadedData}
        onError={onError ?? handleError}
        loop={loop}
        muted={muted}
        controls={controls}
        autoPlay={autoPlay}
        playsInline
      >
        <source src={src} type="video/mp4" />
        {text}
      </video>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default NoControlVideoPlayer;