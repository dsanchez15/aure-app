'use client';

import { memo, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppTranslation } from '@/components/LanguageProvider';
import { useClickOutside } from '@/hooks/useClickOutside';

interface User {
  name: string;
  email: string;
  image?: string;
  tagline?: string;
}

export interface UserProfileMenuProps {
  user: User | null;
  isExpanded: boolean;
}

const menuItem =
  'flex items-center gap-2.5 rounded-control px-3 py-2 font-label text-label-lg text-text-secondary transition-state hover:bg-bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

/** Bloque de usuario al pie de la barra lateral, con menú de cuenta. */
const UserProfileMenu = memo(function UserProfileMenu({ user, isExpanded }: UserProfileMenuProps) {
  const { t } = useAppTranslation();
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);

  useClickOutside(profileMenuRef, () => setProfileMenuOpen(false), profileMenuOpen);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileMenuOpen(false);
        profileTriggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="relative mt-auto border-t border-sidebar-border pt-3">
      <button
        ref={profileTriggerRef}
        type="button"
        onClick={() => setProfileMenuOpen((open) => !open)}
        aria-expanded={profileMenuOpen}
        aria-haspopup="menu"
        aria-controls="profile-menu"
        aria-label={user?.name || 'User'}
        className={`flex w-full items-center gap-2.5 rounded-control p-2 text-left transition-state hover:bg-bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isExpanded ? '' : 'justify-center'
        }`}
      >
        <img
          src={
            user?.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`
          }
          alt="User Profile"
          className="h-8 w-8 min-w-8 rounded-pill border border-border object-cover"
        />
        {isExpanded && (
          <span className="min-w-0 flex-1 overflow-hidden">
            <span className="block truncate font-label text-label-lg text-text-primary">
              {user?.name || 'User'}
            </span>
            <span className="block truncate font-label text-label-sm text-text-muted">
              {user?.tagline || 'Productivity Enthusiast'}
            </span>
          </span>
        )}
        {isExpanded && (
          <span
            aria-hidden="true"
            className={`material-symbols-outlined shrink-0 text-base text-text-muted transition-transform ${
              profileMenuOpen ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        )}
      </button>

      {profileMenuOpen && (
        <div
          ref={profileMenuRef}
          id="profile-menu"
          role="menu"
          className={`absolute bottom-full z-50 mb-2 rounded-card border border-border bg-bg-surface p-1 shadow-lg ${
            isExpanded ? 'left-0 right-0' : 'left-0 w-52'
          }`}
        >
          <Link href="/settings" onClick={() => setProfileMenuOpen(false)} role="menuitem" className={menuItem}>
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              settings
            </span>
            {t('sidebar.settings')}
          </Link>
          <Link href="/support" onClick={() => setProfileMenuOpen(false)} role="menuitem" className={menuItem}>
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              help_outline
            </span>
            {t('sidebar.support')}
          </Link>
          <div className="my-1 border-t border-border" />
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen(false);
              handleLogout();
            }}
            role="menuitem"
            className={`${menuItem} w-full text-left text-danger hover:bg-danger/10 hover:text-danger`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              logout
            </span>
            {t('sidebar.logout')}
          </button>
        </div>
      )}
    </div>
  );
});

export default UserProfileMenu;
