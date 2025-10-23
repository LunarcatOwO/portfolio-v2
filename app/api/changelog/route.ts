import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function GET() {
  try {
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

    return Response.json({
      success: true,
      commits,
      total: commits.length,
    });
  } catch (error) {
    console.error('Failed to fetch commits:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch commits',
      },
      { status: 500 }
    );
  }
}
