import MovieSlider from "@/components/common/MovieSlider";
import VideoPlayer from "@/components/common/video-player/VideoPlayer"

export default function Home() {

  const videoSrc = "http://localhost:2808/video/test.mp4"; // Replace with your video source

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-[70vh]">
      <div className="w-full h-fit flex justify-center items-center">
        <MovieSlider />
      </div>
      {/* <div className="w-100 flex justify-center items-center h-100">
        <VideoPlayer src={videoSrc} />
      </div> */}
    </main>
  );
}
