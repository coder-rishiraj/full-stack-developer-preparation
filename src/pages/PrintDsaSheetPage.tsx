import { PROBLEMS } from '@/content/problems'
import { Button } from '@/components/ui/Button'
import { useUserStore } from '@/stores/user-store'
import type { DsaStatus } from '@/domain/types'

export function PrintDsaSheetPage() {
  const problems = useUserStore((s) => s.problems)

  return (
    <div className="print-surface mx-auto max-w-5xl px-4 py-6">
      <div className="print-hidden mb-4 flex gap-2" data-screen-only>
        <Button variant="primary" onClick={() => window.print()}>
          Print checklist
        </Button>
      </div>
      <div className="print-header">SE Prep · DSA Checklist · NeetCode 250 + CSES</div>
      <h1 className="print-topic-title">DSA Problem Checklist ({PROBLEMS.length})</h1>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            {['Done', 'Problem', 'Source', 'Category', 'Pattern', 'Difficulty', 'R1', 'R2', 'R3'].map(
              (h) => (
                <th key={h} className="border border-neutral-400 px-1.5 py-1 text-left">
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {PROBLEMS.map((p) => {
            const st = (problems[p.id]?.status ?? 'not_attempted') as DsaStatus
            const done =
              st === 'solved_independently' || st === 'solved_with_hint' || st === 'mastered'
            return (
              <tr key={p.id} className="print-avoid-break">
                <td className="border border-neutral-400 px-1.5 py-1">{done ? '☑' : '☐'}</td>
                <td className="border border-neutral-400 px-1.5 py-1">{p.name}</td>
                <td className="border border-neutral-400 px-1.5 py-1">{p.source}</td>
                <td className="border border-neutral-400 px-1.5 py-1">{p.category}</td>
                <td className="border border-neutral-400 px-1.5 py-1">{p.primaryPattern}</td>
                <td className="border border-neutral-400 px-1.5 py-1">{p.difficulty}</td>
                <td className="border border-neutral-400 px-1.5 py-1">☐</td>
                <td className="border border-neutral-400 px-1.5 py-1">☐</td>
                <td className="border border-neutral-400 px-1.5 py-1">☐</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
