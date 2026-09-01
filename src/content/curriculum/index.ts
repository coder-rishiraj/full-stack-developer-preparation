import type { SectionInfo, TopicMeta } from '@/domain/types'
import { expandSections, type SectionSeed } from './build'
import { TRACK_A_SECTIONS } from './track-a'
import { TRACK_B_SECTIONS } from './track-b'
import { TRACK_C_SECTIONS } from './track-c'
import { TRACK_D_SECTIONS } from './track-d'
import { TRACK_E_SECTIONS } from './track-e'

export const ALL_SECTION_SEEDS: SectionSeed[] = [
  ...TRACK_A_SECTIONS,
  ...TRACK_B_SECTIONS,
  ...TRACK_C_SECTIONS,
  ...TRACK_D_SECTIONS,
  ...TRACK_E_SECTIONS,
]

export const CURRICULUM_SECTIONS: SectionInfo[] = ALL_SECTION_SEEDS.map((s) => ({
  id: s.id,
  track: s.track,
  title: s.title,
  order: s.order,
}))

export const CURRICULUM_TOPICS: TopicMeta[] = expandSections(ALL_SECTION_SEEDS)

export function getSectionsByTrack(trackId: string): SectionInfo[] {
  return CURRICULUM_SECTIONS.filter((s) => s.track === trackId).sort(
    (a, b) => a.order - b.order,
  )
}

export function curriculumStats() {
  const byTrack: Record<string, number> = {}
  const byTier: Record<string, number> = { tier1: 0, tier2: 0, tier3: 0 }
  let contentReady = 0
  for (const t of CURRICULUM_TOPICS) {
    if (t.curriculumLevel === 'classified-item') {
      byTrack[t.track] = (byTrack[t.track] ?? 0) + 1
      byTier[t.priority]++
    }
    if (t.contentReady) contentReady++
  }
  const classified = CURRICULUM_TOPICS.filter(
    (topic) => topic.curriculumLevel === 'classified-item',
  )
  return {
    total: classified.length,
    concepts: CURRICULUM_TOPICS.length,
    nestedConcepts: CURRICULUM_TOPICS.length - classified.length,
    sections: CURRICULUM_SECTIONS.length,
    byTrack,
    byTier,
    contentReady,
  }
}
