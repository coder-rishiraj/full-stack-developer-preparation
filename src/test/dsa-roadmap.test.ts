import { describe, expect, test } from 'vitest'
import { PROBLEMS, PROBLEMS_IN_ROADMAP_ORDER, ROADMAP, ROADMAP_TOPICS } from '@/content/problems'

describe('DSA roadmap', () => {
  test('places every problem exactly once, with orders 1..n', () => {
    const ids = new Set(PROBLEMS.map((p) => p.id))
    expect(Object.keys(ROADMAP).sort()).toEqual([...ids].sort())
    const orders = Object.values(ROADMAP).map((e) => e.order).sort((a, b) => a - b)
    expect(orders).toEqual(Array.from({ length: PROBLEMS.length }, (_, i) => i + 1))
  })

  test('every entry names a known topic and one of its groups', () => {
    const topics = new Map(ROADMAP_TOPICS.map((t) => [t.id, t]))
    for (const [id, e] of Object.entries(ROADMAP)) {
      const t = topics.get(e.topicId)
      expect(t, id).toBeDefined()
      expect(t!.groups, id).toContain(e.group)
      expect(e.score).toBeGreaterThanOrEqual(1)
      expect(e.score).toBeLessThanOrEqual(10)
      expect(e.tier === 'challenge').toBe(e.score >= 6)
    }
  })

  test('roadmap order runs topic by topic, Core before Challenge, groups contiguous and easy to hard', () => {
    const topicOrder = new Map(ROADMAP_TOPICS.map((t) => [t.id, t.order]))
    const seenGroups = new Set<string>()
    let prev: (typeof ROADMAP)[string] | undefined
    for (const p of PROBLEMS_IN_ROADMAP_ORDER) {
      const e = ROADMAP[p.id]
      const key = `${e.topicId}|${e.tier}|${e.group}`
      if (prev) {
        const prevKey = `${prev.topicId}|${prev.tier}|${prev.group}`
        expect(topicOrder.get(e.topicId)!).toBeGreaterThanOrEqual(topicOrder.get(prev.topicId)!)
        if (e.topicId === prev.topicId && prev.tier === 'challenge') expect(e.tier).toBe('challenge')
        if (key === prevKey) expect(e.score).toBeGreaterThanOrEqual(prev.score)
        else expect(seenGroups.has(key), `group ${key} is split`).toBe(false)
      }
      seenGroups.add(key)
      prev = e
    }
  })
})
