import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

export function NavLinks() {
  const { darkMode } = useTheme();
  
  const links = [
    { href: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="flex items-center space-x-4">
      {links.map(({ href, label }) => (
        <NavLink
          key={href}
          to={href}
          className={({ isActive }) =>
            clsx(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? darkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
                : darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}