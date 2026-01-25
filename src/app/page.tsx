import { MovieSwiper, GenreList, LanguageMovieSelector, RecommendationSection } from "@/components/common";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MovieStream - Discover Amazing Movies & Entertainment",
  description: "Explore thousands of movies across all genres. Get personalized recommendations, watch trailers, and discover your next favorite film on MovieStream.",
  openGraph: {
    title: "MovieStream - Your Ultimate Movie Discovery Platform",
    description: "Explore thousands of movies, get personalized recommendations, and discover entertainment tailored just for you.",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "MovieStream Homepage",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      {/* Hero Section with Featured Movies */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex justify-center items-center bg-gradient-to-b from-gray-900 via-black to-black overflow-hidden">
        {/* Background overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        {/* Main hero content */}
        <div className="relative z-20 w-full h-full">
          <MovieSwiper />
        </div>
      </section>

      {/* Genre Exploration Section */}
      <section className="w-full py-12" aria-labelledby="genres-heading">
        <div className="w-full items-center flex flex-col justify-center">
          <header className="text-center mb-8">
            <h2 id="genres-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Khám phá với các thể loại
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Hãy duyệt qua bộ sưu tập phim được tuyển chọn kỹ lưỡng của chúng tôi, được sắp xếp theo thể loại yêu thích của bạn.
            </p>
          </header>
          <GenreList />
        </div>
      </section>

      {/* Personalized Recommendations Section */}
      <section className="w-full bg-gradient-to-b from-gray-900 to-black py-16" aria-labelledby="recommendations-heading">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h2 id="recommendations-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Phim đang hot
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Khám phá những bộ phim nổi tiếng nhất hiện nay, hoặc đăng nhập để nhận đề xuất cá nhân hóa.
            </p>
          </header>
          <RecommendationSection title="" showRefresh={true} />
        </div>
      </section>

      {/* International Movies Section */}
      <section className="w-full bg-gradient-to-b from-black to-gray-900 py-16" aria-labelledby="international-heading">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h2 id="international-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Phim quốc tế
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Khám phá các bộ phim từ khắp thế giới và tìm hiểu những câu chuyện đa dạng từ các nền văn hóa và ngôn ngữ khác nhau.
            </p>
          </header>

          <LanguageMovieSelector
            title=""
            limit={12}
            height="auto"
            width="100%"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gradient-to-b from-gray-900 to-black py-16" aria-labelledby="features-heading">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tại sao nên chọn MovieStream?
            </h2>
          </header>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <article className="text-center text-white">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Phát trực tuyến chất lượng cao</h3>
              <p className="text-gray-300">Thưởng thức phim với chất lượng HD tuyệt đẹp và trải nghiệm phát trực tuyến mượt mà.</p>
            </article>

            <article className="text-center text-white">
              <div className="bg-gradient-to-br from-green-600 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Đề xuất thông minh</h3>
              <p className="text-gray-300">Đề xuất dựa trên trí tuệ nhân tạo, dựa trên sở thích và lịch sử xem của bạn.</p>
            </article>

            <article className="text-center text-white">
              <div className="bg-gradient-to-br from-red-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Nội dung toàn cầu</h3>
              <p className="text-gray-300">Truy cập các bộ phim từ khắp thế giới với nhiều tùy chọn ngôn ngữ.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Bạn đã sẵn sàng bắt đầu hành trình làm phim của mình chưa?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Hãy tham gia cùng hàng nghìn người yêu thích phim ảnh tin tưởng MovieStream để đáp ứng nhu cầu giải trí của họ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Bắt đầu ngay
            </a>
          </div>
        </div>
      </section>

      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "MovieStream Homepage",
            "description": "Discover amazing movies, get personalized recommendations, and explore cinema on MovieStream",
            "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "mainEntity": {
              "@type": "WebSite",
              "name": "MovieStream",
              "alternateName": "Movie Stream Platform",
              "description": "Your ultimate destination for movie discovery and entertainment"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
                }
              ]
            }
          })
        }}
      />
    </>
  );
}
