import type { TopicContent } from '@/domain/types'

/**
 * Phase 4 content files export `content` + optional helpers.
 * Keep notes interview-dense: correct, concrete, no filler essays.
 */
export type TopicContentModule = {
  content: TopicContent
}

/** Minimal required surface every deep topic must fill. */
export function assertDeepContent(c: TopicContent): TopicContent {
  if (!c.keyTakeaways?.length) throw new Error('keyTakeaways required')
  if (!c.quickRevision?.length) throw new Error('quickRevision required')
  if (!c.flashcards?.length) throw new Error('flashcards required')
  if (!c.interviewQuestions?.length) throw new Error('interviewQuestions required')
  return c
}
