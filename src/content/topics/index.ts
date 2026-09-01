import type { TopicContent } from '@/domain/types'

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
