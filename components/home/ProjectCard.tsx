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
import ProjectIcon from './ProjectIcon';
import { motion } from 'motion/react';

interface ProjectCardProps {
  name: string;
  description: string;
  status: string;
  technologies: string[];
  link: string;
  icon?: React.ReactNode;
  repoUrl?: string;
}

export default function ProjectCard({ name, description, status, technologies, link, icon, repoUrl }: ProjectCardProps) {
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

  // Animation variants for orchestrated stagger timing
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 25,
        when: "beforeChildren" as const,
        delayChildren: 0.3,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <motion.div 
      className="border border-gray-700 rounded-lg p-6"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ 
        scale: 1.02,
        borderColor: "rgb(156 163 175)",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 20
        }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: {
          type: "spring" as const,
          stiffness: 400,
          damping: 30
        }
      }}
    >
      {/* Responsive layout: stack on mobile, row on larger screens */}
      <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-start" variants={itemVariants}>
        <motion.div
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            transition: {
              type: "spring" as const,
              stiffness: 400,
              damping: 15
            }
          }}
        >
          {icon ? (
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              {icon}
            </div>
          ) : (
            <ProjectIcon 
              repoUrl={repoUrl} 
              projectName={name} 
              className="w-12 h-12"
            />
          )}
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold mb-2">
            {name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-300 mb-4">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span 
                key={tech} 
                className="px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded hover:scale-105 transition-transform duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        {/* CTA button goes full-width on mobile to avoid squish */}
        <motion.div variants={itemVariants} className="sm:self-start">
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 group"
          >
            View Project
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}