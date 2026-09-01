#!/usr/bin/env node
import { createServer } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' })

try {
  const { TOPICS, SECTIONS, curriculumStats } = await server.ssrLoadModule('/src/content/taxonomy.ts')
  const stats = curriculumStats()
  console.log('stats', JSON.stringify(stats))

  const counts = {}
  for (const s of SECTIONS) {
    const topics = TOPICS.filter(
      (t) => t.sectionId === s.id && t.curriculumLevel === 'classified-item',
    )
    counts[s.id] = ['tier1', 'tier2', 'tier3'].map((p) =>
      topics.filter((t) => t.priority === p).length,
    )
  }

  const lines = Object.entries(counts)
    .sort(([a], [b]) => {
      const parse = (id) => {
        const m = id.match(/^([A-Z]\d+)(?:\.(\d+))?$/)
        if (!m) return [id, 0]
        return [m[1], Number(m[2] ?? 0)]
      }
      const [pa, sa] = parse(a)
      const [pb, sb] = parse(b)
      if (pa !== pb) return pa.localeCompare(pb, undefined, { numeric: true })
      return sa - sb
    })
    .map(([id, c]) => `  '${id}': [${c.join(', ')}],`)

  console.log('\n' + lines.join('\n'))
} finally {
  await server.close()
}
