import { describe, expect, it } from 'vitest'
import {
  buildCustomTopicInput,
  customTopicToContent,
  customTopicToMeta,
  mergeOverlayIntoContent,
} from '@/domain/user-content'
import type { TopicContent } from '@/domain/types'

describe('user content overlays + custom topics', () => {
  it('builds custom topics with stable custom- ids and section attachment', () => {
    const topic = buildCustomTopicInput({
      title: 'Company X Notes',
      track: 'C',
      sectionId: 'C7.1',
      sectionTitle: 'C7.1 — Relational & PostgreSQL Foundations',
      keyTakeaways: ['Know their stack'],
      quickRevision: ['Auth flow'],
    })
    expect(topic.id.startsWith('custom-')).toBe(true)
    expect(topic.sectionId).toBe('C7.1')
    expect(customTopicToMeta(topic).contentReady).toBe(true)
    expect(customTopicToMeta(topic).track).toBe('C')
    expect(customTopicToMeta(topic).sectionId).toBe('C7.1')
    const content = customTopicToContent(topic)
    expect(content.keyTakeaways).toContain('Know their stack')
  })

  it('creates custom section ids under a track', () => {
    const topic = buildCustomTopicInput({
      title: 'First note',
      track: 'B',
      sectionId: 'CUSTOM-B-company-x',
      sectionTitle: 'Company X',
    })
    expect(customTopicToMeta(topic).sectionId).toBe('CUSTOM-B-company-x')
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
