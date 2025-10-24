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

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';

interface CommitData {
  hash: string;
  message: string;
  author: string;
  date: string;
}

interface DayCommits {
  [key: string]: CommitData[];
}

interface ContributionGraphProps {
  commits: CommitData[];
}

// Helper functions for date manipulation
function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const monthName = date.toLocaleString('default', { month: 'long' });
  const dayNum = String(date.getDate()).padStart(2, '0');

  if (format === 'YYYY-MM-DD') return `${year}-${month}-${dayNum}`;
  if (format === 'MMM DD, YYYY') return `${monthName.slice(0, 3)} ${dayNum}, ${year}`;
  if (format === 'MMMM DD, YYYY') return `${monthName} ${dayNum}, ${year}`;
  return date.toString();
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function ContributionGraph({ commits }: ContributionGraphProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null);

  // Group commits by date
  const commitsByDate = useMemo(() => {
    const grouped: DayCommits = {};

    commits.forEach((commit) => {
      const date = commit.date.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(commit);
    });

    return grouped;
  }, [commits]);

  // Get the date range (last 52 weeks)
  const today = new Date();
  const startDate = getStartOfWeek(addDays(today, -52 * 7));
  const endDate = addDays(getStartOfWeek(today), 6);

  // Generate all dates in range
  const allDates = useMemo(() => {
    const dates: Date[] = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      dates.push(new Date(current));
      current = addDays(current, 1);
    }

    return dates;
  }, [startDate, endDate]);

  // Get max commits in a day for color intensity
  const maxCommits = Math.max(
    ...Object.values(commitsByDate).map((c) => c.length),
    1
  );

  // Get color based on commit count - Pink theme matching website
  const getColor = (count: number): string => {
    if (count === 0) return 'bg-slate-800 hover:bg-slate-700';

    const intensity = Math.min(count / maxCommits, 1);
    // Pink gradient matching website theme (Navbar uses pink-400)
    if (intensity < 0.25) return 'bg-pink-900 hover:bg-pink-800';
    if (intensity < 0.5) return 'bg-pink-700 hover:bg-pink-600';
    if (intensity < 0.75) return 'bg-pink-600 hover:bg-pink-500';
    return 'bg-pink-500 hover:bg-pink-400';
  };

  // Get weeks for display
  const weeks = useMemo(() => {
    const weeksArray: Date[][] = [];
    for (let i = 0; i < allDates.length; i += 7) {
      weeksArray.push(allDates.slice(i, i + 7));
    }
    return weeksArray;
  }, [allDates]);

  // Auto-select the latest day with commits on initial load
  useEffect(() => {
    if (selectedDate === null && Object.keys(commitsByDate).length > 0) {
      // Get all dates with commits, sorted in descending order
      const datesWithCommits = Object.keys(commitsByDate).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );
      
      if (datesWithCommits.length > 0) {
        setSelectedDate(datesWithCommits[0]);
      }
    }
  }, [commitsByDate, selectedDate]);

  const selectedDateCommits = selectedDate ? commitsByDate[selectedDate] : null;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contribution History</h2>
        <div className="text-sm text-gray-400">
          {Object.values(commitsByDate).flat().length} commits in the last year
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-block min-w-full">
          {/* Graph */}
          <div className="flex gap-1">
            {/* Week columns */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day) => {
                    const dateStr = formatDate(day, 'YYYY-MM-DD');
                    const dayCommits = commitsByDate[dateStr] || [];
                    const count = dayCommits.length;
                    const isSelected = selectedDate === dateStr;

                    return (
                      <motion.button
                        key={dateStr}
                        onClick={() =>
                          setSelectedDate(
                            selectedDate === dateStr ? null : dateStr
                          )
                        }
                        onMouseEnter={(e) => {
                          setHoveredDate(dateStr);
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
                        }}
                        onMouseLeave={() => {
                          setHoveredDate(null);
                          setHoveredPosition(null);
                        }}
                        className={`w-3 h-3 rounded-sm transition-all cursor-pointer border ${
                          isSelected 
                            ? 'border-pink-400 ring-2 ring-pink-400/50' 
                            : 'border-transparent hover:border-gray-400'
                        } ${getColor(count)}`}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDate && hoveredPosition && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${hoveredPosition.x}px`,
            top: `${hoveredPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl text-sm whitespace-nowrap"
          >
            <div className="text-gray-200 font-medium">
              {commitsByDate[hoveredDate]?.length || 0} commit{commitsByDate[hoveredDate]?.length !== 1 ? 's' : ''}
            </div>
            <div className="text-gray-400 text-xs">
              {formatDate(new Date(hoveredDate), 'MMM DD, YYYY')}
            </div>
          </motion.div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-slate-800 rounded-sm" />
          <div className="w-3 h-3 bg-pink-900 rounded-sm" />
          <div className="w-3 h-3 bg-pink-700 rounded-sm" />
          <div className="w-3 h-3 bg-pink-600 rounded-sm" />
          <div className="w-3 h-3 bg-pink-500 rounded-sm" />
        </div>
        <span>More</span>
      </div>

      {/* Selected Date Commits */}
      {selectedDateCommits && (
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-xl font-semibold mb-4">
            Commits on {formatDate(new Date(selectedDate!), 'MMMM DD, YYYY')}
          </h3>
          <div className="space-y-3">
            {selectedDateCommits.map((commit) => (
              <div
                key={commit.hash}
                className="p-4 bg-slate-800/50 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-gray-400 truncate">
                      {commit.hash.substring(0, 7)}
                    </p>
                    <p className="text-gray-100 break-words">{commit.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{commit.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
