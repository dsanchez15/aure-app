'use client';

import { forwardRef, memo } from 'react';
import Link from 'next/link';

export interface SidebarItemProps {
  href: string;
  icon: string;
  label: string;
  isExpanded: boolean;
  isActive: boolean;
  badge?: React.ReactNode;
  className?: string;
  /** `sub` = hijo de un grupo con árbol; `default` = destino de primer nivel. */
  variant?: 'default' | 'sub';
  iconClassName?: string;
}

const itemBase =
  'group flex items-center rounded-control font-label text-label-lg transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

const itemState = (isActive: boolean) =>
  isActive
    ? 'bg-sidebar-item-active-bg font-medium text-sidebar-item-active-text'
    : 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary';

const subState = (isActive: boolean) =>
  isActive
    ? 'bg-bg-surface-hover font-medium text-primary'
    : 'text-text-muted hover:bg-bg-surface-hover hover:text-text-primary';

const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(function SidebarItem(
  { href, icon, label, isExpanded, isActive, badge, className = '', variant = 'default', iconClassName = '' },
  ref
) {
  const isSub = variant === 'sub';
  const showLabel = isExpanded;

  const classes = [
    itemBase,
    !showLabel
      ? 'justify-center px-0 py-2.5'
      : isSub
        ? 'gap-2 py-2 pl-2 text-body-md'
        : 'gap-2.5 px-3 py-2.5',
    isSub && showLabel ? subState(isActive) : itemState(isActive),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link
      href={href}
      ref={ref}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      className={classes}
    >
      <span
        aria-hidden="true"
        className={`material-symbols-outlined shrink-0 text-xl ${iconClassName}`}
      >
        {icon}
      </span>
      {showLabel && (
        <span className={`truncate ${isSub ? 'text-body-md' : 'text-label-lg'}`}>{label}</span>
      )}
      {badge && showLabel ? <span className="ml-auto shrink-0">{badge}</span> : null}
    </Link>
  );
});

SidebarItem.displayName = 'SidebarItem';

export default memo(SidebarItem);
