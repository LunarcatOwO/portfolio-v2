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

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import ContributionGraph from '@/components/changelog/ContributionGraph';

interface CommitData {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export default function ChangelogPage() {
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommits() {
      try {
        setLoading(true);
        const response = await fetch('/api/changelog');

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch commits');
        }

        setCommits(data.commits);
        setError(null);
      } catch (err) {
        console.error('Error fetching commits:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch commits'
        );
        setCommits([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCommits();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.15
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
    <motion.main 
      className="min-h-screen p-6 md:p-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold mb-2">Changelog</h1>
          <p className="text-gray-400">
            Project contribution history and commit timeline
          </p>
        </motion.div>

        {loading && (
          <motion.div 
            className="flex items-center justify-center py-12"
            variants={itemVariants}
          >
            <div className="text-gray-400">Loading commits...</div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 text-red-300"
            variants={itemVariants}
          >
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </motion.div>
        )}

        {!loading && !error && commits.length === 0 && (
          <motion.div 
            className="text-center py-12 text-gray-400"
            variants={itemVariants}
          >
            No commits found
          </motion.div>
        )}

        {!loading && !error && commits.length > 0 && (
          <motion.div 
            className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-8 shadow-xl"
            variants={itemVariants}
          >
            <ContributionGraph commits={commits} />
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
