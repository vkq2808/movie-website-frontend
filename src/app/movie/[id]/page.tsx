'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import MovieDetailPage from '@/components/common/MovieDetail/MovieDetailPage'

export default function MoviePage() {
  const params = useParams()
  const movieId = params.id as string

  return <MovieDetailPage movieId={movieId} />
}
