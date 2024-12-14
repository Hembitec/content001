import React from 'react';
import { Bell, Brain } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-semibold text-blue-900">ContentIQ</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-blue-50 rounded-full">
              <span className="text-blue-600 font-medium">{user.coins} coins</span>
            </div>
          </div>
          
          <button className="relative text-gray-600 hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-blue-100"
            />
            <span className="text-gray-700 font-medium hidden sm:block">{user.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}