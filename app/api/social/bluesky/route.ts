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
  const handle = searchParams.get('handle') || 'lunarcatowo.space';
  const limit = parseInt(searchParams.get('limit') || '5');

  try {
    // Resolve the handle to a DID
    const resolveResponse = await fetch(
      `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`
    );
    
    if (!resolveResponse.ok) {
      throw new Error('Failed to resolve Bluesky handle');
    }

    const { did } = await resolveResponse.json();

    // Fetch the user's feed
    const feedResponse = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${did}&limit=${limit}`
    );

    if (!feedResponse.ok) {
      throw new Error('Failed to fetch Bluesky feed');
    }

    const feedData = await feedResponse.json();

    // Transform the data to our format
    const posts = feedData.feed.map((item: any) => ({
      id: item.post.uri,
      platform: 'bluesky',
      author: {
        username: item.post.author.handle,
        displayName: item.post.author.displayName || item.post.author.handle,
        avatar: item.post.author.avatar
      },
      content: item.post.record.text,
      timestamp: new Date(item.post.record.createdAt),
      url: `https://bsky.app/profile/${item.post.author.handle}/post/${item.post.uri.split('/').pop()}`,
      metrics: {
        likes: item.post.likeCount || 0,
        reposts: item.post.repostCount || 0,
        replies: item.post.replyCount || 0
      }
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Bluesky API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Bluesky posts' },
      { status: 500 }
    );
  }
}
