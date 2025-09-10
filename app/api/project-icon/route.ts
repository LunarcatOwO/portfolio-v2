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

import { NextRequest, NextResponse } from 'next/server';
import { parseGitHubUrl } from '../../../utils/github-utils';
import { projectIconCache } from '../../../utils/cache';

// Helper function to get repository metadata including default branch
async function getRepositoryMetadata(owner: string, repo: string): Promise<{ defaultBranch: string } | null> {
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-v2'
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return {
      defaultBranch: data.default_branch
    };
  } catch (error) {
    console.error('Error fetching repository metadata:', error);
    return null;
  }
}

// Function to generate a fallback SVG icon
function generateFallbackIcon(projectName: string): string {
  const letter = projectName.charAt(0).toUpperCase();
  const svgContent = `
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="8" fill="url(#grad)"/>
      <text x="32" y="42" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="white">${letter}</text>
    </svg>
  `.trim();
  
  return svgContent;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get('repoUrl');

  if (!repoUrl) {
    return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
  }

  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
  }

  const { owner, repo } = parsed;
  const cacheKey = `project-icon:${owner}/${repo}`;

  try {
    // Check server-side cache first
    const cachedData = projectIconCache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for project icon: ${owner}/${repo}`);
      return new NextResponse(cachedData.buffer, {
        headers: {
          'Content-Type': cachedData.contentType,
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'X-Project-Icon': cachedData.isReal ? 'real' : 'fallback',
          'X-Cache': 'HIT',
        },
      });
    }

    console.log(`Cache miss for project icon: ${owner}/${repo}, searching for icon...`);

    // Common icon extensions to check
    const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'ico', 'avif'];
    
    // Get the repository's default branch
    const repoMetadata = await getRepositoryMetadata(owner, repo);
    const branches = repoMetadata ? [repoMetadata.defaultBranch] : ['main', 'master']; // fallback to common branches if API fails

    async function findRealIcon(): Promise<{ url: string; contentType: string } | null> {
      for (const branch of branches) {
        for (const ext of extensions) {
          const iconUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/project-icon.${ext}`;
          try {
            const response = await fetch(iconUrl, { method: 'HEAD' });
            if (response.ok) {
              const contentType = response.headers.get('content-type') || `image/${ext}`;
              return { url: iconUrl, contentType };
            }
          } catch {
            // Try next option
            continue;
          }
        }
      }
      return null;
    }

    const found = await findRealIcon();
    if (found) {
      const imageResponse = await fetch(found.url);
      if (imageResponse.ok) {
        const imageBuffer = await imageResponse.arrayBuffer();
        const contentType = imageResponse.headers.get('content-type') || found.contentType;
        
        // Cache the real icon
        projectIconCache.set(cacheKey, {
          buffer: imageBuffer,
          contentType,
          isReal: true,
        }, 60 * 60 * 1000); // 1 hour

        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            'X-Project-Icon': 'real',
            'X-Cache': 'MISS',
          },
        });
      }
    }

    // No icon found, generate and return fallback SVG
    const fallbackSvg = generateFallbackIcon(repo);
    
    // Cache the fallback icon
    projectIconCache.set(cacheKey, {
      buffer: fallbackSvg,
      contentType: 'image/svg+xml',
      isReal: false,
    }, 60 * 60 * 1000); // 1 hour

    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Project-Icon': 'fallback',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error fetching project icon:', error);
    const fallbackSvg = generateFallbackIcon(repo);
    
    // Cache the fallback icon even on error
    projectIconCache.set(cacheKey, {
      buffer: fallbackSvg,
      contentType: 'image/svg+xml',
      isReal: false,
    }, 60 * 60 * 1000); // 1 hour

    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Project-Icon': 'fallback',
        'X-Cache': 'MISS',
      },
    });
  }
}

// Lightweight HEAD handler so clients can check whether the icon is real or fallback
export async function HEAD(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get('repoUrl');

  if (!repoUrl) {
    return new NextResponse(null, { status: 400 });
  }

  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    return new NextResponse(null, { status: 400 });
  }

  const { owner, repo } = parsed;
  const cacheKey = `project-icon:${owner}/${repo}`;

  // Check cache first for HEAD requests too
  const cachedData = projectIconCache.get(cacheKey);
  if (cachedData) {
    return new NextResponse(null, {
      headers: {
        'Content-Type': cachedData.contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Project-Icon': cachedData.isReal ? 'real' : 'fallback',
        'X-Cache': 'HIT',
      },
    });
  }

  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'ico', 'avif'];
  
  // Get the repository's default branch
  const repoMetadata = await getRepositoryMetadata(owner, repo);
  const branches = repoMetadata ? [repoMetadata.defaultBranch] : ['main', 'master']; // fallback to common branches if API fails

  for (const branch of branches) {
    for (const ext of extensions) {
      const iconUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/project-icon.${ext}`;
      try {
        const response = await fetch(iconUrl, { method: 'HEAD' });
        if (response.ok) {
          const contentType = response.headers.get('content-type') || `image/${ext}`;
          return new NextResponse(null, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=3600, s-maxage=3600',
              'X-Project-Icon': 'real',
              'X-Cache': 'MISS',
            },
          });
        }
      } catch {
        continue;
      }
    }
  }

  // Fallback indicator
  return new NextResponse(null, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Project-Icon': 'fallback',
      'X-Cache': 'MISS',
    },
  });
}