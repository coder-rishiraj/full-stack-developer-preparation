import { describe, expect, it } from 'vitest'
import { LESSON_PROBLEMS, PROBLEMS, getLessonProblems } from '@/content/problems'
import { hasLesson, lessonIds } from '@/content/lessons'

const PROBLEM_IDS = new Set(PROBLEMS.map((p) => p.id))
const TRACK_A_LESSONS = lessonIds().filter((id) => /^a\d+-/.test(id))

describe('lesson practice problems', () => {
  it('only references problems on the DSA problems page', () => {
    const unknown = Object.entries(LESSON_PROBLEMS).flatMap(([lesson, ids]) =>
      ids.filter((id) => !PROBLEM_IDS.has(id)).map((id) => `${lesson}: ${id}`),
    )
    expect(unknown).toEqual([])
  })

  it('has no duplicate problems within a lesson', () => {
    for (const [lesson, ids] of Object.entries(LESSON_PROBLEMS)) {
      expect(new Set(ids).size, lesson).toBe(ids.length)
    }
  })

  it('maps only to Track A topics that have a lesson', () => {
    expect(Object.keys(LESSON_PROBLEMS).filter((id) => !/^a\d+-/.test(id) || !hasLesson(id))).toEqual([])
  })

  it('gives every Track A lesson at least two problems', () => {
    expect(TRACK_A_LESSONS.length).toBeGreaterThan(100)
    expect(TRACK_A_LESSONS.filter((id) => getLessonProblems(id).length < 2)).toEqual([])
  })
})
