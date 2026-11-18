'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppTranslation } from '@/components/LanguageProvider';

export interface BottomNavItem {
  href: string;
  icon: string;
  label: string;
}

export interface BottomNavProps {
  items?: BottomNavItem[];
  /** `false` para previsualizarlo dentro de un contenedor (styleguide). */
  fixed?: boolean;
}

/** Navegación inferior móvil con los 4 destinos de uso diario. */
export function BottomNav({ items, fixed = true }: BottomNavProps) {
  const pathname = usePathname();
  const { t } = useAppTranslation();

  const links: BottomNavItem[] = items ?? [
    { href: '/dashboard', icon: 'grid_view', label: t('sidebar.dashboard') },
    { href: '/todos', icon: 'check_circle', label: t('sidebar.todos') },
    { href: '/reminders', icon: 'notifications', label: t('sidebar.reminders') },
    { href: '/settings', icon: 'settings', label: t('sidebar.settings') },
  ];

  return (
    <nav
      aria-label="Navegación inferior"
      className={
        fixed
          ? 'pb-safe fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-bg-surface pt-2 lg:hidden'
          : 'flex border-t border-border bg-bg-surface pt-2'
      }
    >
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1 font-label text-label-sm transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isActive ? 'font-medium text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span aria-hidden="true" className="material-symbols-outlined block text-xl">
              {link.icon}
            </span>
            <span className="truncate px-1">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
