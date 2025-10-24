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

import { changelogCache } from '@/utils/cache';

interface CommitData {
  hash: string;
  date: string;
  author: string;
  message: string;
}

const CACHE_KEY = 'changelog:commits';

async function getCommitsFromGitHub(): Promise<CommitData[]> {
  const owner = 'LunarcatOwO';
  const repo = 'portfolio-v2';
  
  // GitHub API endpoint for commits
  // Per-page max is 100, we'll paginate through all commits
  const commits: CommitData[] = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-v2',
        // Optional: Add token if rate limiting becomes an issue
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json() as Array<{
      sha: string;
      commit: {
        author: {
          name: string;
          date: string;
        };
        message: string;
      };
    }>;

    if (data.length === 0) {
      hasMore = false;
      break;
    }

    // Transform GitHub API response to our format
    data.forEach((item) => {
      commits.push({
        hash: item.sha,
        date: item.commit.author.date,
        author: item.commit.author.name,
        message: item.commit.message.split('\n')[0], // Use first line only
      });
    });

    // Check if there are more pages
    if (data.length < 100) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return commits;
}

export async function GET() {
  try {
    // Check the changelog cache first
    const cachedData = changelogCache.get(CACHE_KEY);
    if (cachedData) {
      return Response.json({
        success: true,
        commits: cachedData.commits,
        total: cachedData.commits.length,
        cached: true,
      });
    }

    // Fetch fresh commits from GitHub API
    const commits = await getCommitsFromGitHub();

    // Store in cache
    changelogCache.set(CACHE_KEY, {
      commits,
    });

    return Response.json({
      success: true,
      commits,
      total: commits.length,
      cached: false,
    });
  } catch (error) {
    console.error('Failed to fetch commits:', error);

    // Try to return cached data if available
    const cachedData = changelogCache.get(CACHE_KEY);
    if (cachedData) {
      return Response.json(
        {
          success: true,
          commits: cachedData.commits,
          total: cachedData.commits.length,
          cached: true,
          stale: true,
          error: 'Using cached data due to error',
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: false,
        error: 'Failed to fetch commits',
      },
      { status: 500 }
    );
  }
}
