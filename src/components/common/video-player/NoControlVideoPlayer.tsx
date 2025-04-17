'use client';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface NoControlVideoPlayerProps {
  src: string;
}

/**
 * NoControlVideoPlayer component to render a video player with a given source URL.
 * @param {string} src - The source URL of the video to be played.
 * @returns {JSX.Element} - A video player element.
 *
**/

const NoControlVideoPlayer: React.FC<NoControlVideoPlayerProps> = ({ src }) => {
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
      videoRef.current.src = src;
      videoRef.current.load();
    }
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg bg-black">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${isLoading ? 'hidden' : ''}`}
        autoPlay
        muted
        onClick={handleClick}
        loop
      ></video>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default NoControlVideoPlayer;