import type { ReadingPrefs, ThemeName } from '@/domain/types'

const DARK_THEMES = new Set<ThemeName>(['dark', 'midnight', 'nord', 'solarized-dark'])

export function resolveTheme(theme: ThemeName): Exclude<ThemeName, 'system'> {
  if (theme !== 'system') return theme
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function isDarkTheme(theme: ThemeName): boolean {
  return DARK_THEMES.has(resolveTheme(theme))
}

/** Writes theme + reading preferences onto <html> so CSS tokens switch. */
export function applyAppearance(theme: ThemeName, reading: ReadingPrefs) {
  const root = document.documentElement
  const resolved = resolveTheme(theme)
  root.dataset.theme = resolved
  root.dataset.scheme = DARK_THEMES.has(resolved) ? 'dark' : 'light'
  root.dataset.font = reading.font
  root.dataset.textSize = reading.size
  root.dataset.measure = reading.measure
  try {
    // Mirrored so index.html can paint the right theme before IndexedDB loads.
    localStorage.setItem('cd-appearance', JSON.stringify({ theme, ...reading }))
  } catch {
    /* storage unavailable — the theme still applies for this session */
  }
}
