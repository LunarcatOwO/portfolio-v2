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
import Link from "next/link";
import { Terminal, Home } from "lucide-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            <span className="text-xl font-semibold text-pink-600 dark:text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
              lunarcatowo.space
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                pathname === "/" 
                  ? "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 shadow-lg shadow-pink-500/20" 
                  : "text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>home</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}