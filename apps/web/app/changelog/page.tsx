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

import { Clock } from "lucide-react";

export default function ChangelogPage() {
  const changelogEntries = [
    {
      version: "2.0.0",
      date: "2025-01-10",
      changes: [
        "Added changelog page with navigation",
        "Implemented responsive navigation bar",
        "Added profile picture component",
        "Created tech cards section",
        "Added project carousel feature",
      ],
    },
    {
      version: "1.0.0",
      date: "2025-01-01",
      changes: [
        "Initial portfolio v2 launch",
        "Modern Next.js app router implementation",
        "Tailwind CSS styling",
        "Social media integration",
      ],
    },
  ];

  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-pink-400">Changelog</h1>
        <p className="text-gray-400 text-lg">
          Track the latest updates and changes to this portfolio.
        </p>
      </div>

      <div className="space-y-8">
        {changelogEntries.map((entry) => (
          <div
            key={entry.version}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-pink-900/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-pink-400">
                v{entry.version}
              </h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{entry.date}</span>
              </div>
            </div>
            <ul className="space-y-2">
              {entry.changes.map((change, index) => (
                <li key={index} className="text-gray-300 flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
