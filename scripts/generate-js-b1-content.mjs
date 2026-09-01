#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { FACTS } from './js-b1-facts.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, 'src/content/topics')
const JS_CURRICULUM = path.join(ROOT, 'src/content/curriculum/track-b-javascript.ts')

function parseCurriculum() {
  const src = fs.readFileSync(JS_CURRICULUM, 'utf8')
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
  const b3 = [
    ['b3-dom-elements', 'DOM Elements'],
    ['b3-add-event-listener', 'addEventListener'],
    ['b3-custom-events', 'Custom Events'],
    ['b3-fetch', 'Fetch API'],
    ['b3-abort-controller', 'AbortController (Browser)'],
    ['b3-intersection-observer', 'Intersection Observer'],
    ['b3-mutation-observer', 'Mutation Observer'],
    ['b3-resize-observer', 'Resize Observer'],
    ['b3-performance-observer', 'Performance Observer'],
    ['b3-blob-file', 'Blob & File API'],
    ['b3-raf', 'requestAnimationFrame'],
  ]
  for (const [id, title] of b3) {
    topics.push({ id, title, section: 'B3 — Browser Fundamentals' })
  }
  return topics
}

function render(id, title, section, f) {
  const takeaways = [
    f.how[0],
    f.how[1] ?? `${title} is scoped to how JavaScript actually runs, not to a library.`,
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
      question: `In one minute, what is ${title} and where does a beginner first see it?`,
      answerHint: f.what,
    },
    {
      level: 'intermediate',
      question: `Walk through how ${title} works and name the main pitfall.`,
      answerHint: `${f.how.join(' ')} Pitfall: ${f.pitfall}`,
    },
    {
      level: 'advanced',
      question: `How would you explain ${title} at an interview, including engine/spec details?`,
      answerHint: f.internals.join(' '),
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
    pitfalls: [f.pitfall, ...f.how.slice(-1)],
    interview: {
      expectations: [
        `Explain ${title} without mixing it up with a nearby ${section} topic.`,
        'Give a tiny example and the failure mode if the rule is ignored.',
        f.internals[0],
      ],
      commonQuestions: [
        `What is ${title}?`,
        `Why does JavaScript ${title.toLowerCase()} behave this way?`,
        `What is the classic ${title} interview trap?`,
      ],
      traps: [f.pitfall],
      misconceptions: [f.why],
      strongSignals: [
        `Separates ${title} from lookalike APIs and can draw the mental model.`,
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
  const dest = path.join(OUT, `${topic.id}.ts`)
  fs.writeFileSync(dest, render(topic.id, topic.title, topic.section, facts))
  written++
}

if (missingFacts.length) {
  console.error('Missing FACTS for', missingFacts.join(', '))
  process.exit(1)
}

console.log(`generated ${written} topic files, skipped ${skipped} existing`)
