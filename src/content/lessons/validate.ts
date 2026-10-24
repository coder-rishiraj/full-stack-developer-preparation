import { collectTopicLinks, parseLesson, type ParsedLesson } from '@/lib/lesson-markdown'
import type { TopicMeta } from '@/domain/types'

export type LessonCheckContext = {
  getTopic: (id: string) => TopicMeta | undefined
  childrenOf: (id: string) => TopicMeta[]
  hasOwnLesson: (id: string) => boolean
}

export type LessonCheck = {
  id: string
  parsed: ParsedLesson
  errors: string[]
  warnings: string[]
  /** Nested concept ids taught under an explicit anchor in this lesson. */
  concepts: string[]
}

/** Minimum prose for a lesson to count as a lesson rather than notes. */
export const MIN_WORDS_CLASSIFIED = 900
export const MIN_WORDS_NESTED = 300

export function checkLesson(id: string, source: string, ctx: LessonCheckContext): LessonCheck {
  const parsed = parseLesson(source)
  const errors = [...parsed.issues]
  const warnings: string[] = []
  const meta = ctx.getTopic(id)
  const fm = parsed.frontmatter

  if (!meta) errors.push(`"${id}" is not a curriculum topic id (file name must equal the topic id)`)

  if (!fm.summary || String(fm.summary).length < 60) errors.push('frontmatter: summary missing or shorter than 60 characters')
  if (!fm.difficulty || !['beginner', 'intermediate', 'advanced'].includes(String(fm.difficulty))) {
    errors.push('frontmatter: difficulty must be beginner | intermediate | advanced')
  }
  if (typeof fm.minutes !== 'number' || fm.minutes < 5 || fm.minutes > 240) errors.push('frontmatter: minutes must be a number between 5 and 240')
  if (!Array.isArray(fm.objectives) || fm.objectives.length < 3) errors.push('frontmatter: objectives needs at least 3 items')

  for (const link of new Set(collectTopicLinks(parsed.blocks))) {
    if (!ctx.getTopic(link)) errors.push(`broken topic link [[${link}]]`)
  }

  const anchors = new Set(parsed.blocks.filter((b) => b.type === 'heading' && b.explicitId).map((b) => (b as { id: string }).id))
  const concepts: string[] = []
  for (const a of anchors) {
    const t = ctx.getTopic(a)
    if (t && t.id !== id) concepts.push(a)
  }

  const classified = meta?.curriculumLevel === 'classified-item'
  if (meta && classified) {
    for (const child of ctx.childrenOf(id)) {
      if (!anchors.has(child.id) && !ctx.hasOwnLesson(child.id)) {
        errors.push(`nested concept "${child.title}" needs a heading anchored {#${child.id}}`)
      }
    }
  }

  const ids = new Set(parsed.outline.map((o) => o.id))
  if (classified) {
    if (!ids.has('key-takeaways')) errors.push('missing "## Key takeaways {#key-takeaways}" section')
    if (!ids.has('quick-revision')) errors.push('missing "## Quick revision {#quick-revision}" section')
    if (!parsed.blocks.some((b) => b.type === 'quiz')) errors.push('add at least one ```quiz knowledge check')
  }

  const min = classified ? MIN_WORDS_CLASSIFIED : MIN_WORDS_NESTED
  if (parsed.wordCount < min) errors.push(`only ${parsed.wordCount} words — a lesson needs at least ${min}`)

  if (!parsed.blocks.some((b) => b.type === 'code' || b.type === 'table' || b.type === 'mermaid')) {
    warnings.push('no code, table or diagram — check whether an example would help')
  }

  return { id, parsed, errors, warnings, concepts }
}
