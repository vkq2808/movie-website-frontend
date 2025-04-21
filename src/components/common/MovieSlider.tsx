'use client'
import React from 'react'
import Slider from './Slider'
import api, { apiEnpoint } from '@/utils/api.util'
import { Movie } from '@/zustand'
import LoadingSpinner from './LoadingSpinner'

const MovieSlider = () => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [movies, setMovies] = React.useState<Movie[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const fetchTop5Movies = async () => {
    try {
      const response = await api.get<Movie[]>(`${apiEnpoint.MOVIE}/slides`)
      if (response.status !== 200) {
        throw new Error('Failed to fetch movies')
      }
      console.log('Fetched movies:', response.data)
      setMovies(response.data)
    } catch (error) {
      setError('Failed to fetch movies')
    } finally {
      setLoading(false)
    }
  }

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
      <Slider
        autoplay={true}
        autoplayInterval={3000}
        length={movies.length}
      >
        {movies.map((movie, index) => (
          <div key={index} className=" flex items-center justify-center">
            <img
              src={movie.backdropUrl?.url}
              alt={movie.title}
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default MovieSlider
