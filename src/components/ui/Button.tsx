import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

const variants = {
  primary:
    'bg-[var(--accent)] text-white hover:opacity-90 dark:text-[var(--bg)]',
  secondary:
    'bg-[var(--bg-muted)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-strong)]',
  ghost: 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-muted)]',
  danger: 'bg-[var(--danger)] text-white hover:opacity-90',
} as const

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-sm',
} as const

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants
    size?: keyof typeof sizes
  }
>

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-opacity disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
