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

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface ProjectIconProps {
  repoUrl?: string;
  projectName: string;
  className?: string;
}

export default function ProjectIcon({ repoUrl, projectName, className = "w-12 h-12" }: ProjectIconProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!repoUrl); // Start loading if repoUrl is provided
  const [isRealIcon, setIsRealIcon] = useState<boolean>(false);

  // Deterministic gradient based on project name
  const gradientStyle = useMemo(() => {
    const str = projectName || '';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const uhash = hash >>> 0; // unsigned
    const h1 = uhash % 360;
    const h2 = (h1 + 120 + ((uhash >> 8) % 120)) % 360;
    const s1 = 70 + ((uhash >> 16) % 20); // 70-89
    const s2 = 70 + ((uhash >> 24) % 20); // 70-89
    const l1 = 45; // keep good contrast with white text
    const l2 = 55;
    return {
      backgroundImage: `linear-gradient(135deg, hsl(${h1} ${s1}% ${l1}%) 0%, hsl(${h2} ${s2}% ${l2}%) 100%)`,
    } as React.CSSProperties;
  }, [projectName]);

  useEffect(() => {
    if (!repoUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Use our API route to get the cached project icon (or fallback)
    const apiUrl = `/api/project-icon?repoUrl=${encodeURIComponent(repoUrl)}`;
    setIconUrl(apiUrl);

    // Do a lightweight HEAD check to know if the API found a real icon or returned fallback
    fetch(apiUrl, { method: 'HEAD' })
      .then((res) => {
        const header = res.headers.get('x-project-icon');
        setIsRealIcon(header === 'real');
      })
      .catch(() => {
        // If HEAD fails, assume not real so we show the letter fallback
        setIsRealIcon(false);
      })
      .finally(() => setLoading(false));
  }, [repoUrl]);

  // Always render the gradient background. If we have an icon, overlay it at ~75% size; otherwise show fallback.
  return (
    <div className={`${className} rounded-lg overflow-hidden flex items-center justify-center text-white font-bold relative`} style={gradientStyle}>
      {loading ? (
        <div className="aspect-square w-1/3 max-w-6 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      ) : iconUrl && isRealIcon ? (
        // Icon overlay at 75% of the square, keeping gradient visible around
        <div className="relative w-3/4 h-3/4">
          <Image
            src={iconUrl}
            alt={`${projectName} icon`} 
            fill
            className="object-contain"
            onError={() => {
              // If the API route fails, fallback to the local component
              setIconUrl(null);
              setIsRealIcon(false);
            }}
            unoptimized // For our API route
          />
        </div>
      ) : (
        projectName.charAt(0).toUpperCase()
      )}
    </div>
  );
}