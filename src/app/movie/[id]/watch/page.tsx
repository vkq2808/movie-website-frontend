'use client';
import React, { useState } from 'react';
import { Play, Star, ThumbsUp, Share2, Plus, ChevronDown, MessageSquare, Clock, Calendar, Globe, Film } from 'lucide-react';

// Types
interface ProfileImage {
  url: string;
  alt: string;
}

interface Person {
  id: string;
  name: string;
  gender: number;
  adult: boolean;
  profile_image: ProfileImage | null;
}

interface Cast {
  id: string;
  character: string;
  order: number;
  person: Person;
}

interface Crew {
  id: string;
  department: string;
  job: string;
  person: Person;
}

interface Genre {
  id: string;
  names: Array<{ name: string; iso_639_1: string }>;
  original_id: number;
}

interface Language {
  id: string;
  name: string;
  iso_639_1: string;
}

interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Movie';
  official: boolean;
  embed_url: string;
  thumbnail: string;
  thumbnail_url: string;
  watch_provider: string | null;
  duration: number;
  qualities: {
    quality: '480p' | '720p' | '1080p';
    key: string;
  }[]
}

interface Feedback {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
}
interface Image {
  url: string;
  alt: string;
}

interface Movie {
  id: string;
  title: string;
  overview: string;
  cast: Cast[];
  crew: Crew[];
  original_language: Language;
  status: string;
  price: string;
  genres: Genre[];
  spoken_languages: Language[];
  release_date: string;
  videos: Video[];
  posters: Image[];
  backdrops: Image[];
  feedbacks?: Feedback[];
}

