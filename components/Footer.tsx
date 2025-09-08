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
import Image from "next/image";
import { motion } from "motion/react";

export default function Footer() {
    return (
        <motion.div 
            className="w-full py-8 border-t border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                type: "spring" as const,
                stiffness: 150,
                damping: 25
            }}
        >
            <div className="flex flex-col items-center justify-center text-sm text-gray-600 dark:text-gray-400 space-y-4">
                <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                        type: "spring" as const,
                        stiffness: 200,
                        damping: 20,
                        delay: 0.2 
                    }}
                >
                    <span>Made with</span>
                    <span role="img" aria-label="heart"> ❤️ </span>
                    <span>by LunarcatOwO using</span>
                    <div>
                        <Image 
                            src="/next.svg" 
                            alt="Next.js" 
                            width={75}
                            height={50}
                            className="dark:invert"
                        />
                    </div>
                </motion.div>
                <motion.p 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ 
                        type: "spring" as const,
                        stiffness: 150,
                        damping: 25,
                        delay: 0.4 
                    }}
                >
                    This project is{" "}
                    <a 
                        href="https://github.com/LunarcatOwO/portfolio-v2" 
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline"
                    >
                        open source
                    </a>
                    {" "}©2025 LunarcatOwO. Licensed Under GPL-3.0.
                </motion.p>
            </div>
        </motion.div>
    )
}