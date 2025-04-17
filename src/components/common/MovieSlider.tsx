'use client'
import React from 'react'
import Slider from './Slider'
import api from '@/utils/api.util'
import { Movie } from '@/zustand/user.store'
import { motion } from 'framer-motion'

const MovieSlider = () => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [movies, setMovies] = React.useState<Movie[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const fetchTop5Movies = async () => {
    try {
      const response = await api.get<Movie[]>('/movie/slides')
      if (response.status !== 200) {
        throw new Error('Failed to fetch movies')
      }
      console.log('response.data', response.data)
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
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Slider
        height={400}
        slideWidth={450}
        autoplay={true}
        autoplayInterval={3000}
        length={movies.length}
      >
        {movies.map((movie, index) => (
          <div key={index} className="w-full h-full flex items-center justify-center">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default MovieSlider
