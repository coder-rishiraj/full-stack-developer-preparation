import type { MdBlock } from '@/lib/lesson-markdown'

export type OutlineItem = { id: string; level: 2 | 3 | 4; text: string }

/** Lesson sections that make up the revision sheet. */
export const REVISION_IDS = new Set(['quick-revision', 'cheat-sheet', 'key-takeaways', 'revision-notes'])

export function outlineOf(blocks: MdBlock[]): OutlineItem[] {
  return blocks
    .filter((b): b is Extract<MdBlock, { type: 'heading' }> => b.type === 'heading')
    .map((b) => ({ id: b.id, level: b.level, text: b.text.replace(/[*`]/g, '') }))
}

/** The revision sections of a lesson, followed by every quiz as a self-check. */
export function revisionBlocks(source: MdBlock[]): MdBlock[] {
  const out: MdBlock[] = []
  let take = false
  let takeLevel = 2
  for (const b of source) {
    if (b.type === 'heading') {
      if (REVISION_IDS.has(b.id)) {
        take = true
        takeLevel = b.level
        out.push(b)
        continue
      }
      if (b.level <= takeLevel) take = false
    }
    if (take) out.push(b)
  }
  const quizzes = source.filter((b) => b.type === 'quiz')
  if (quizzes.length) {
    out.push({ type: 'heading', level: 2, id: 'self-check', text: 'Self-check', inline: [{ t: 'text', v: 'Self-check' }], explicitId: true })
    out.push(...quizzes)
  }
  return out
}

/** Removes block kinds the reader chose to leave out of a printout. */
export function filterBlocks(blocks: MdBlock[], opts: { code: boolean; diagrams: boolean; quizzes: boolean }): MdBlock[] {
  return blocks.filter((b) => {
    if (b.type === 'code') return opts.code
    if (b.type === 'mermaid') return opts.diagrams
    if (b.type === 'quiz') return opts.quizzes
    return true
  })
}
