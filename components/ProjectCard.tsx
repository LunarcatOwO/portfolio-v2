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

import ProjectIcon from './ProjectIcon';

interface ProjectCardProps {
  name: string;
  description: string;
  status: string;
  technologies: string[];
  link: string;
  icon?: React.ReactNode;
  repoUrl?: string;
}

export default function ProjectCard({ name, description, status, technologies, link, icon, repoUrl }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'currently in active development':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'in development':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'wip':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-900/20">
      <div className="flex items-start gap-4 mb-4">
        {icon ? (
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            {icon}
          </div>
        ) : (
          <ProjectIcon 
            repoUrl={repoUrl} 
            projectName={name} 
            className="w-12 h-12"
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech) => (
              <span 
                key={tech} 
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs rounded"
              >
                {tech}
              </span>
            ))}
          </div>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            View Project →
          </a>
        </div>
      </div>
    </div>
  );
}