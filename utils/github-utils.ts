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

/**
 * Extracts owner and repository name from a GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 2) {
      return {
        owner: pathParts[0],
        repo: pathParts[1]
      };
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if a project-icon file exists in the repository
 * Returns the URL to the icon if found, null otherwise
 */
export async function getProjectIcon(repoUrl: string): Promise<string | null> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    return null;
  }

  const { owner, repo } = parsed;
  
  // Common icon extensions to check
  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'ico', 'webp', 'avif'];
  
  for (const ext of extensions) {
    try {
      const iconUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/project-icon.${ext}`;
      
      // Check if the file exists by making a HEAD request
      const response = await fetch(iconUrl, { method: 'HEAD' });
      
      if (response.ok) {
        return iconUrl;
      }
    } catch {
      // Continue to next extension
    }
  }

  // Also check master branch (some repos use master instead of main)
  for (const ext of extensions) {
    try {
      const iconUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/project-icon.${ext}`;
      
      const response = await fetch(iconUrl, { method: 'HEAD' });
      
      if (response.ok) {
        return iconUrl;
      }
    } catch {
      // Continue to next extension
    }
  }

  return null;
}