#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { FACTS } from './b3-browser-facts.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, 'src/content/topics')
const CURRICULUM = path.join(ROOT, 'src/content/curriculum/track-b-browser.ts')

function parseCurriculum() {
  const src = fs.readFileSync(CURRICULUM, 'utf8')
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

function render(id, title, f) {
  const takeaways = [
    f.how[0],
    f.how[1] ?? `${title} is essential Web Platform knowledge for frontend interviews.`,
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
      question: `What is ${title} in the browser and when do you use it?`,
      answerHint: f.what,
    },
    {
      level: 'intermediate',
      question: `Explain ${title} with a DevTools observation and one pitfall.`,
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
        `Explain ${title} at the Web Platform level, not only via framework APIs.`,
        'Name which thread/process and which security policy applies.',
        f.internals[0],
      ],
      commonQuestions: [
        `What is ${title}?`,
        `When would ${title} block rendering or fail cross-origin?`,
        `What is the classic ${title} interview trap?`,
      ],
      traps: [f.pitfall],
      misconceptions: [f.why],
      strongSignals: [
        `Uses DevTools and MDN to validate behavior around ${title}.`,
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
  fs.writeFileSync(path.join(OUT, `${topic.id}.ts`), render(topic.id, topic.title, facts))
  written++
}

if (missingFacts.length) {
  console.error('Missing FACTS for', missingFacts.slice(0, 20).join(', '), missingFacts.length > 20 ? `... +${missingFacts.length - 20} more` : '')
  process.exit(1)
}

console.log(`generated ${written} topic files, skipped ${skipped} existing`)
