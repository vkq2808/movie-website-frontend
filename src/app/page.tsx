import MovieSlider from "@/components/common/MovieSlider";
import NoControlVideoPlayer from "@/components/common/video-player/NoControlVideoPlayer";

export default function Home() {

  const videoSrc = "http://localhost:2808/video/test.mp4"; // Replace with your video source

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-[70vh]">
      <div className="w-full flex justify-center items-center h-fit py-10">
        <MovieSlider />
      </div>
      <div className="w-100 flex justify-center items-center h-100">
        <NoControlVideoPlayer src={videoSrc} />
      </div>
    </main>
  );
}
