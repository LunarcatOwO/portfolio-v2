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

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ServerCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private defaultTtl: number; // Time to live in milliseconds

  constructor(maxSize = 1000, defaultTtl = 30 * 60 * 1000) { // 30 minutes default
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl;
  }

  set(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTtl);
    
    // If cache is at max size, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, { data: value, expiresAt });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats(): { size: number; maxSize: number } {
    this.cleanup(); // Clean up before getting stats
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

// Cache for GitHub avatars - store as ArrayBuffer
export const avatarCache = new ServerCache<{
  buffer: ArrayBuffer;
  contentType: string;
}>(500, 60 * 60 * 1000); // 1 hour TTL, max 500 avatars

// Cache for project icons - store as ArrayBuffer or SVG string
export const projectIconCache = new ServerCache<{
  buffer: ArrayBuffer | string;
  contentType: string;
  isReal: boolean; // Whether it's a real icon or fallback
}>(1000, 60 * 60 * 1000); // 1 hour TTL, max 1000 icons

// Cleanup expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    avatarCache.cleanup();
    projectIconCache.cleanup();
  }, 10 * 60 * 1000);
}