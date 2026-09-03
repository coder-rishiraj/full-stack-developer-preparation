import { describe, expect, it } from 'vitest'
import { PROBLEMS } from '@/content/problems'
import { TOPICS } from '@/content/taxonomy'
import {
  getReadyTopicIds,
  getTopicContentSync,
  preloadAllTopicContent,
} from '@/content/topics'
import { searchAll } from '@/lib/search'
import {
  buildQcReport,
  summarizeByCode,
} from '@/domain/qc'

describe('Phase 5 quality control', () => {
  it('passes hard DoD checks across curriculum, content, and DSA links', async () => {
    await preloadAllTopicContent()
    const contentIds = getReadyTopicIds()
    const contentById: Record<string, ReturnType<typeof getTopicContentSync>> = {}
    for (const id of contentIds) {
      contentById[id] = getTopicContentSync(id)
    }

    const report = buildQcReport({
      topics: TOPICS,
      contentById,
      contentIds,
      problems: PROBLEMS,
    })

    const errorSummary = summarizeByCode(report.errors)
    if (report.errors.length) {
      const sample = report.errors
        .slice(0, 25)
        .map((e) => `${e.code}${e.topicId ? `@${e.topicId}` : ''}: ${e.message}`)
        .join('\n')
      expect.fail(
        `${report.errors.length} QC errors\n${JSON.stringify(errorSummary, null, 2)}\n\n${sample}`,
      )
    }

    const warnSummary = summarizeByCode(report.warnings)
    if (report.warnings.length) {
      const sample = report.warnings
        .slice(0, 25)
        .map((w) => `${w.code}${w.topicId ? `@${w.topicId}` : ''}: ${w.message}`)
        .join('\n')
      expect.fail(
        `${report.warnings.length} QC warnings\n${JSON.stringify(warnSummary, null, 2)}\n\n${sample}`,
      )
    }

    expect(report.topicCount).toBe(TOPICS.length)
    expect(report.classifiedCount).toBe(1281)
    expect(report.nestedConceptCount).toBe(3380)
    expect(report.contentCount).toBe(TOPICS.length)
    expect(report.errors).toHaveLength(0)
    expect(report.warnings).toHaveLength(0)
  })

  it('search finds topics and problems', () => {
    const topicHits = searchAll('sliding window')
    expect(topicHits.some((h) => h.type === 'topic' && h.topic === 'a2-sliding-window')).toBe(
      true,
    )
    const problemHits = searchAll('two sum')
    expect(problemHits.some((h) => h.type === 'problem')).toBe(true)
    expect(searchAll('rate limiter').length).toBeGreaterThan(0)
  })

  it('every topic has navigation metadata', () => {
    for (const t of TOPICS) {
      expect(t.track, t.id).toMatch(/^[ABCDE]$/)
      expect(t.sectionId, t.id).toBeTruthy()
      expect(t.priority, t.id).toMatch(/^tier[123]$/)
      expect(t.targetMonths.length, t.id).toBeGreaterThan(0)
      expect(t.contentReady, t.id).toBe(true)
    }
  })
})
