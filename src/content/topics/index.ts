import type { TopicContent } from '@/domain/types'
import type { SectionSeed } from '@/content/curriculum/build'
import { TRACK_C_BOOT_SECTIONS } from '@/content/curriculum/track-c-boot'
import { TRACK_C_CONCURRENCY_SECTIONS } from '@/content/curriculum/track-c-concurrency'
import { TRACK_C_JVM_SECTIONS } from '@/content/curriculum/track-c-jvm'
import { TRACK_C_NETWORKING_SECTIONS } from '@/content/curriculum/track-c-networking'
import { TRACK_C_SQL_SECTIONS } from '@/content/curriculum/track-c-sql'
import { TRACK_C_SPRING_SECTIONS } from '@/content/curriculum/track-c-spring'
import { TRACK_C_JAVA_SECTIONS } from '@/content/curriculum/track-c-java'
import { TRACK_B_CSS_SECTIONS } from '@/content/curriculum/track-b-css'
import { TRACK_B_FSD_SECTIONS } from '@/content/curriculum/track-b-fsd'
import { TRACK_B_REACT_SECTIONS } from '@/content/curriculum/track-b-react'
import { createConcurrencyTopicContent } from './_concurrency-topic-factory'
import { createBootTopicContent } from './_boot-topic-factory'
import { createCssTopicContent } from './_css-topic-factory'
import { createFsdTopicContent } from './_fsd-topic-factory'
import { createJavaTopicContent } from './_java-topic-factory'
import { createJvmTopicContent } from './_jvm-topic-factory'
import { createNetworkingTopicContent } from './_networking-topic-factory'
import { createSqlTopicContent } from './_sql-topic-factory'
import { createSpringTopicContent } from './_spring-topic-factory'
import { createReactTopicContent } from './_react-topic-factory'

type ContentModule = { content?: TopicContent }

/**
 * Lazy loaders — filename (without .ts) must equal the topic id.
 * Avoids shipping every deep note in the main bundle.
 */
const loaders = import.meta.glob<ContentModule>('./*.ts')

const LOADER_BY_ID: Record<string, () => Promise<ContentModule>> = {}

for (const [path, loader] of Object.entries(loaders)) {
  const match = path.match(/\.\/([^/]+)\.ts$/)
  if (!match) continue
  const id = match[1]
  if (id.startsWith('_') || id === 'index') continue
  LOADER_BY_ID[id] = loader as () => Promise<ContentModule>
}

/*
 * The expanded React curriculum keeps hand-authored modules for its original
 * deep topics and supplies a QC-complete study scaffold for every new atomic
 * node. A node can later graduate to a dedicated `b4-*.ts` module without
 * changing taxonomy or routing; glob-loaded modules always take precedence.
 */
function registerGeneratedLoaders(
  sections: SectionSeed[],
  createContent: (input: {
    title: string
    sectionTitle: string
    parentTitle?: string
  }) => TopicContent,
) {
  for (const section of sections) {
    const titleById = new Map(section.topics.map((topic) => [topic.id, topic.title]))
    for (const topic of section.topics) {
      if (LOADER_BY_ID[topic.id]) continue
      LOADER_BY_ID[topic.id] = async () => ({
        content: createContent({
          title: topic.title,
          sectionTitle: section.title,
          parentTitle: topic.parentTopicId
            ? titleById.get(topic.parentTopicId)
            : undefined,
        }),
      })
    }
  }
}

registerGeneratedLoaders(TRACK_B_REACT_SECTIONS, createReactTopicContent)
registerGeneratedLoaders(TRACK_B_CSS_SECTIONS, createCssTopicContent)
registerGeneratedLoaders(TRACK_B_FSD_SECTIONS, createFsdTopicContent)
registerGeneratedLoaders(TRACK_C_JAVA_SECTIONS, createJavaTopicContent)
registerGeneratedLoaders(TRACK_C_JVM_SECTIONS, createJvmTopicContent)
registerGeneratedLoaders(TRACK_C_CONCURRENCY_SECTIONS, createConcurrencyTopicContent)
registerGeneratedLoaders(TRACK_C_NETWORKING_SECTIONS, createNetworkingTopicContent)
registerGeneratedLoaders(TRACK_C_SPRING_SECTIONS, createSpringTopicContent)
registerGeneratedLoaders(TRACK_C_BOOT_SECTIONS, createBootTopicContent)
registerGeneratedLoaders(TRACK_C_SQL_SECTIONS, createSqlTopicContent)

const CACHE: Record<string, TopicContent> = {}

export function getReadyTopicIds(): string[] {
  return Object.keys(LOADER_BY_ID).sort()
}

export function hasTopicContent(topicId: string): boolean {
  return topicId in LOADER_BY_ID
}

export async function loadTopicContent(
  topicId: string,
): Promise<TopicContent | undefined> {
  if (CACHE[topicId]) return CACHE[topicId]
  const loader = LOADER_BY_ID[topicId]
  if (!loader) return undefined
  const mod = await loader()
  if (!mod.content) return undefined
  CACHE[topicId] = mod.content
  return mod.content
}

/** Returns cached content only — call `loadTopicContent` first on UI routes. */
export function getTopicContentSync(topicId: string): TopicContent | undefined {
  return CACHE[topicId]
}

/** Used by tests / print batch jobs to warm the cache. */
export async function preloadAllTopicContent(): Promise<void> {
  await Promise.all(Object.keys(LOADER_BY_ID).map((id) => loadTopicContent(id)))
}
