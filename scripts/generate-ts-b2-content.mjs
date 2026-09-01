#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { FACTS } from './ts-b2-facts.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, 'src/content/topics')
const TS_CURRICULUM = path.join(ROOT, 'src/content/curriculum/track-b-typescript.ts')

function parseCurriculum() {
  const src = fs.readFileSync(TS_CURRICULUM, 'utf8')
  const topics = []
  let section = ''
  for (const line of src.split('\n')) {
    const sec = line.match(/section\('([^']+)', '([^']+)'/)
    if (sec) section = `${sec[1]} — ${sec[2]}`
    const item = line.match(/^\s*item\('([^']+)', '([^']+)'/)
    if (item) topics.push({ id: item[1], title: item[2], section })
    const nest = line.match(/^\s*nest\('[^']+', '([^']+)', '([^']+)'/)
    if (nest) topics.push({ id: nest[1], title: nest[2], section })
  }
  return topics
}

function render(id, title, section, f) {
  const takeaways = [
    f.how[0],
    f.how[1] ?? `${title} is core TypeScript for frontend interviews.`,
    f.pitfall,
    f.internals[0],
  ]
  const revision = [
    `${title}: ${f.model}`,
    ...f.how.slice(0, 3),
    `Trap: ${f.pitfall}`,
  ]
  const flashcards = [
    [title, f.what.split(/(?<=\.)\s/)[0]],
    ['Mental model', f.model],
    ['Common trap', f.pitfall],
    [f.how[0].slice(0, 80), f.how[1] ?? f.internals[0]],
  ]
  const questions = [
    {
      level: 'basic',
      question: `What is ${title} in TypeScript and when do you use it?`,
      answerHint: f.what,
    },
    {
      level: 'intermediate',
      question: `Explain ${title} with a code example and one pitfall.`,
      answerHint: `${f.how.join(' ')} Pitfall: ${f.pitfall}`,
    },
    {
      level: 'advanced',
      question: `How would you explain ${title} in a senior frontend interview?`,
      answerHint: `${f.internals.join(' ')} ${f.code.slice(0, 120)}`,
    },
  ]
  const input = {
    title,
    whatIsIt: f.what,
    whyExists: f.why,
    mentalModel: f.model,
    how: f.how,
    callout: { title: 'Watch for', text: f.pitfall, variant: 'warning' },
    example: f.code,
    exampleCaption: f.caption,
    internals: f.internals,
    takeaways,
    revision,
    flashcards,
    questions,
    pitfalls: [f.pitfall],
    interview: {
      expectations: [
        `Explain ${title} with a concrete TypeScript example.`,
        'Name the main compile-time vs runtime boundary.',
        f.internals[0],
      ],
      commonQuestions: [
        `What is ${title}?`,
        `When would you choose ${title} over alternatives?`,
        `What is the classic ${title} interview trap?`,
      ],
      traps: [f.pitfall],
      misconceptions: [f.why],
      strongSignals: [
        `Uses ${title} to remove invalid states, not just document them.`,
      ],
    },
  }

  return `import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic(${JSON.stringify(input, null, 2)})
`
}

const existing = new Set(
  fs
    .readdirSync(OUT)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => f.slice(0, -3)),
)

const topics = parseCurriculum()
const missingFacts = []
let written = 0
let skipped = 0

for (const topic of topics) {
  if (existing.has(topic.id)) {
    skipped++
    continue
  }
  const facts = FACTS[topic.id]
  if (!facts) {
    missingFacts.push(topic.id)
    continue
  }
  fs.writeFileSync(path.join(OUT, `${topic.id}.ts`), render(topic.id, topic.title, topic.section, facts))
  written++
}

if (missingFacts.length) {
  console.error('Missing FACTS for', missingFacts.join(', '))
  process.exit(1)
}

console.log(`generated ${written} topic files, skipped ${skipped} existing`)
