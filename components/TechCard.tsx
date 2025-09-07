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

interface TechCardProps {
  name: string;
  description: string;
  icon?: React.ReactNode;
}

export default function TechCard({ name, description, icon }: TechCardProps) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-900/20">
      <div className="mb-3">
        {icon ? icon : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
        )}
      </div>
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}