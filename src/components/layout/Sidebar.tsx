import { NavLink } from 'react-router-dom'
import { TRACKS } from '@/content/taxonomy'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
    isActive
      ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
      : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]'
  }`

const NAV = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/my-topics', label: 'My Topics' },
  { to: '/dsa', label: 'DSA Problems' },
  { to: '/revision', label: 'Revision' },
  { to: '/interview', label: 'Interview Prep' },
  { to: '/capstone', label: 'Capstone Project' },
  { to: '/print', label: 'Print Center' },
  { to: '/search', label: 'Search' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/settings', label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside
      data-sidebar
      className="print-hidden flex h-full w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)]"
    >
      <div className="border-b border-[var(--border)] px-3 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">
          SE Prep
        </div>
        <div className="mt-0.5 text-sm font-semibold leading-snug text-[var(--text)]">
          Engineering Preparation
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Primary">
        <div className="mb-3 space-y-0.5">
          {NAV.slice(0, 3).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
          Tracks
        </div>
        <div className="mb-3 space-y-0.5">
          {TRACKS.map((t) => (
            <NavLink key={t.id} to={`/tracks/${t.id}`} className={linkClass}>
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: t.accent }}
                  aria-hidden
                />
                Track {t.id} — {t.shortName}
              </span>
            </NavLink>
          ))}
        </div>

        <div className="space-y-0.5">
          {NAV.slice(3).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  )
}
