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
  
  // Common icon extensions to check
  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'];
  const branches = ['main', 'master'];
  
  try {
    // Try to find project icon in different branches and extensions
    for (const branch of branches) {
      for (const ext of extensions) {
        const iconUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/project-icon.${ext}`;
        
        try {
          const response = await fetch(iconUrl, { method: 'HEAD' });
          
          if (response.ok) {
            // Found the icon, now fetch it
            const imageResponse = await fetch(iconUrl);
            
            if (imageResponse.ok) {
              const imageBuffer = await imageResponse.arrayBuffer();
              const contentType = imageResponse.headers.get('content-type') || `image/${ext}`;

              // Return the image with caching headers (1 hour cache)
              return new NextResponse(imageBuffer, {
                headers: {
                  'Content-Type': contentType,
                  'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                },
              });
            }
          }
        } catch {
          // Continue to next extension/branch
          continue;
        }
      }
    }

    // No icon found, generate and return fallback SVG
    const fallbackSvg = generateFallbackIcon(repo);
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching project icon:', error);
    
    // Even on error, return fallback icon instead of error response
    const fallbackSvg = generateFallbackIcon(repo);
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}