import React from 'react';
import { ToolCard } from './ToolCard';
import { tools } from '../data/tools';

export function Dashboard() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900">AI Content Tools</h2>
          <p className="mt-2 text-lg text-gray-600">
            Transform your content strategy with our powerful AI-powered tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </main>
  );
}