import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Cache interface
interface CacheData {
  commits: CommitData[];
  timestamp: number;
}

interface CommitData {
  hash: string;
  date: string;
  author: string;
  message: string;
}

// In-memory cache
let cache: CacheData | null = null;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

function isCacheValid(): boolean {
  if (!cache) return false;
  const now = Date.now();
  return now - cache.timestamp < CACHE_DURATION;
}

async function getCommitsFromGit(): Promise<CommitData[]> {
  const repoPath = path.resolve(process.cwd());

  // Get all commits with hash, date, author, and message
  const { stdout } = await execAsync(
    'git log --pretty=format:"%H|||%aI|||%an|||%s" --date=iso',
    {
      cwd: repoPath,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    }
  );

  // Parse the git log output
  const commits = stdout
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const [hash, date, author, message] = line.split('|||');
      return {
        hash: hash || '',
        date: date || new Date().toISOString(),
        author: author || 'Unknown',
        message: message || '',
      };
    })
    .filter((commit) => commit.hash); // Remove any empty entries

  return commits;
}

export async function GET() {
  try {
    // Return cached data if valid
    if (isCacheValid() && cache) {
      return Response.json({
        success: true,
        commits: cache.commits,
        total: cache.commits.length,
        cached: true,
        cacheAge: Date.now() - cache.timestamp,
      });
    }

    // Fetch fresh commits
    const commits = await getCommitsFromGit();

    // Update cache
    cache = {
      commits,
      timestamp: Date.now(),
    };

    return Response.json({
      success: true,
      commits,
      total: commits.length,
      cached: false,
    });
  } catch (error) {
    console.error('Failed to fetch commits:', error);

    // Return stale cache if available
    if (cache) {
      return Response.json(
        {
          success: true,
          commits: cache.commits,
          total: cache.commits.length,
          cached: true,
          stale: true,
          error: 'Using stale cache due to error',
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