// Mock data based on provided structure
const mockMovie: Movie = {
  id: "6b48ede8-0cdf-4294-9ed3-0cf11f5dca1e",
  title: "Án mạng liên hoàn",
  overview: "Án mạng liên hoàn là phim điện ảnh tội phạm của Trung Quốc được cải biên từ tiểu thuyết Ánh sáng thành phố thuộc loạt truyện trinh thám Tâm lý tội phạm của tác giả Lôi Mễ. Phim do Từ Kỉ Châu đạo diễn và có sự tham gia diễn xuất của Đặng Siêu, Nguyễn Kinh Thiên và Lưu Thi Thi.",
  cast: [
    {
      id: "145fb89f-db32-48b7-8597-c49f40454aca",
      character: "Fang Mu",
      order: 0,
      person: {
        id: "79cb8a3f-7afa-451f-912b-ef60557def3b",
        name: "Đặng Siêu",
        gender: 2,
        adult: false,
        profile_image: {
          url: "https://image.tmdb.org/t/p/original/k2pylMn5jG6z3KGrQOXP473ULNK.jpg",
          alt: "Đặng Siêu"
        }
      }
    },
    {
      id: "aa0a9134-8b07-4414-a01f-cd2e7c7ceb3d",
      character: "Jiang Ya",
      order: 1,
      person: {
        id: "d9c256b4-0435-472a-a48d-7282e455d344",
        name: "Nguyễn Kinh Thiên",
        gender: 2,
        adult: false,
        profile_image: {
          url: "https://image.tmdb.org/t/p/original/vDiFcca1TYcFssxjU9efGjIAWN4.jpg",
          alt: "Nguyễn Kinh Thiên"
        }
      }
    },
    {
      id: "89f9d99a-5157-45c6-9aec-a46d68b3066b",
      character: "Mi Nan",
      order: 2,
      person: {
        id: "1ff2ceef-2f8a-49a1-82fc-07f5eaa83997",
        name: "Lưu Thi Thi",
        gender: 1,
        adult: false,
        profile_image: {
          url: "https://image.tmdb.org/t/p/original/yPyMTroHKKpK2g24o7920erAa3L.jpg",
          alt: "Lưu Thi Thi"
        }
      }
    },
    {
      id: "a2e0999f-8915-45c3-925b-a4783c9fb1fb",
      character: "Wei Wei",
      order: 3,
      person: {
        id: "1b6faba2-3962-4fca-a273-0ba2514f7be1",
        name: "Lâm Gia Hân",
        gender: 1,
        adult: false,
        profile_image: {
          url: "https://image.tmdb.org/t/p/original/vAVVDVf9NZC88rnRRFg0FqayXEH.jpg",
          alt: "Lâm Gia Hân"
        }
      }
    },
    {
      id: "9f30b875-28c4-4427-ae2e-8cdfa2eca7b4",
      character: "Ren Chuan",
      order: 4,
      person: {
        id: "bcf7ccd6-a21d-4322-88ea-b9c7fa0ba2eb",
        name: "Quách Kinh Phi",
        gender: 2,
        adult: false,
        profile_image: {
          url: "https://image.tmdb.org/t/p/original/xNyi4uOHKAqCgW7JhV5MPn5BG88.jpg",
          alt: "Quách Kinh Phi"
        }
      }
    },
    {
      id: "85b8499b-3b31-43f5-a787-eab1ceaa9718",
      character: "Qi Yuan",
      order: 5,
      person: {
        id: "09c36654-5da9-4c71-aa45-7ddcade8b375",
        name: "Hà Hoằng San",
        gender: 1,
        adult: false,
        profile_image: {
          url: "https://image.tmdb.org/t/p/original/3D38zuXKzqmj7TegdDvhh8Bow1K.jpg",
          alt: "Hà Hoằng San"
        }
      }
    }
  ],
  crew: [
    {
      id: "8aa76277-f980-49eb-b491-cce0c1f01218",
      department: "Directing",
      job: "Director",
      person: {
        id: "cc50c386-2cd2-483a-b682-989706c6eb9c",
        name: "徐纪周",
        gender: 2,
        adult: false,
        profile_image: {
          url: "https://image.tmdb.org/t/p/original/1rNhi2FVRbFkSIsZVqWg6T8bP9E.jpg",
          alt: "徐纪周"
        }
      }
    },
    {
      id: "bf8d8a10-8c4e-4ee7-9a1d-4018f41e8dd1",
      department: "Writing",
      job: "Screenplay",
      person: {
        id: "cc50c386-2cd2-483a-b682-989706c6eb9c",
        name: "徐纪周",
        gender: 2,
        adult: false,
        profile_image: {
          url: "https://image.tmdb.org/t/p/original/1rNhi2FVRbFkSIsZVqWg6T8bP9E.jpg",
          alt: "徐纪周"
        }
      }
    },
    {
      id: "c605cdc6-511b-42b7-82b3-83a758b0a638",
      department: "Crew",
      job: "Choreographer",
      person: {
        id: "ea415831-40b1-4ca5-aebc-42c9cd9fcbe2",
        name: "谷垣健治",
        gender: 2,
        adult: false,
        profile_image: {
          url: "https://image.tmdb.org/t/p/original/2ZV2n02pZq1Sc2szQuyF1HVssi7.jpg",
          alt: "谷垣健治"
        }
      }
    }
  ],
  original_language: {
    id: "5fec6729-8b81-42a9-a0b2-24af581aa0c5",
    name: "Mandarin",
    iso_639_1: "zh"
  },
  status: "draft",
  price: "18.45",
  genres: [
    {
      id: "41aa89a0-c72e-44ca-90ec-37f4aa303389",
      names: [{ name: "Phim Gây Cấn", iso_639_1: "vi" }],
      original_id: 53
    },
    {
      id: "67a250c2-80f9-4151-87d9-1003834e93d0",
      names: [{ name: "Phim Hình Sự", iso_639_1: "vi" }],
      original_id: 80
    }
  ],
  spoken_languages: [
    {
      id: "5fec6729-8b81-42a9-a0b2-24af581aa0c5",
      name: "Mandarin",
      iso_639_1: "zh"
    }
  ],
  release_date: "",
  videos: [
    {
      id: "c511c511-a425-4e62-937c-a1405964b865",
      iso_639_1: "en",
      iso_3166_1: "US",
      name: "The Liquidator - In Cinemas 28 December 2017",
      key: "if0-3sOHiK0",
      site: "YouTube",
      size: 1080,
      type: "Trailer",
      official: false,
      embed_url: "https://www.youtube-nocookie.com/embed/if0-3sOHiK0?origin=*",
      thumbnail: "https://i.ytimg.com/vi/if0-3sOHiK0/hqdefault.jpg",
      thumbnail_url: "https://img.youtube.com/vi/if0-3sOHiK0/hqdefault.jpg",
      watch_provider: null,
      duration: -1,
      qualities: []
    }
  ],
  posters: [],
  backdrops: [],
  feedbacks: [
    {
      id: 'f1',
      userName: 'Minh Anh',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 9,
      comment: 'Phim hay, diễn xuất tuyệt vời! Cốt truyện hấp dẫn từ đầu đến cuối.',
      createdAt: '2 giờ trước',
      likes: 24
    },
    {
      id: 'f2',
      userName: 'Tuấn Kiệt',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 8,
      comment: 'Nội dung sâu sắc, phản ánh nhiều vấn đề xã hội. Đáng xem!',
      createdAt: '5 giờ trước',
      likes: 18
    }
  ]
};

