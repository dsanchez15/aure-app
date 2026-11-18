'use client';

import { ReactNode, useRef } from 'react';
import { SidebarProvider, useSidebar } from '@/components/SidebarContext';
import Sidebar from './Sidebar';
import MobileTopbar from './MobileTopbar';
import BottomNav from './BottomNav';

export interface AppShellProps {
  children: ReactNode;
}

/**
 * Estructura de la app: sidebar fija en escritorio, topbar + bottom nav en móvil.
 * El contenido nunca define márgenes: los aporta el shell.
 */
export default function AppShell({ children }: AppShellProps) {
  const toggleRef = useRef<HTMLButtonElement>(null);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-bg-base text-text-primary">
        <Sidebar returnFocusRef={toggleRef} />
        <ShellContent toggleRef={toggleRef}>{children}</ShellContent>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}

function ShellContent({
  children,
  toggleRef,
}: {
  children: ReactNode;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { isExpanded } = useSidebar();

  return (
    <div className={`flex min-w-0 flex-1 flex-col ${isExpanded ? 'lg:ml-60' : 'lg:ml-20'}`}>
      <MobileTopbar toggleRef={toggleRef} />
      <main className="flex-1 px-4 pt-6 pb-28 lg:px-8 lg:pt-8 lg:pb-8">{children}</main>
    </div>
  );
}
