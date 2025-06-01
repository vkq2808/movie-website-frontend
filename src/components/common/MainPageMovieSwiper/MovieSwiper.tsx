'use client'
import React from 'react'
import Swiper from '../Swiper'
import { Movie } from '@/zustand'
import LoadingSpinner from '../LoadingSpinner'
import { getTop5Movies } from '@/apis/movie.api'
import MovieHero from './MovieHero'
import { useGlobalStore } from '@/zustand/global.store'

const MovieSwiper = () => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [movies, setMovies] = React.useState<Movie[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const setGlobalLoading = useGlobalStore((state) => state.setLoading);

  const fetchTop5Movies = React.useCallback(async () => {
    try {
      setGlobalLoading(true);
      const top5Movies = await getTop5Movies();
      setMovies(top5Movies)
      console.log('Top 5 Movies:', top5Movies)
    } catch (error) {
      setError('Failed to fetch movies')
    } finally {
      setLoading(false)
      setGlobalLoading(false);
    }
  }, [setGlobalLoading])

  React.useEffect(() => {
    fetchTop5Movies()
  }, [fetchTop5Movies])
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
      <CustomSwiper
        autoplay={true}
        autoplayInterval={5000}
        length={movies.length}
      >
        {movies.map((movie, index) => (

          <MovieHero
            key={movie.id}
            title={movie.title}
            rating={movie.rating}
            resolution={'HD'}
            year={movie.releasedDate}
            episode={'1'}
            genres={movie.genres.map((genre) => genre.name)}
            description={movie.description}
            backgroundImage={`${movie.backdrop?.url}`}
          />
        ))}
      </CustomSwiper>
    </div>
  )
}

class CustomSwiper extends Swiper {
  static defaultProps = {
    autoplay: false,
    autoplayInterval: 3000,
    length: 5,
    height: '80vh',
    width: '100vw',
    showArrows: false
  }
}

export default MovieSwiper
