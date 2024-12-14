import React from 'react';

export function NavLinks() {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <a href="#tools" className="text-gray-600 hover:text-blue-600 transition-colors">Tools</a>
      <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
      <a href="#docs" className="text-gray-600 hover:text-blue-600 transition-colors">Documentation</a>
    </nav>
  );
}