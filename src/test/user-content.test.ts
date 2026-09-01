import { describe, expect, it } from 'vitest'
import {
  buildCustomTopicInput,
  customTopicToContent,
  customTopicToMeta,
  mergeOverlayIntoContent,
} from '@/domain/user-content'
import type { TopicContent } from '@/domain/types'

describe('user content overlays + custom topics', () => {
  it('builds custom topics with stable custom- ids', () => {
    const topic = buildCustomTopicInput({
      title: 'Company X Notes',
      track: 'C',
      keyTakeaways: ['Know their stack'],
      quickRevision: ['Auth flow'],
    })
    expect(topic.id.startsWith('custom-')).toBe(true)
    expect(customTopicToMeta(topic).contentReady).toBe(true)
    expect(customTopicToMeta(topic).track).toBe('C')
    const content = customTopicToContent(topic)
    expect(content.keyTakeaways).toContain('Know their stack')
  })

  it('merges overlay points onto curriculum content', () => {
    const base: TopicContent = {
      keyTakeaways: ['canonical'],
      quickRevision: ['rev'],
      flashcards: [{ front: 'a', back: 'b' }],
      interviewQuestions: [{ level: 'basic', question: 'q?' }],
    }
    const merged = mergeOverlayIntoContent(base, {
      keyTakeaways: ['mine'],
      extraPoints: ['x'],
    })
    expect(merged.keyTakeaways).toEqual(['canonical', 'mine'])
    expect(merged.quickRevision).toEqual(['rev'])
  })
})
