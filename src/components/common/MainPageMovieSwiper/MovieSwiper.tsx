'use client'
import React from 'react'
import Swiper from '../Swiper'
import api, { apiEnpoint } from '@/utils/api.util'
import { Movie } from '@/zustand'
import LoadingSpinner from '../LoadingSpinner'
import { getTop5Movies } from '@/apis/movie.api'
import { head } from 'framer-motion/client'
import MovieHero from './MovieHero'

const MovieSwiper = () => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [movies, setMovies] = React.useState<Movie[]>([])
  const [error, setError] = React.useState<string | null>(null)

  const fetchTop5Movies = React.useCallback(async () => {
    try {
      const top5Movies = await getTop5Movies();
      setMovies(top5Movies)
    } catch (error) {
      setError('Failed to fetch movies')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchTop5Movies()
  }, [])

  if (error) {
    return <div className="text-center">{error}</div>
  }

  if (loading) {
    return <div className="text-center w-full h-full flex justify-center items-center">
      <LoadingSpinner />
    </div>
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <FullScreenSwiper
        autoplay={true}
        autoplayInterval={5000}
        length={movies.length}
        height={'90vh'}
        width={'100vw'}
      >
        {movies.map((movie, index) => (
          // <div key={index} className=" flex items-center justify-center">
          //   <img
          //     src={movie.backdropUrl?.url}
          //     alt={movie.title}
          //     className="object-cover rounded-lg"
          //   />
          // </div>

          <MovieHero
            key={index}
            title={movie.title}
            rating={movie.rating}
            resolution={'HD'}
            year={movie.releasedDate}
            episode={'1'}
            genres={movie.genres.map((genre) => genre.name)}
            description={movie.description}
            backgroundImage={`${movie.backdropUrl?.url}`}
          />
        ))}
      </FullScreenSwiper>
    </div>
  )
}

class FullScreenSwiper extends Swiper {
  static defaultProps = {
    autoplay: false,
    autoplayInterval: 3000,
    length: 5,
    height: '100vh',
    width: '100vw',
    showArrows: false,
  }
}

export default MovieSwiper
