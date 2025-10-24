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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog - LunarcatOwO.space",
  description: "Project contribution history and commit timeline",
  openGraph: {
    title: "Changelog - LunarcatOwO.space",
    description: "Project contribution history and commit timeline",
    url: "https://lunarcatowo.space/changelog",
    siteName: "LunarcatOwO.space",
    type: "website",
  },
};

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
