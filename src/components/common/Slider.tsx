'use client'
import React from 'react'
import { ChevronLeftIcon } from 'lucide-react'

interface SliderProps {
  length?: number,
  autoplay?: boolean,
  autoplayInterval?: number,
  children?: React.ReactNode[]
}

const Slider = ({
  length = 5,
  autoplay = true,
  autoplayInterval = 3000,
  children
}: SliderProps) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0)

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % length)
  }
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + length) % length)
  }

  React.useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => {
      clearInterval(interval);
    };
  }, [activeIndex, autoplay, autoplayInterval, children]);


  return (
    <div className="flex justify-center items-center">
      <div className={"relative h-[55vw] w-[99vw]"}>
        <div className="bg-transparent overflow-hidden absolute inset-y-0 inset-x-0 flex items-center justify-center">
          <div className='relative overflow-clip h-[55vw] w-[99vw]'>
            {children ? React.Children.map(children, (child, index) => (
              <div
                className={`absolute transition-transform duration-500 ease-in-out ${index === activeIndex ? 'translate-x-0 z-5' :
                  index > activeIndex ? `translate-x-[100%]` : `translate-x-[-100%]`
                  }`}
                key={index}
              >
                {child}
              </div>
            )) : null}
          </div>
        </div>

        {/* Các nút điều hướng nằm giữa container */}
        <div className="absolute inset-x-0 inset-y-0 flex justify-between items-center z-20">
          <button
            className="bg-gradient-to-r from-slate-900  to-transparent text-slate-900 p-4 rounded-full h-[55vw]"
            onClick={handlePrev}
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
          <button
            className="bg-gradient-to-l from-slate-900  to-transparent text-slate-900 p-4 rounded-full h-[55vw]"
            onClick={handleNext}
          >
            <ChevronLeftIcon className="w-8 h-8 rotate-180" />
          </button>
        </div>
      </div>
    </div >
  )
}

export default Slider
