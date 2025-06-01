import { MovieSwiper, GenreList, LanguageMovieSelector } from "@/components/common";

export default function Home() {

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-[70vh] bg-black ">
      <div className="w-full h-fit flex justify-center items-center">
        <MovieSwiper />
      </div>
      <GenreList />
      <div className="min-h-screen bg-gray-900 text-white py-8 w-full">
        <div className="w-full container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Discover Movies By Language</h1>

          {/* LanguageMovieSelector component with predefined languages */}
          <LanguageMovieSelector
            title="Featured International Movies"
            limit={12}
            height="auto"
            width="100%"
          />
        </div>
      </div>
    </main>
  );
}
