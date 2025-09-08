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

interface ProjectIconProps {
  repoUrl?: string;
  projectName: string;
  className?: string;
}

export default function ProjectIcon({ repoUrl, projectName, className = "w-12 h-12" }: ProjectIconProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!repoUrl); // Start loading if repoUrl is provided

  useEffect(() => {
    if (!repoUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Use our API route to get the cached project icon (or fallback)
    const apiUrl = `/api/project-icon?repoUrl=${encodeURIComponent(repoUrl)}`;
    
    // Since our API always returns an icon (real or fallback), we can directly set the URL
    setIconUrl(apiUrl);
    setLoading(false);
  }, [repoUrl]);

  // Always show the icon from our API if we have a repoUrl
  if (repoUrl && iconUrl) {
    return (
      <div className={`${className} rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800 relative`}>
        <Image 
          src={iconUrl} 
          alt={`${projectName} icon`}
          fill
          className="object-cover"
          onError={() => {
            // If the API route fails, fallback to the local component
            setIconUrl(null);
          }}
          unoptimized // For our API route
        />
      </div>
    );
  }

  // Fallback to first letter of project name
  return (
    <div className={`${className} bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold`}>
      {loading ? (
        <div className="aspect-square w-1/3 max-w-6 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      ) : (
        projectName.charAt(0).toUpperCase()
      )}
    </div>
  );
}