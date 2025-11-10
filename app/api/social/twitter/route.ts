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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username') || 'LunarcatOwO';
  const limit = parseInt(searchParams.get('limit') || '5');

  // X (Twitter) API v2 requires authentication
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    return NextResponse.json(
      { error: 'Twitter API token not configured' },
      { status: 500 }
    );
  }

  try {
    // First, get the user ID from username
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Twitter user');
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Fetch the user's tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=${limit}&tweet.fields=created_at,public_metrics&expansions=author_id&user.fields=name,username,profile_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      }
    );

    if (!tweetsResponse.ok) {
      throw new Error('Failed to fetch tweets');
    }

    const tweetsData = await tweetsResponse.json();

    // Transform the data to our format
    const posts = tweetsData.data?.map((tweet: any) => {
      const author = tweetsData.includes?.users?.find((u: any) => u.id === tweet.author_id);
      return {
        id: tweet.id,
        platform: 'twitter',
        author: {
          username: author?.username || username,
          displayName: author?.name || username,
          avatar: author?.profile_image_url
        },
        content: tweet.text,
        timestamp: new Date(tweet.created_at),
        url: `https://x.com/${author?.username || username}/status/${tweet.id}`,
        metrics: {
          likes: tweet.public_metrics?.like_count || 0,
          reposts: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0
        }
      };
    }) || [];

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Twitter API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Twitter posts' },
      { status: 500 }
    );
  }
}
