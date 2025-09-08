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
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TechCardProps {
  name: string;
  description: string;
  icon?: React.ReactNode;
}

interface TechCardData {
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface TechCardSectionProps {
  techCards: TechCardData[];
  title?: string;
  initialDisplayCount?: number;
}

// Individual TechCard component
export function TechCard({ name, description, icon }: TechCardProps) {
  return (
    <motion.div 
      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200"
      whileHover={{ 
        scale: 1.02,
        borderColor: "rgb(156 163 175)",
        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transition: {
          type: "spring" as const,
          stiffness: 400,
          damping: 15
        }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: {
          type: "spring" as const,
          stiffness: 600,
          damping: 30
        }
      }}
    >
      <div className="mb-3">
        {icon ? icon : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
        )}
      </div>
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
}

// TechCard Section component
export default function TechCardSection({ 
  techCards, 
  title = "Things I Use", 
  initialDisplayCount = 6 
}: TechCardSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedTechCards = isExpanded ? techCards : techCards.slice(0, initialDisplayCount);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <section className="mb-16">
      <motion.h2 
        className="text-2xl font-bold mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: "spring" as const,
          stiffness: 200,
          damping: 20
        }}
      >
        {title}
      </motion.h2>
      <motion.div 
        className="grid grid-cols-3 md:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {displayedTechCards.map((tech, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <TechCard
                name={tech.name}
                description={tech.description}
                icon={tech.icon}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {techCards.length > initialDisplayCount && (
        <motion.div 
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            type: "spring" as const,
            stiffness: 100,
            damping: 20,
            delay: 0.5 
          }}
        >
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={isExpanded ? "Show less technologies" : "Show more technologies"}
            whileHover={{ 
              scale: 1.1,
              transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 15
              }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: {
                type: "spring" as const,
                stiffness: 600,
                damping: 30
              }
            }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ 
                type: "spring" as const,
                stiffness: 200,
                damping: 25
              }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </section>
  );
}