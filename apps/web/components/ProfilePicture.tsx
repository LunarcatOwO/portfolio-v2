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

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

interface ProfilePictureProps {
  username: string;
  className?: string;
  fallbackText?: string;
}

export default function ProfilePicture({ username, className = "w-16 h-16", fallbackText = "L" }: ProfilePictureProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    // Use our API route to get the cached avatar
    const apiUrl = `/api/github-avatar?username=${encodeURIComponent(username)}`;
    
    // Check if the avatar is available
    fetch(apiUrl, { method: 'HEAD' })
      .then((response) => {
        if (response.ok) {
          setAvatarUrl(apiUrl);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [username]);

  // If we have an avatar and it loaded successfully
  if (avatarUrl && !error) {
    return (
      <motion.div 
        className={`${className} rounded-full overflow-hidden flex items-center justify-center bg-gray-800 relative flex-shrink-0 aspect-square`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring" as const,
          stiffness: 200,
          damping: 20
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-full h-full"
        >
          <Image 
            src={avatarUrl} 
            alt={`${username} profile picture`}
            fill
            className="object-cover"
            onError={() => setError(true)}
            unoptimized // For our API route
          />
        </motion.div>
      </motion.div>
    );
  }

  // Fallback to gradient with initials
  return (
    <motion.div 
      className={`${className} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 aspect-square`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring" as const,
        stiffness: 200,
        damping: 20
      }}
    >
      {loading ? (
        <motion.div 
          className="aspect-square w-1/3 max-w-6 border-2 border-white border-t-transparent rounded-full flex-shrink-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <motion.span 
          className="text-xl font-bold leading-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {fallbackText}
        </motion.span>
      )}
    </motion.div>
  );
}