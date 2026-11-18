'use client';

import { memo, useId } from 'react';
import SidebarItem from './SidebarItem';

export interface SidebarSubItem {
  href: string;
  icon: string;
  label: string;
}

export interface SidebarGroupProps {
  icon: string;
  label: string;
  isExpanded: boolean;
  groupExpanded: boolean;
  onToggle: () => void;
  isActive: boolean;
  items: SidebarSubItem[];
  pathname: string;
}

/**
 * Grupo de navegación con árbol. Expandido: botón + hijos bajo una guía vertical.
 * Colapsado: solo los hijos como iconos (el grupo deja de ser interactivo).
 */
const SidebarGroup = memo(function SidebarGroup({
  icon,
  label,
  isExpanded,
  groupExpanded,
  onToggle,
  isActive,
  items,
  pathname,
}: SidebarGroupProps) {
  const panelId = `${useId()}-items`;

  if (!isExpanded) {
    return (
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <SidebarItem
              href={item.href}
              icon={item.icon}
              label={item.label}
              isExpanded={false}
              isActive={pathname === item.href}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={groupExpanded}
        aria-controls={panelId}
        className={`flex w-full items-center gap-2.5 rounded-control px-3 py-2.5 font-body text-label-lg transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isActive
            ? 'font-medium text-primary'
            : 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
        }`}
      >
        <span aria-hidden="true" className="material-symbols-outlined shrink-0 text-xl">
          {icon}
        </span>
        <span className="truncate">{label}</span>
        <span
          aria-hidden="true"
          className={`material-symbols-outlined ml-auto shrink-0 text-base transition-transform ${
            groupExpanded ? 'rotate-90' : ''
          }`}
        >
          chevron_right
        </span>
      </button>

      <div id={panelId} className="sidebar-children" data-open={groupExpanded}>
        <div className="overflow-hidden">
          <ul className="mt-1 ml-5 space-y-0.5 border-l border-border pl-2">
            {items.map((item) => (
              <li key={item.href}>
                <SidebarItem
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isExpanded
                  isActive={pathname === item.href}
                  variant="sub"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
});

export default SidebarGroup;
