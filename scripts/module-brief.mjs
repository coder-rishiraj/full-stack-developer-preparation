/**
 * Prints everything a lesson author needs for one curriculum module:
 * topics, nested concepts, prerequisites, related topics, existing notes files,
 * and neighbouring modules (for [[links]]).
 *
 * Usage: node scripts/module-brief.mjs <SECTION_ID> [topic-id ...]
 *        node scripts/module-brief.mjs --batch <N>   (a batch from scripts/data/lesson-batches.json)
 */
import { createServer } from 'vite'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
let jobs
if (argv[0] === '--batch') {
  const batches = JSON.parse(readFileSync(path.join(root, 'scripts/data/lesson-batches.json'), 'utf8'))
  const batch = batches.find((b) => b.n === Number(argv[1]))
  if (!batch) throw new Error(`No batch ${argv[1]}`)
  jobs = batch.items.map((it) => ({ sectionId: it.module, only: it.ids ?? [] }))
} else {
  jobs = [{ sectionId: argv[0], only: argv.slice(1) }]
}
if (!jobs[0].sectionId) {
  console.error('Usage: node scripts/module-brief.mjs <SECTION_ID> [topic-id ...]')
  process.exit(1)
}

const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { TOPICS, SECTIONS, getTrack } = await server.ssrLoadModule('/src/content/taxonomy.ts')
  const topicsMod = await server.ssrLoadModule('/src/content/topics/index.ts')
  for (const { sectionId, only } of jobs) {
  const section = SECTIONS.find((s) => s.id === sectionId)
  if (!section) throw new Error(`Unknown section ${sectionId}`)
  const track = getTrack(section.track)
  const trackSections = SECTIONS.filter((s) => s.track === section.track).sort((a, b) => a.order - b.order)
  const idx = trackSections.findIndex((s) => s.id === sectionId)
  const title = (id) => TOPICS.find((t) => t.id === id)?.title ?? '(unknown)'

  const out = []
  out.push(`# Module ${section.id} — ${section.title}`)
  out.push(`Track ${track.id}: ${track.name}`)
  out.push('')
  const classified = TOPICS.filter(
    (t) => t.sectionId === sectionId && t.curriculumLevel === 'classified-item' && (only.length === 0 || only.includes(t.id)),
  )
  out.push(`Write ${classified.length} lesson file(s): src/content/lessons/<id>.md`)
  out.push('')
  for (const t of classified) {
    const notes = `src/content/topics/${t.id}.ts`
    const content = await topicsMod.loadTopicContent(t.id)
    const notesInfo = existsSync(path.join(root, notes))
      ? `existing notes: ${notes}`
      : content?.generated
        ? 'existing notes: generic template only (ignore)'
        : topicsMod.hasTopicContent(t.id)
          ? 'existing notes: shared reference pack (graph handbook) — see src/content/topics/_graph-*.ts'
          : 'existing notes: none'
    out.push(`## ${t.id} — ${t.title}`)
    out.push(`priority ${t.priority} · depth ${t.estimatedDepth} · kind ${t.kind} · tags ${t.tags.join(', ')}`)
    out.push(notesInfo)
    if (t.prerequisites.length) out.push(`prerequisites: ${t.prerequisites.map((id) => `${id} (${title(id)})`).join('; ')}`)
    if (t.relatedTopics.length) out.push(`related: ${t.relatedTopics.map((id) => `${id} (${title(id)})`).join('; ')}`)
    if (t.nextTopics.length) out.push(`next: ${t.nextTopics.map((id) => `${id} (${title(id)})`).join('; ')}`)
    const kids = TOPICS.filter((k) => k.parentTopicId === t.id)
    if (kids.length) {
      out.push(`nested concepts — each needs a heading anchored {#id} inside this lesson:`)
      for (const k of kids) {
        const kn = existsSync(path.join(root, `src/content/topics/${k.id}.ts`)) ? `  (notes: src/content/topics/${k.id}.ts)` : ''
        out.push(`  - ${k.id} — ${k.title}${kn}`)
      }
    }
    out.push('')
  }
  const neighbours = [trackSections[idx - 1], trackSections[idx + 1]].filter(Boolean)
  for (const n of neighbours) {
    const ts = TOPICS.filter((t) => t.sectionId === n.id && t.curriculumLevel === 'classified-item')
    out.push(`Neighbouring module ${n.id} — ${n.title}: ${ts.map((t) => `${t.id} (${t.title})`).join('; ')}`)
  }
  console.log(out.join('\n') + '\n\n')
  }
} finally {
  await server.close()
}
