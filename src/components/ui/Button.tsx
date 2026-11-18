'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-control font-label transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-text-inverse hover:bg-primary-hover',
  secondary:
    'border border-border bg-bg-surface text-text-primary hover:border-border-hover hover:bg-bg-surface-hover',
  danger: 'bg-danger text-text-inverse hover:opacity-90',
  ghost: 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-label-md',
  md: 'px-4 py-2 text-label-lg',
  lg: 'px-6 py-3 text-label-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth = false, className = '', type = 'button', ...props },
  ref
) {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <button ref={ref} type={type} className={classes} {...props} />
})

export default Button
