import { Link } from 'react-router-dom'
import { getProblem } from '@/content/problems'
import { resolveTopicMeta } from '@/domain/user-content'
import { useUserStore } from '@/stores/user-store'

export function FavoritesPage() {
  const bookmarks = useUserStore((s) => s.bookmarks)
  const state = useUserStore()

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Favorites</h1>
        <p className="text-sm text-[var(--text-muted)]">Bookmarked topics and problems.</p>
      </div>
      {bookmarks.length === 0 ? (
        <p className="text-sm text-[var(--text-faint)]">No bookmarks yet.</p>
      ) : (
        <ul className="space-y-2">
          {bookmarks.map((id) => {
            const topic = resolveTopicMeta(state, id)
            const problem = getProblem(id)
            return (
              <li key={id} className="rounded-md border border-[var(--border)] px-3 py-2 text-sm">
                {topic && (
                  <Link className="text-[var(--accent)] hover:underline" to={`/topics/${id}`}>
                    Topic · {topic.title}
                    {id.startsWith('custom-') ? ' (custom)' : ''}
                  </Link>
                )}
                {problem && (
                  <Link className="text-[var(--accent)] hover:underline" to={`/dsa/${id}`}>
                    Problem · {problem.name}
                  </Link>
                )}
                {!topic && !problem && <span>{id}</span>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
