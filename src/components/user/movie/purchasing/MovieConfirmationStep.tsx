import { Genre, Movie } from "@/types/api.types";
import { useLanguageStore } from "@/zustand";
import { motion } from 'framer-motion';
import Image from "next/image";

interface Props {
  movie: Movie
}

export default function MovieConfirmationStep({ movie }: Props) {

  const { currentLanguage } = useLanguageStore();

  function getGenreName(genre: Genre) {
    return genre.names.find(g => g.iso_639_1 === currentLanguage.iso_639_1)?.name ?? "";
  }


  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-white mb-6">Xác nhận phim</h2>
      <div className="flex gap-6">
        <Image
          src={movie.posters?.[0]?.url}
          alt={movie.title}
          className="object-cover rounded-lg shadow-lg"
          width={192}
          height={288}
        />
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
              >
                {getGenreName(genre)}
              </span>
            ))}
          </div>
          {movie.overview && (
            <p className="text-gray-400 text-sm leading-relaxed">
              {movie.overview}
            </p>
          )}
          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-baseline gap-2">
              <span className="text-gray-400 text-sm">Giá:</span>
              <span className="text-3xl font-bold text-red-500">
                {movie.price.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}