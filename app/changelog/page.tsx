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

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Changelog</h1>
          <p className="text-gray-400">
            Project contribution history and commit timeline
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading commits...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 text-red-300">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && commits.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No commits found
          </div>
        )}

        {!loading && !error && commits.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg border border-gray-700 p-8">
            <ContributionGraph commits={commits} />
          </div>
        )}
      </div>
    </main>
  );
}
