'use client'

import { HTMLAttributes, forwardRef } from 'react'

export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  padding?: CardPadding
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { hoverable = false, padding = 'md', className = '', ...props },
  ref
) {
  const classes = [
    'rounded-card border border-border bg-bg-surface',
    paddingClasses[padding],
    hoverable ? 'transition-surface hover:border-border-hover hover:shadow-md' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div ref={ref} className={classes} {...props} />
})

export default Card
