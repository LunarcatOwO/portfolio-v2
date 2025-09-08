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
import Footer from "../components/Footer";
import TechCardSection from "../components/TechCard";
import ProjectCard from "../components/ProjectCard";
import ProfilePicture from "../components/ProfilePicture";
import { siGithub, siNodedotjs, siNextdotjs, siDocker, siGit, siTypescript } from "simple-icons";
import { Zap, Coffee } from "lucide-react";
import { motion } from "motion/react";

export default function Page() {
  // Helper function to render Simple Icons
  const SimpleIcon = ({ icon, className }: { icon: { path: string }, className: string }) => (
    <svg className={className} viewBox="0 0 24 24" role="img">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );

  // Tech Cards Data
  const techCards = [
    { name: "Node.js", description: "Most my things are made with this", icon: <SimpleIcon icon={siNodedotjs} className="w-8 h-8 text-green-600" /> },
    { name: "Next.js", description: "Frontend stuff (Don't have much experience yet)", icon: <SimpleIcon icon={siNextdotjs} className="w-8 h-8 text-blue-600" /> },
    { name: "Typescript", description: "Backend stuff (for this site only for now...)", icon: <SimpleIcon icon={siTypescript} className="w-8 h-8 text-blue-600" /> },
    { name: "Docker", description: "Container stuff ig", icon: <SimpleIcon icon={siDocker} className="w-8 h-8 text-blue-500" /> },
    { name: "Java", description: "I don't even know.", icon: <Coffee className="w-8 h-8 text-orange-600" /> },
    { name: "Git", description: "Mostly Github ¯\\_(ツ)_/¯", icon: <SimpleIcon icon={siGit} className="w-8 h-8 text-red-500" /> },
    { name: "Random APIs", description: "Just here for stuff I guess", icon: <Zap className="w-8 h-8 text-purple-500" /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
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
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-background text-foreground">
      <motion.main 
        className="flex-1 max-w-4xl mx-auto px-6 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section className="mb-16" variants={itemVariants}>
          <div className="flex items-start gap-4 sm:gap-6 mb-8">
            <ProfilePicture 
              username="LunarcatOwO" 
              className="w-12 h-12 sm:w-16 sm:h-16"
              fallbackText="L"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold mb-2">LunarcatOwO</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Student Developer
              </p>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed mt-2">
                Just a random student developer who also happens to be techincally a full stack developer lol.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://github.com/LunarcatOwO" className="text-dark-gray-600 hover:text-dark-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors" aria-label="GitHub Profile">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" role="img">
                    <path d={siGithub.path} />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tech Cards */}
        <motion.div variants={itemVariants}>
          <TechCardSection techCards={techCards} />
        </motion.div>

        {/* Featured Work */}
        <motion.section className="mb-16" variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Things I&apos;ve Made</h2>
          </div>
          <div className="space-y-8">
            <ProjectCard
              name="Portfolio V2"
              description="You're looking at it right now. I mean, it's nothing special."
              status="wip"
              technologies={["Next.js", "Tailwind CSS"]}
              link="https://github.com/LunarcatOwO/portfolio-v2"
              repoUrl="https://github.com/LunarcatOwO/portfolio-v2"
            />
          </div>
        </motion.section>

        {/* Latest Posts */}
        <motion.section className="mb-16" variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-8">
            Social Posts
          </h2>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>This is where social media posts should be...</p>
            <p className="text-sm mt-2">But for now, just pretend there&apos;s some sort of content.</p>
          </div>
        </motion.section>
      </motion.main>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring" as const,
          stiffness: 150,
          damping: 25,
          delay: 0.8 
        }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}
