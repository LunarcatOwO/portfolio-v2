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

import { Clock, AlertCircle } from "lucide-react";

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
}

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
  url: string;
}

async function fetchGitHubReleases(): Promise<ChangelogEntry[]> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/LunarcatOwO/portfolio-v2/releases",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        // Cache for 3 hours (10800 seconds)
        next: { revalidate: 10800 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const releases: GitHubRelease[] = await response.json();

    return releases.map((release) => {
      // Parse the release body to extract changes
      const changes = release.body
        .split("\n")
        .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"))
        .map((line) => line.trim().replace(/^[-*]\s*/, ""));

      // If no bullet points found, split by newlines and filter empty lines
      const changesList =
        changes.length > 0
          ? changes
          : release.body
              .split("\n")
              .filter((line) => line.trim().length > 0)
              .slice(0, 10); // Limit to first 10 lines if no bullets

      return {
        version: release.tag_name.replace(/^v/, ""),
        date: new Date(release.published_at).toISOString().split("T")[0],
        changes: changesList.length > 0 ? changesList : [release.name || "Release"],
        url: release.html_url,
      };
    });
  } catch (error) {
    console.error("Failed to fetch GitHub releases:", error);
    // Return fallback data if GitHub API fails
    return [
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
        url: "https://github.com/LunarcatOwO/portfolio-v2",
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
        url: "https://github.com/LunarcatOwO/portfolio-v2",
      },
    ];
  }
}

export default async function ChangelogPage() {
  const changelogEntries = await fetchGitHubReleases();

  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-pink-400">Changelog</h1>
        <p className="text-gray-400 text-lg">
          Track the latest updates and changes to this portfolio.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>Automatically synced from GitHub releases (cached for 3 hours)</span>
        </div>
      </div>

      <div className="space-y-8">
        {changelogEntries.length > 0 ? (
          changelogEntries.map((entry) => (
            <div
              key={entry.version}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-pink-900/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-bold text-pink-400 hover:text-pink-300 transition-colors"
                >
                  v{entry.version}
                </a>
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
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No releases found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
