'use client'
import React from 'react'
import { useLanguageStore } from '@/zustand'

interface FilterOption {
  id: string
  label: string
}

interface SearchFilterProps {
  title: string
  options: FilterOption[]
  activeValue: string
  onChange: (value: string) => void
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  title,
  options,
  activeValue,
  onChange
}) => {
  const titleId = `filter-${title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`

  return (
    <div className="flex flex-wrap gap-3 items-center" role="group" aria-labelledby={titleId}>
      <span id={titleId} className="font-semibold min-w-20">{title}</span>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (<button
          key={option.id}
          onClick={() => onChange(option.id)}
          onKeyDown={(e) => {
            // Handle keyboard navigation (left/right arrow keys)
            if (e.key === 'ArrowRight') {
              const nextButton = e.currentTarget.nextElementSibling as HTMLButtonElement;
              if (nextButton) nextButton.focus();
            } else if (e.key === 'ArrowLeft') {
              const prevButton = e.currentTarget.previousElementSibling as HTMLButtonElement;
              if (prevButton) prevButton.focus();
            }
          }}
          className={`px-3 py-1 rounded-lg text-sm ${activeValue === option.id
              ? 'bg-yellow-500 text-black font-semibold'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          aria-pressed={activeValue === option.id}
          aria-label={`${title} ${option.label}`}
        >
          {option.label}
        </button>
        ))}
      </div>
    </div>
  )
}

export default SearchFilter
