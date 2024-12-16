import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import clsx from 'clsx';
import { theme } from '../../styles/theme';

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center space-x-2 p-2 rounded-full transition-colors",
          theme.colors.button.secondary
        )}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center",
            theme.colors.background.secondary
          )}>
            <UserIcon className={clsx("w-4 h-4", theme.colors.text.accent)} />
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className={clsx(
            "absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-20",
            theme.colors.background.primary,
            theme.colors.border.light,
            "border"
          )}>
            <div className={clsx("px-4 py-2 text-sm", theme.colors.text.primary)}>
              {user.displayName || user.email}
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-700" />
            
            <button
              onClick={() => {/* Add settings handler */}}
              className={clsx(
                "w-full flex items-center px-4 py-2 text-sm transition-colors",
                theme.colors.text.secondary,
                "hover:" + theme.colors.text.accent.split(' ')[0]
              )}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            
            <button
              onClick={() => signOut()}
              className={clsx(
                "w-full flex items-center px-4 py-2 text-sm transition-colors",
                theme.colors.text.secondary,
                "hover:" + theme.colors.text.accent.split(' ')[0]
              )}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}