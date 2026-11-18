'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/SidebarContext';
import { useAppTranslation } from '@/components/LanguageProvider';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useSidebarData } from '@/hooks/useSidebarData';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import SidebarItem from './SidebarItem';
import SidebarGroup from './SidebarGroup';
import SidebarLogo from './SidebarLogo';
import UserProfileMenu from './UserProfileMenu';

export interface SidebarProps {
  /** Elemento que recupera el foco al cerrar el overlay móvil (hamburguesa del topbar). */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Navegación principal. Conserva el árbol de destinos existente (ADR-005):
 * 240 px expandida, rail de iconos al colapsar, overlay en móvil.
 */
export default function Sidebar({ returnFocusRef }: SidebarProps) {
  const { t } = useAppTranslation();
  const pathname = usePathname();
  const { isExpanded, isMobileOverlayOpen, toggle, closeMobileOverlay } = useSidebar();
  const { user, expiringCount } = useSidebarData();
  const { flags } = useFeatureFlags();

  const [planExpanded, setPlanExpanded] = useLocalStorageState('sidebar-plan-expanded', false);
  const [studyExpanded, setStudyExpanded] = useLocalStorageState('sidebar-study-expanded', false);

  useEffect(() => {
    if (pathname.startsWith('/study')) setStudyExpanded(true);
  }, [pathname, setStudyExpanded]);

  useEffect(() => {
    if (pathname.startsWith('/goals') || pathname.startsWith('/progress')) setPlanExpanded(true);
  }, [pathname, setPlanExpanded]);

  const toggleStudy = useCallback(() => setStudyExpanded((v) => !v), [setStudyExpanded]);
  const togglePlan = useCallback(() => setPlanExpanded((v) => !v), [setPlanExpanded]);

  const sidebarRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(sidebarRef, isMobileOverlayOpen, returnFocusRef ?? toggleRef);

  const handleBackdropClick = useCallback(() => closeMobileOverlay(), [closeMobileOverlay]);

  const widthClass = isExpanded ? 'w-60' : 'w-20';

  const checklistsBadge =
    expiringCount > 0 && isExpanded ? (
      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-pill border border-border bg-bg-surface-hover px-1.5 font-label text-label-sm text-text-primary">
        {expiringCount}
      </span>
    ) : undefined;

  return (
    <>
      {isMobileOverlayOpen && (
        <div
          className="fixed inset-0 z-30 bg-bg-overlay lg:hidden"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        id="main-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-sidebar-border bg-sidebar-bg px-4 py-6 font-body transition-surface motion-reduce:transition-none ${widthClass} ${
          isMobileOverlayOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <button
          ref={toggleRef}
          type="button"
          onClick={toggle}
          aria-expanded={isExpanded || isMobileOverlayOpen}
          aria-controls="main-sidebar"
          aria-label={isExpanded ? 'Contraer navegación' : 'Expandir navegación'}
          className="absolute -right-3 top-8 hidden h-6 w-6 items-center justify-center rounded-pill border border-border bg-bg-surface text-text-muted shadow-sm transition-state hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:flex"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-base">
            {isExpanded ? 'chevron_left' : 'chevron_right'}
          </span>
        </button>

        <SidebarLogo isExpanded={isExpanded} />

        <nav aria-label="Navegación principal" className="mt-6 flex-1 space-y-1 overflow-y-auto">
          <SidebarItem
            href="/dashboard"
            icon="grid_view"
            label={t('sidebar.dashboard')}
            isExpanded={isExpanded}
            isActive={pathname === '/dashboard'}
          />
          <SidebarItem
            href="/todos"
            icon="check_circle"
            label={t('sidebar.todos')}
            isExpanded={isExpanded}
            isActive={pathname === '/todos'}
          />
          {flags.checklists && (
            <SidebarItem
              href="/checklists"
              icon="fact_check"
              label={t('sidebar.checklists')}
              isExpanded={isExpanded}
              isActive={pathname === '/checklists'}
              badge={checklistsBadge}
            />
          )}
          {flags.reminders && (
            <SidebarItem
              href="/reminders"
              icon="notifications"
              label={t('sidebar.reminders')}
              isExpanded={isExpanded}
              isActive={pathname === '/reminders'}
            />
          )}
          {flags.habits && (
            <SidebarItem
              href="/habits"
              icon="routine"
              label={t('sidebar.habits')}
              isExpanded={isExpanded}
              isActive={pathname === '/habits'}
            />
          )}

          {flags.study && (
            <SidebarGroup
              icon="school"
              label="Estudio"
              isExpanded={isExpanded}
              groupExpanded={studyExpanded}
              onToggle={toggleStudy}
              isActive={pathname.startsWith('/study')}
              pathname={pathname}
              items={[
                { href: '/study/review', icon: 'play_circle', label: 'Repaso' },
                { href: '/study/questions', icon: 'quiz', label: 'Preguntas' },
              ]}
            />
          )}

          {(flags.goals || flags.progress) && (
            <SidebarGroup
              icon="track_changes"
              label={t('sidebar.plan')}
              isExpanded={isExpanded}
              groupExpanded={planExpanded}
              onToggle={togglePlan}
              isActive={pathname.startsWith('/goals') || pathname.startsWith('/progress')}
              pathname={pathname}
              items={[
                ...(flags.goals ? [{ href: '/goals', icon: 'flag', label: t('sidebar.goals') }] : []),
                ...(flags.progress
                  ? [
                      {
                        href: '/progress',
                        icon: 'trending_up',
                        label: t('sidebar.progressAndCheckIn'),
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </nav>

        <UserProfileMenu user={user} isExpanded={isExpanded} />
      </aside>
    </>
  );
}
