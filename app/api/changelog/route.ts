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

    // Fetch fresh commits from GitHub API
    const commits = await getCommitsFromGitHub();

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
