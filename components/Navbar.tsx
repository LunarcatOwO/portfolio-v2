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
import { Terminal, Home, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

// Navigation configuration - easily editable like TechCards
interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean; // If true, only highlights on exact match
}

const navigationItems: NavItem[] = [
  {
    href: "/",
    label: "home",
    icon: Home,
    exact: true, // Only highlight on exact "/" match
  }
  // {
  //   href: "/contact",
  //   label: "contact",
  //   icon: Mail,
  // },
];

export default function Navbar() {
  const pathname = usePathname();

  // Smart active link detection
  const isActiveLink = (item: NavItem): boolean => {
    if (item.exact) {
      return pathname === item.href;
    }
    // For non-exact matches, highlight if current path starts with the href
    // This handles cases like "/projects" being active when on "/projects/sub1"
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-pink-400" />
            <span className="text-xl font-semibold text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
              lunarcatowo.space
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveLink(item);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                    isActive
                      ? "text-pink-400 bg-pink-900/30 shadow-lg shadow-pink-500/20" 
                      : "text-pink-400 hover:text-pink-300 hover:bg-pink-900/20"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}