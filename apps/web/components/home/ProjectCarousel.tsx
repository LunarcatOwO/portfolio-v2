// Portfolio Of LunarcatOwO
// Copyright (C) 2025  LunarcatOwO

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

"use client";
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectIcon from './ProjectIcon';

interface Project {
  name: string;
  description: string;
  status: string;
  technologies: string[];
  link: string;
  icon?: React.ReactNode;
  repoUrl?: string;
}

interface ProjectCarouselProps {
  projects: Project[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Measure all project cards to find max height
  useEffect(() => {
    const measureCards = () => {
      if (!measureRef.current) return;
      
      const cards = measureRef.current.querySelectorAll('[data-measure-card]');
      let max = 0;
      cards.forEach((card) => {
        const height = (card as HTMLElement).offsetHeight;
        if (height > max) max = height;
      });
      
      if (max > 0) {
        setMaxHeight(max);
      }
    };

    // Measure after render and on resize
    measureCards();
    window.addEventListener('resize', measureCards);
    
    // Re-measure after fonts load
    document.fonts?.ready?.then(measureCards);

    return () => window.removeEventListener('resize', measureCards);
  }, [projects]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'currently in active development':
        return 'bg-green-900 text-green-200';
      case 'completed':
        return 'bg-blue-900 text-blue-200';
      case 'in development':
        return 'bg-yellow-900 text-yellow-200';
      case 'wip':
        return 'bg-purple-900 text-purple-200';
      default:
        return 'bg-gray-800 text-gray-200';
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = projects.length - 1;
      if (nextIndex >= projects.length) nextIndex = 0;
      return nextIndex;
    });
  }, [projects.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const currentProject = projects[currentIndex];

  return (
    <div className="relative">
      {/* Hidden measurement container - renders all cards to measure max height */}
      <div 
        ref={measureRef} 
        className="absolute opacity-0 pointer-events-none -z-10"
        aria-hidden="true"
      >
        {projects.map((project, index) => (
          <div key={index} data-measure-card className="border border-gray-700 rounded-lg p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="w-12 h-12" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 text-xs rounded">{project.status}</span>
                </div>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sm:self-start">
                <span className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2">
                  View Project →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Container */}
      <div 
        className="relative overflow-hidden mb-4 transition-[height] duration-300"
        style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 400, damping: 25 },
              opacity: { duration: 0.15 },
              scale: { duration: 0.15 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            <motion.div 
              className="border border-gray-700 rounded-lg p-6 bg-gray-900/50 backdrop-blur-sm"
              whileHover={{ 
                borderColor: "rgb(156 163 175)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <motion.div
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 15
                    }
                  }}
                >
                  {currentProject.icon ? (
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {currentProject.icon}
                    </div>
                  ) : (
                    <ProjectIcon 
                      repoUrl={currentProject.repoUrl} 
                      projectName={currentProject.name} 
                      className="w-12 h-12"
                    />
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold mb-2">
                    {currentProject.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(currentProject.status)}`}>
                      {currentProject.status}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {currentProject.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.technologies.map((tech) => (
                      <motion.span 
                        key={tech} 
                        className="px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div className="sm:self-start">
                  <a 
                    href={currentProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 group"
                  >
                    View Project
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => paginate(-1)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Dot indicators */}
        <div className="flex gap-2 flex-1 justify-center">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Next project"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Project counter */}
      <div className="text-center text-sm text-gray-500 mt-3">
        {currentIndex + 1} / {projects.length}
      </div>

      {/* Keyboard hint */}
      <div className="text-center text-xs text-gray-600 mt-2">
        Swipe or use arrows to navigate
      </div>
    </div>
  );
}
