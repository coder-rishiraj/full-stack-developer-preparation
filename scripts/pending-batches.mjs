#!/usr/bin/env node
// Lists lesson batches that still have topics without a lesson file.
// Usage: node scripts/pending-batches.mjs [TRACK]   e.g. `node scripts/pending-batches.mjs B`
// Reads scripts/data/lesson-batches.json and docs/CURRICULUM_CHECKLIST.md (run `npm run lessons:sync` first).
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const batches = JSON.parse(readFileSync(join(root, 'scripts/data/lesson-batches.json'), 'utf8'))
const checklist = readFileSync(join(root, 'docs/CURRICULUM_CHECKLIST.md'), 'utf8').split('\n')
const track = process.argv[2]?.toUpperCase()

// A batch item with `ids: null` covers its whole module; read the module's ids from the checklist.
function moduleIds(moduleId) {
  const ids = []
  let inModule = false
  for (const line of checklist) {
    if (line.startsWith('#### ')) inModule = line.startsWith(`#### ${moduleId} `)
    else if (inModule) {
      const m = line.match(/^- \[.\] `([^`]+)`/)
      if (m) ids.push(m[1])
    }
  }
  return ids
}

let pending = 0
for (const batch of batches) {
  if (track && batch.track !== track) continue
  const ids = batch.items.flatMap((item) => item.ids ?? moduleIds(item.module))
  const missing = ids.filter((id) => !existsSync(join(root, 'src/content/lessons', `${id}.md`)))
  if (missing.length === 0) continue
  pending++
  const modules = batch.items.map((i) => i.module).join(', ')
  console.log(`batch ${batch.n} (track ${batch.track}; ${modules}): ${missing.length}/${ids.length} missing — ${missing.join(' ')}`)
}
console.log(`\n${pending} batch(es) pending${track ? ` in track ${track}` : ''}.`)
