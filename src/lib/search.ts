import MiniSearch from 'minisearch'
import { TOPICS } from '@/content/taxonomy'
import { PROBLEMS } from '@/content/problems'
import type { CustomTopic } from '@/domain/types'

export type SearchHit = {
  id: string
  type: 'topic' | 'problem' | 'flashcard'
  title: string
  track?: string
  topic?: string
  tier?: string
  executionPriority?: string
  context: string
}

type Doc = {
  id: string
  type: SearchHit['type']
  title: string
  track: string
  topic: string
  tier: string
  executionPriority: string
  body: string
}

let index: MiniSearch<Doc> | null = null
let indexKey = ''

function buildDocs(customTopics: CustomTopic[]): Doc[] {
  const docs: Doc[] = []

  for (const t of TOPICS) {
    const body = [t.title, t.sectionTitle, ...t.tags, t.contentReady ? 'notes-ready' : ''].join(
      ' ',
    )
    docs.push({
      id: `topic:${t.id}`,
      type: 'topic',
      title: t.title,
      track: t.track,
      topic: t.id,
      tier: t.priority,
      executionPriority: t.executionPriority,
      body: `${body} ${t.executionPriority}`,
    })
  }

  for (const t of customTopics) {
    const body = [
      t.title,
      t.sectionTitle,
      ...t.tags,
      'custom',
      t.whatIsIt ?? '',
      ...t.keyTakeaways,
      ...t.quickRevision,
    ].join(' ')
    docs.push({
      id: `topic:${t.id}`,
      type: 'topic',
      title: t.title,
      track: t.track,
      topic: t.id,
      tier: t.priority,
      executionPriority: t.executionPriority,
      body: `${body} ${t.executionPriority}`,
    })
  }

  for (const p of PROBLEMS) {
    docs.push({
      id: `problem:${p.id}`,
      type: 'problem',
      title: p.name,
      track: 'A',
      topic: p.primaryTopic,
      tier: p.priority,
      executionPriority: '',
      body: `${p.name} ${p.category} ${p.primaryPattern} ${p.secondaryPatterns.join(' ')} ${p.source}`,
    })
  }

  return docs
}

function getSearchIndex(customTopics: CustomTopic[] = []): MiniSearch<Doc> {
  const key = customTopics
    .map((t) => `${t.id}:${t.updatedAt}`)
    .sort()
    .join('|')
  if (!index || indexKey !== key) {
    index = new MiniSearch({
      fields: ['title', 'body'],
      storeFields: [
        'type',
        'title',
        'track',
        'topic',
        'tier',
        'executionPriority',
        'body',
      ],
      searchOptions: { boost: { title: 3 }, fuzzy: 0.2, prefix: true },
    })
    index.addAll(buildDocs(customTopics))
    indexKey = key
  }
  return index
}

export function searchAll(
  query: string,
  limit = 30,
  customTopics: CustomTopic[] = [],
): SearchHit[] {
  const q = query.trim()
  if (!q) return []
  const results = getSearchIndex(customTopics).search(q)
  return results.slice(0, limit).map((r) => {
    const body = String(r.body ?? '')
    const idx = body.toLowerCase().indexOf(q.toLowerCase())
    const context =
      idx >= 0
        ? body.slice(Math.max(0, idx - 40), idx + q.length + 60)
        : body.slice(0, 100)
    return {
      id: String(r.id),
      type: r.type as SearchHit['type'],
      title: String(r.title),
      track: String(r.track),
      topic: String(r.topic),
      tier: String(r.tier),
      executionPriority: String(r.executionPriority ?? ''),
      context,
    }
  })
}
