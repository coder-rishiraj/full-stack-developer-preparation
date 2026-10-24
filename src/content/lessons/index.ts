import { getTopicMeta } from '@/content/taxonomy'
import { extractSection, parseLesson, type MdBlock, type ParsedLesson } from '@/lib/lesson-markdown'
import manifestJson from './manifest.json'

/**
 * Full lessons live in `src/content/lessons/<topic-id>.md`.
 *
 * A classified topic owns one canonical lesson. Its nested concepts are taught
 * inside that lesson under an anchored heading (`## HashMap {#a1-hashmap}`), so
 * a nested topic page shows its own section without duplicating the text.
 * A nested concept may still get a dedicated file when it needs one; the
 * dedicated file always wins.
 */
const files = import.meta.glob<string>('./*.md', { query: '?raw', import: 'default' })

const LOADERS: Record<string, () => Promise<string>> = {}
for (const [path, loader] of Object.entries(files)) {
  const id = path.match(/\.\/([^/]+)\.md$/)?.[1]
  if (id) LOADERS[id] = loader
}

export type LessonManifestEntry = {
  title?: string
  summary?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  minutes?: number
  words: number
  /** Nested concept ids taught under an anchored heading in this lesson. */
  concepts: string[]
}

export const LESSON_MANIFEST = manifestJson as Record<string, LessonManifestEntry>

/** Nested concept id → the lesson id that teaches it. */
const CONCEPT_HOME: Record<string, string> = {}
for (const [lessonId, entry] of Object.entries(LESSON_MANIFEST)) {
  for (const c of entry.concepts) CONCEPT_HOME[c] ??= lessonId
}

export type ResolvedLesson = {
  /** Topic whose file holds the lesson (the parent for nested concepts). */
  lessonId: string
  lesson: ParsedLesson
  /** Set when the topic is a section inside its parent's lesson. */
  focus?: { anchor: string; blocks: MdBlock[] }
}

const CACHE = new Map<string, ParsedLesson>()

async function loadParsed(id: string): Promise<ParsedLesson | undefined> {
  const hit = CACHE.get(id)
  if (hit) return hit
  const loader = LOADERS[id]
  if (!loader) return undefined
  const parsed = parseLesson(await loader())
  CACHE.set(id, parsed)
  return parsed
}

function lessonHomeFor(topicId: string): string | undefined {
  if (LOADERS[topicId]) return topicId
  if (CONCEPT_HOME[topicId] && LOADERS[CONCEPT_HOME[topicId]]) return CONCEPT_HOME[topicId]
  // Fall back to the parent chain even when the manifest is stale.
  let meta = getTopicMeta(topicId)
  const seen = new Set<string>()
  while (meta?.parentTopicId && !seen.has(meta.parentTopicId)) {
    seen.add(meta.parentTopicId)
    if (LOADERS[meta.parentTopicId]) return meta.parentTopicId
    meta = getTopicMeta(meta.parentTopicId)
  }
  return undefined
}

/** True when the topic has a lesson of its own or a section in its parent's lesson. */
export function hasLesson(topicId: string): boolean {
  if (LOADERS[topicId]) return true
  const home = CONCEPT_HOME[topicId]
  return Boolean(home && LOADERS[home])
}

export function lessonInfo(topicId: string): LessonManifestEntry | undefined {
  return LESSON_MANIFEST[topicId] ?? (CONCEPT_HOME[topicId] ? LESSON_MANIFEST[CONCEPT_HOME[topicId]] : undefined)
}

export async function loadLesson(topicId: string): Promise<ResolvedLesson | undefined> {
  const home = lessonHomeFor(topicId)
  if (!home) return undefined
  const lesson = await loadParsed(home)
  if (!lesson) return undefined
  if (home === topicId) return { lessonId: home, lesson }
  const section = extractSection(lesson.blocks, topicId)
  if (!section) return undefined
  return { lessonId: home, lesson, focus: { anchor: topicId, blocks: section } }
}

export function lessonIds(): string[] {
  return Object.keys(LOADERS).sort()
}
