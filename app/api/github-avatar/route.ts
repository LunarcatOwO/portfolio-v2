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
import { avatarCache } from '../../../utils/cache';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const cacheKey = `avatar:${username}`;

  try {
    // Check server-side cache first
    const cachedData = avatarCache.get(cacheKey);
    if (cachedData) {
      return new NextResponse(Buffer.from(cachedData.buffer), {
        headers: {
          'Content-Type': cachedData.contentType,
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'X-Cache': 'HIT',
        },
      });
    }

    // Fetch user data from GitHub API
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'portfolio-app',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: response.status });
    }

    const userData = await response.json();
    const avatarUrl = userData.avatar_url;

    if (!avatarUrl) {
      return NextResponse.json({ error: 'Avatar not found' }, { status: 404 });
    }

    // Fetch the actual image
    const imageResponse = await fetch(avatarUrl);
    
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch avatar image' }, { status: imageResponse.status });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Store in server cache for 1 hour
    avatarCache.set(cacheKey, {
      buffer: imageBuffer,
      contentType,
    }, 60 * 60 * 1000); // 1 hour

    // Return the image with caching headers (1 hour cache)
    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error fetching GitHub avatar:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}