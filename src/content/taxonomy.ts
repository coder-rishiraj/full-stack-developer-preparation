import type {
  SectionInfo,
  TopicMeta,
  TrackInfo,
} from '@/domain/types'
import {
  CURRICULUM_SECTIONS,
  CURRICULUM_TOPICS,
  getSectionsByTrack,
  curriculumStats as rawCurriculumStats,
} from './curriculum'
import { hasTopicContent, getReadyTopicIds } from './topics'

export const TRACKS: TrackInfo[] = [
  {
    id: 'A',
    name: 'DSA & Problem Solving',
    shortName: 'DSA',
    description: 'Algorithms, patterns, and interview coding execution.',
    accent: 'var(--track-a)',
  },
  {
    id: 'B',
    name: 'Frontend Engineering',
    shortName: 'Frontend',
    description:
      'JavaScript language (beginner → interview), TypeScript, React, browser APIs.',
    accent: 'var(--track-b)',
  },
  {
    id: 'C',
    name: 'Java & Backend Engineering',
    shortName: 'Backend',
    description:
      'Java, Spring Boot, PostgreSQL, Redis, Kafka, Docker/DevOps, AWS, observability.',
    accent: 'var(--track-c)',
  },
  {
    id: 'D',
    name: 'LLD, System Design & Distributed Systems',
    shortName: 'System Design',
    description:
      'OOD, patterns, LLD, distributed systems, HLD method, and practice designs.',
    accent: 'var(--track-d)',
  },
  {
    id: 'E',
    name: 'Applied AI Engineering',
    shortName: 'Applied AI',
    description:
      'LLM APIs, prompting, RAG, agents/MCP, evals, production AI — months 9–12 after core is strong.',
    accent: 'var(--track-e)',
  },
]

export const SECTIONS: SectionInfo[] = CURRICULUM_SECTIONS

/** Curriculum meta with contentReady derived from Phase 4 topic modules. */
export const TOPICS: TopicMeta[] = CURRICULUM_TOPICS.map((t) => ({
  ...t,
  contentReady: hasTopicContent(t.id),
}))

export { getSectionsByTrack }

export function curriculumStats() {
  const base = rawCurriculumStats()
  return {
    ...base,
    contentReady: getReadyTopicIds().length,
  }
}

export function getTrack(id: string): TrackInfo | undefined {
  return TRACKS.find((t) => t.id === id)
}

export function getTopicMeta(id: string): TopicMeta | undefined {
  return TOPICS.find((t) => t.id === id)
}

export function getTopicsByTrack(trackId: string): TopicMeta[] {
  return TOPICS.filter((t) => t.track === trackId)
}

export function getTopicsByMonth(month: number): TopicMeta[] {
  return TOPICS.filter((t) => t.targetMonths.includes(month))
}

export function getTopicsBySection(sectionId: string): TopicMeta[] {
  return TOPICS.filter((t) => t.sectionId === sectionId)
}

export function getContentReadyTopics(): TopicMeta[] {
  return TOPICS.filter((t) => t.contentReady)
}

/** Previous/next within the same track (curriculum order). */
export function getTopicNeighbors(topicId: string): {
  prev?: TopicMeta
  next?: TopicMeta
} {
  const topic = getTopicMeta(topicId)
  if (!topic) return {}
  const trackTopics = getTopicsByTrack(topic.track)
  const idx = trackTopics.findIndex((t) => t.id === topicId)
  return {
    prev: idx > 0 ? trackTopics[idx - 1] : undefined,
    next: idx >= 0 && idx < trackTopics.length - 1 ? trackTopics[idx + 1] : undefined,
  }
}
