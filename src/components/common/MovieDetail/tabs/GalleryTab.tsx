'use client'
import React, { useState } from 'react'
import { Movie } from '@/zustand'
import { X } from 'lucide-react'

interface GalleryTabProps {
  movie: Movie
}

const GalleryTab: React.FC<GalleryTabProps> = ({ movie }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Create a gallery array from movie images
  const galleryImages = [
    movie.poster,
    movie.backdrop,
    // Add more images if available in your data structure
  ].filter(Boolean)

  const handlePressEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    // Add event listener for Escape key
    document.addEventListener('keydown', handlePressEscape)
  }

  const closeModal = () => {
    setSelectedImage(null)
    // Remove event listener for Escape key
    document.removeEventListener('keydown', handlePressEscape)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>

      {galleryImages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 justify-center items-center flex"
              onClick={() => openModal(image.url)}
            >
              <img
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="max-w-full max-h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black opacity-20 hover:bg-opacity-20 transition-all duration-200" />
            </div>
          ))}

          {/* Additional placeholder images for demo */}
          {Array.from({ length: 6 - galleryImages.length }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center"
            >
              <span className="text-gray-500">No image available</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-600 mb-4">🖼</div>
          <p className="text-gray-400 text-lg">No gallery images available</p>
        </div>
      )}

      {/* Screenshots Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Screenshots</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Demo screenshots - replace with actual data */}
          {movie.backdrop && (
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={movie.backdrop.url}
                alt="Screenshot"
                className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={() => openModal(movie.backdrop.url)}
              />
            </div>
          )}

          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`screenshot-${index}`}
              className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center"
            >
              <span className="text-gray-500 text-xs">Screenshot {index + 2}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posters Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Posters</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {movie.poster && (
            <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={movie.poster.url}
                alt="Movie poster"
                className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={() => openModal(movie.poster.url)}
              />
            </div>
          )}

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`poster-${index}`}
              className="aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center"
            >
              <span className="text-gray-500 text-xs text-center">Poster {index + 2}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-screen max-h-screen object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryTab
