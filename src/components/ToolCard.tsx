import React from 'react';
import { Tool } from '../types';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = Icons[tool.icon as keyof typeof Icons];

  return (
    <Link
      to={tool.path}
      className="group p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-50 hover:border-blue-100 text-left block"
    >
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-full w-fit group-hover:bg-blue-100 transition-colors">
          <IconComponent className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{tool.title}</h3>
        <p className="text-gray-600 leading-relaxed">{tool.description}</p>
        <div className="pt-2">
          <span className="text-blue-600 font-medium group-hover:underline">
            Get Started →
          </span>
        </div>
      </div>
    </Link>
  );
}