const MovieWatchPage = () => {
  const [movie] = useState<Movie>(mockMovie);
  const [selectedTab, setSelectedTab] = useState<'info' | 'cast' | 'feedback'>('info');
  const [showAllCast, setShowAllCast] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(
    movie.videos.find(v => v.type === 'Movie') || movie.videos[0] || null
  );

  // Lấy thông tin đạo diễn
  const director = movie.crew.find(c => c.job === 'Director');

  // Lấy poster (fallback nếu không có)
  const posterUrl = movie.posters.length > 0
    ? movie.posters[0].url
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop';

  // Lấy backdrop (fallback nếu không có)
  const backdropUrl = movie.backdrops.length > 0
    ? movie.backdrops[0].url
    : 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop';

  // Kiểm tra có video Movie không
  const hasMovieVideo = movie.videos.some(v => v.type === 'Movie');

  // Lọc video theo loại
  const trailers = movie.videos.filter(v => v.type === 'Trailer');
  const movieVideos = movie.videos.filter(v => v.type === 'Movie');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Video Player Section */}
      <div className="relative w-full bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
            {selectedVideo ? (
              selectedVideo.site === 'YouTube' ? (
                <iframe
                  src={selectedVideo.embed_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.name}
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={selectedVideo.thumbnail || backdropUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center shadow-2xl">
                      <Play className="w-10 h-10 text-white ml-1" fill="white" />
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={backdropUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Film className="w-16 h-16 text-gray-500" />
                  <p className="text-gray-400 text-lg">Chưa có video để phát</p>
                </div>
              </div>
            )}

            {/* Video Info Overlay */}
            {selectedVideo && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">{selectedVideo.type}</p>
                    <p className="font-semibold">{selectedVideo.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video Tabs */}
          {movie.videos.length > 0 && (
            <div className="bg-gray-950 border-t border-gray-800">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex gap-4 overflow-x-auto">
                  {movieVideos.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2 uppercase">Phim chính</p>
                      <div className="flex gap-2">
                        {movieVideos.map((video) => (
                          <button
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className={`flex-shrink-0 relative group ${selectedVideo?.id === video.id ? 'ring-2 ring-red-600' : ''
                              }`}
                          >
                            <img
                              src={video.thumbnail_url}
                              alt={video.name}
                              className="w-40 h-24 object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center rounded">
                              <Play className="w-8 h-8 text-white" fill="white" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {trailers.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2 uppercase">Trailer & Video</p>
                      <div className="flex gap-2">
                        {trailers.map((video) => (
                          <button
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className={`flex-shrink-0 relative group ${selectedVideo?.id === video.id ? 'ring-2 ring-red-600' : ''
                              }`}
                          >
                            <img
                              src={video.thumbnail_url}
                              alt={video.name}
                              className="w-40 h-24 object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center rounded">
                              <Play className="w-8 h-8 text-white" fill="white" />
                            </div>
                            <p className="absolute bottom-2 left-2 text-xs bg-black/80 px-2 py-1 rounded">
                              {video.type}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Movie Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Poster */}
          <div className="lg:w-64 flex-shrink-0">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full rounded-lg shadow-xl"
            />
            <div className="mt-4 space-y-2">
              {!hasMovieVideo ? (
                <div className="w-full bg-gray-800 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-gray-400 cursor-not-allowed">
                  <Film className="w-5 h-5" />
                  Chưa có phim
                </div>
              ) : (
                <button className="w-full bg-red-600 hover:bg-red-700 transition-colors py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Xem Phim
                </button>
              )}
              <button className="w-full bg-gray-800 hover:bg-gray-700 transition-colors py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Danh Sách
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 transition-colors py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Chia Sẻ
              </button>
            </div>

            {/* Price */}
            {movie.price && parseFloat(movie.price) > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-600/50 rounded-lg">
                <p className="text-sm text-gray-300 mb-1">Giá thuê</p>
                <p className="text-2xl font-bold text-yellow-500">${movie.price}</p>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {movie.release_date && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400">
                <Globe className="w-4 h-4" />
                <span>{movie.original_language.name}</span>
              </div>
              {movie.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${movie.status === 'draft'
                  ? 'bg-yellow-600/20 text-yellow-500'
                  : 'bg-green-600/20 text-green-500'
                  }`}>
                  {movie.status === 'draft' ? 'Nháp' : 'Đã phát hành'}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {genre.names[0]?.name || 'Thể loại'}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800 mb-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setSelectedTab('info')}
                  className={`pb-4 font-semibold transition-colors ${selectedTab === 'info'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Thông Tin
                </button>
                <button
                  onClick={() => setSelectedTab('cast')}
                  className={`pb-4 font-semibold transition-colors ${selectedTab === 'cast'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Diễn Viên ({movie.cast.length})
                </button>
                <button
                  onClick={() => setSelectedTab('feedback')}
                  className={`pb-4 font-semibold transition-colors flex items-center gap-2 ${selectedTab === 'feedback'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Đánh Giá ({movie.feedbacks?.length || 0})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {selectedTab === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Nội Dung Phim</h3>
                    <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Thông Tin</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {director && (
                        <div>
                          <span className="text-gray-400">Đạo diễn:</span>
                          <span className="ml-2 text-white font-semibold">{director.person.name}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Ngôn ngữ gốc:</span>
                        <span className="ml-2 text-white font-semibold">{movie.original_language.name}</span>
                      </div>
                      {movie.spoken_languages.length > 0 && (
                        <div>
                          <span className="text-gray-400">Ngôn ngữ:</span>
                          <span className="ml-2 text-white font-semibold">
                            {movie.spoken_languages.map(l => l.name).join(', ')}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Trạng thái:</span>
                        <span className="ml-2 text-white font-semibold capitalize">{movie.status}</span>
                      </div>
                    </div>
                  </div>

                  {movie.crew.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Đội Ngũ Sản Xuất</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {movie.crew.map((member) => (
                          <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            {member.person.profile_image && (
                              <img
                                src={member.person.profile_image.url}
                                alt={member.person.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-semibold">{member.person.name}</p>
                              <p className="text-sm text-gray-400">{member.job}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'cast' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Diễn Viên</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(showAllCast ? movie.cast : movie.cast.slice(0, 8)).map((actor) => (
                      <div key={actor.id} className="text-center group cursor-pointer">
                        <div className="relative mb-3 overflow-hidden rounded-lg">
                          {actor.person.profile_image ? (
                            <img
                              src={actor.person.profile_image.url}
                              alt={actor.person.name}
                              className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full aspect-square bg-gray-800 flex items-center justify-center">
                              <span className="text-4xl text-gray-600">?</span>
                            </div>
                          )}
                        </div>
                        <p className="font-semibold mb-1">{actor.person.name}</p>
                        <p className="text-sm text-gray-400">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                  {movie.cast.length > 8 && (
                    <button
                      onClick={() => setShowAllCast(!showAllCast)}
                      className="mt-6 mx-auto flex items-center gap-2 text-red-600 hover:text-red-500 font-semibold"
                    >
                      {showAllCast ? 'Thu gọn' : 'Xem thêm'}
                      <ChevronDown className={`w-5 h-5 transition-transform ${showAllCast ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              )}

              {selectedTab === 'feedback' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Đánh Giá Từ Khán Giả</h3>
                    <button className="px-6 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg font-semibold">
                      Viết Đánh Giá
                    </button>
                  </div>

                  {movie.feedbacks && movie.feedbacks.length > 0 ? (
                    <div className="space-y-4">
                      {movie.feedbacks.map((feedback) => (
                        <div key={feedback.id} className="p-6 bg-gray-800/50 rounded-lg">
                          <div className="flex items-start gap-4">
                            <img
                              src={feedback.avatar}
                              alt={feedback.userName}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-semibold">{feedback.userName}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                                      <span className="text-sm font-semibold">{feedback.rating}/10</span>
                                    </div>
                                    <span className="text-sm text-gray-400">• {feedback.createdAt}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-300 mb-3">{feedback.comment}</p>
                              <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span>Hữu ích ({feedback.likes})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                      <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg mb-2">Chưa có đánh giá nào</p>
                      <p className="text-gray-500 text-sm">Hãy là người đầu tiên đánh giá phim này!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieWatchPage;
