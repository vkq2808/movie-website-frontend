import { MovieSwiper, GenreList, LanguageMovieSelector } from "@/components/common";

export default function Home() {
  return (
    <main className="flex flex-col w-full bg-black">
      {/* Movie Hero Section - Fixed height for consistency */}
      <div className="w-full h-[80vh] flex justify-center items-center">
        <MovieSwiper />
      </div>

      {/* Genre List Section - Fixed height during loading */}
      <div className="w-full bg-black">
        <GenreList />
      </div>

      {/* Language Movies Section - Consistent styling */}
      <div className="w-full bg-black text-white py-8">
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
