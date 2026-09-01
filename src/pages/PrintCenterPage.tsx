import { Link } from 'react-router-dom'
import { getContentReadyTopics, curriculumStats } from '@/content/taxonomy'
import { PROBLEMS } from '@/content/problems'

export function PrintCenterPage() {
  const ready = getContentReadyTopics()
  const stats = curriculumStats()

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Print Center</h1>
        <p className="text-sm text-[var(--text-muted)]">
          A4 handbook output. Use Print Preview to choose Full vs Quick and what to include.
        </p>
        <p className="mt-1 text-xs text-[var(--text-faint)]">
          {ready.length} deep topics printable · {stats.total} total in curriculum (stubs until notes
          land)
        </p>
      </div>

      <section>
        <h2 className="mb-2 font-semibold">Individual topics (notes ready)</h2>
        <ul className="space-y-2 text-sm">
          {ready.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap gap-3 rounded-md border border-[var(--border)] px-3 py-2"
            >
              <span className="font-medium">{t.title}</span>
              <Link className="text-[var(--accent)] underline" to={`/print/preview?topic=${t.id}`}>
                Preview full
              </Link>
              <Link
                className="text-[var(--accent)] underline"
                to={`/print/preview?topic=${t.id}&mode=quick`}
              >
                Preview quick revision
              </Link>
              <Link className="text-[var(--accent)] underline" to={`/print/topic/${t.id}`}>
                Print route
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Sheets</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link className="text-[var(--accent)] underline" to="/print/dsa-sheet">
              DSA problem checklist ({PROBLEMS.length} — NeetCode 250 + CSES)
            </Link>
          </li>
          <li>
            <Link className="text-[var(--accent)] underline" to="/print/revision">
              Revision sheet (Tier 1 needing attention)
            </Link>
          </li>
          <li>
            <Link
              className="text-[var(--accent)] underline"
              to="/print/preview?sheet=interview&round=backend"
            >
              Backend interview quick revision
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
