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

"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { siX, siBluesky } from 'simple-icons';
import { ExternalLink, MessageCircle, Heart, Repeat2, Clock } from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'bluesky';
  author: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  url: string;
  metrics?: {
    likes?: number;
    reposts?: number;
    replies?: number;
  };
}

interface SocialFeedProps {
  twitterUsername?: string;
  blueskyHandle?: string;
  maxPosts?: number;
}

export default function SocialFeed({ 
  twitterUsername = 'LunarcatOwO', 
  blueskyHandle = 'lunarcatowo.space',
  maxPosts = 5 
}: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'twitter' | 'bluesky'>('all');

  useEffect(() => {
    fetchSocialPosts();
  }, [twitterUsername, blueskyHandle]);

  const fetchSocialPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allPosts: SocialPost[] = [];

      // Fetch Bluesky posts
      try {
        const blueskyResponse = await fetch(`/api/social/bluesky?handle=${blueskyHandle}&limit=${maxPosts}`);
        if (blueskyResponse.ok) {
          const blueskyData = await blueskyResponse.json();
          allPosts.push(...blueskyData.posts);
        }
      } catch (err) {
        console.error('Failed to fetch Bluesky posts:', err);
      }

      // Fetch Twitter posts
      try {
        const twitterResponse = await fetch(`/api/social/twitter?username=${twitterUsername}&limit=${maxPosts}`);
        if (twitterResponse.ok) {
          const twitterData = await twitterResponse.json();
          allPosts.push(...twitterData.posts);
        }
      } catch (err) {
        console.error('Failed to fetch Twitter posts:', err);
      }

      if (allPosts.length === 0) {
        throw new Error('No posts could be loaded');
      }

      // Sort posts by timestamp (newest first) and ensure timestamps are Date objects
      allPosts.forEach(post => {
        if (!(post.timestamp instanceof Date)) {
          post.timestamp = new Date(post.timestamp);
        }
      });
      allPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setPosts(allPosts);
    } catch (err) {
      setError('Failed to load social posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const SimpleIcon = ({ icon, className }: { icon: { path: string }, className: string }) => (
    <svg className={className} viewBox="0 0 24 24" role="img">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const filteredPosts = selectedPlatform === 'all' 
    ? posts 
    : posts.filter(post => post.platform === selectedPlatform);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="w-full">
      {/* Platform Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedPlatform === 'all'
              ? 'bg-gray-700 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedPlatform('twitter')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            selectedPlatform === 'twitter'
              ? 'bg-gray-700 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
          }`}
        >
          <SimpleIcon icon={siX} className="w-4 h-4" />
          X
        </button>
        <button
          onClick={() => setSelectedPlatform('bluesky')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            selectedPlatform === 'bluesky'
              ? 'bg-gray-700 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
          }`}
        >
          <SimpleIcon icon={siBluesky} className="w-4 h-4" />
          Bluesky
        </button>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-700 rounded-lg p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-white">Oops an error occured!</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="border border-gray-700 rounded-lg p-8 text-center text-gray-400">
          <p>No posts found for this platform</p>
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.slice(0, maxPosts).map((post) => (
              <motion.article
                key={post.id}
                variants={postVariants}
                layout
                className="border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {/* Platform Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    post.platform === 'twitter' ? 'bg-gray-800' : 'bg-blue-900'
                  }`}>
                    {post.platform === 'twitter' ? (
                      <SimpleIcon icon={siX} className="w-5 h-5 text-gray-300" />
                    ) : (
                      <SimpleIcon icon={siBluesky} className="w-5 h-5 text-blue-400" />
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    {/* Author & Timestamp */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white">
                        {post.author.displayName}
                      </span>
                      <span className="text-gray-500 text-sm">
                        @{post.author.username}
                      </span>
                      <span className="text-gray-600">·</span>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(post.timestamp)}
                      </div>
                    </div>

                    {/* Post Text */}
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Metrics & Link */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        {post.metrics?.replies !== undefined && (
                          <div className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.metrics.replies}</span>
                          </div>
                        )}
                        {post.metrics?.reposts !== undefined && (
                          <div className="flex items-center gap-1 hover:text-green-400 transition-colors">
                            <Repeat2 className="w-4 h-4" />
                            <span>{post.metrics.reposts}</span>
                          </div>
                        )}
                        {post.metrics?.likes !== undefined && (
                          <div className="flex items-center gap-1 hover:text-red-400 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>{post.metrics.likes}</span>
                          </div>
                        )}
                      </div>
                      
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors text-sm group-hover:translate-x-1 transition-transform"
                      >
                        View Post
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
