'use client'
import React, { Component } from 'react';
import { ChevronLeftIcon } from 'lucide-react';

interface SwiperProps {
  length?: number;
  autoplay?: boolean;
  autoplayInterval?: number | number[];
  children?: React.ReactNode[];
  height?: number | string;
  width?: number | string;
  showArrows?: boolean;
}

interface SwiperState {
  activeIndex: number;
}

class Swiper extends Component<SwiperProps, SwiperState> {
  static defaultProps = {
    length: 5,
    autoplay: true,
    autoplayInterval: 3000,
    height: '100%',
    width: '100%',
    showArrows: true,
  };

  intervalId: NodeJS.Timeout | null = null;

  constructor(props: SwiperProps) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  componentDidMount() {
    this.setupAutoplay();
  }

  componentDidUpdate(prevProps: SwiperProps, prevState: SwiperState) {
    if (
      prevState.activeIndex !== this.state.activeIndex ||
      prevProps.autoplay !== this.props.autoplay ||
      prevProps.autoplayInterval !== this.props.autoplayInterval
    ) {
      this.clearAutoplay();
      this.setupAutoplay();
    }
  }

  componentWillUnmount() {
    this.clearAutoplay();
  }

  setupAutoplay = () => {
    const { autoplay, autoplayInterval } = this.props;

    if (!autoplay) return;

    let intervalTime = 3000;
    if (Array.isArray(autoplayInterval)) {
      intervalTime = autoplayInterval[this.state.activeIndex] || 3000;
    } else {
      intervalTime = autoplayInterval as number;
    }

    this.intervalId = setInterval(() => {
      this.handleNext();
    }, intervalTime);
  };

  clearAutoplay = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  };

  handleNext = () => {
    const { length = 5 } = this.props;
    this.setState((prevState) => ({
      activeIndex: (prevState.activeIndex + 1) % length,
    }));
  };

  handlePrev = () => {
    const { length = 5 } = this.props;
    this.setState((prevState) => ({
      activeIndex: (prevState.activeIndex - 1 + length) % length,
    }));
  };

  render() {
    const { children } = this.props;
    const { activeIndex } = this.state;

    return (
      <div className="flex w-full justify-center items-center">
        <div className="relative" style={{ height: this.props.height, width: this.props.width }}>
          <div className="bg-transparent overflow-hidden absolute inset-y-0 inset-x-0 flex items-center justify-center">
            <div className="relative overflow-clip" style={{ height: this.props.height, width: this.props.width }}>
              {children &&
                React.Children.map(children, (child, index) => (
                  <div
                    key={index}
                    className={`absolute transition-transform duration-500 ease-in-out`}
                    style={{
                      transform: `translateX(${(index - activeIndex) * 100}%)`,
                      opacity: index === activeIndex ? 1 : 0.5,
                      width: this.props.width,
                      height: this.props.height,
                    }}
                  >
                    {child}
                  </div>
                ))}
            </div>
          </div>

          {this.props.showArrows && (
            <>
              <button
                className="bg-gradient-to-r from-slate-900 to-transparent text-slate-900 p-4 z-5"
                style={{ left: '0', height: '100%' }}
                onClick={this.handlePrev}
              >
                <ChevronLeftIcon className="w-8 h-8" />
              </button>
              <button
                className="bg-gradient-to-l from-slate-900 to-transparent text-slate-900 p-4 right-0 absolute z-5"
                style={{ right: '0', height: '100%' }}
                onClick={this.handleNext}
              >
                <ChevronLeftIcon className="w-8 h-8 rotate-180" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Swiper;