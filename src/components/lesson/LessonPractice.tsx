import { Link } from 'react-router-dom'
import { getLessonProblems, ROADMAP, ROADMAP_LEVELS, type RoadmapLevel } from '@/content/problems'
import { hasProblemPage } from '@/content/problem-pages'
import { DsaStatusBadge } from '@/components/ui/Badge'
import type { DsaStatus } from '@/domain/types'
import { useUserStore } from '@/stores/user-store'

const LEVEL_LABEL = Object.fromEntries(ROADMAP_LEVELS.map((l) => [l.id, l.label])) as Record<RoadmapLevel, string>
const LEVEL_COLOR: Record<RoadmapLevel, string> = {
  beginner: 'text-[var(--success)]',
  easy: 'text-[var(--success)]',
  medium: 'text-[var(--warning)]',
  hard: 'text-[var(--danger)]',
  'very-hard': 'text-[var(--danger)]',
}
export const PRACTICE_HEADING_ID = 'lesson-practice-problems'

const SOURCE_LABEL = { neetcode250: 'NeetCode', cses: 'CSES' } as const

/** Linked list of DSA-page problems that practise this lesson, easiest first. */
export function LessonPractice({ topicId }: { topicId: string }) {
  const problemsState = useUserStore((s) => s.problems)
  const problems = getLessonProblems(topicId)
  if (problems.length === 0) return null
  return (
    <section className="mt-12" aria-labelledby={PRACTICE_HEADING_ID}>
      <h2 id={PRACTICE_HEADING_ID} className="text-lg font-semibold text-[var(--heading)]">
        Practice problems
      </h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        From the DSA problems page, in roadmap order. Each opens the problem page with its statement link and your status.
      </p>
      <ol className="mt-4 divide-y divide-[var(--border)] rounded-md border border-[var(--border)]">
        {problems.map((p, i) => {
          const entry = ROADMAP[p.id]
          const st = (problemsState[p.id]?.status ?? 'not_attempted') as DsaStatus
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm">
              <span className="w-5 shrink-0 tabular-nums text-[var(--text-faint)]">{i + 1}.</span>
              <Link to={`/dsa/${p.id}`} className="font-medium text-[var(--accent)] hover:underline">
                {p.name}
              </Link>
              {hasProblemPage(p.id) && (
                <span className="text-[10.5px] font-semibold uppercase text-[var(--accent)]">walkthrough</span>
              )}
              <span className="ml-auto flex items-center gap-3">
                <span className="text-xs text-[var(--text-faint)]">{SOURCE_LABEL[p.source]}</span>
                {entry && <span className={`whitespace-nowrap text-xs ${LEVEL_COLOR[entry.level]}`}>{LEVEL_LABEL[entry.level]}</span>}
                <DsaStatusBadge status={st} />
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
