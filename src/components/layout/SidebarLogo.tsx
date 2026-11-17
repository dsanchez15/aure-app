'use client';

import { memo } from 'react';
import { BrandMark } from './BrandMark';

export interface SidebarLogoProps {
  isExpanded: boolean;
}

/** Cabecera de la barra lateral: marca + nombre (el nombre se oculta en el rail). */
export default memo(function SidebarLogo({ isExpanded }: SidebarLogoProps) {
  return (
    <BrandMark
      size="md"
      showName={isExpanded}
      className={`px-2 ${isExpanded ? '' : 'justify-center px-0'}`}
    />
  );
});
