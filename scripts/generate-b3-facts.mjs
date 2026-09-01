#!/usr/bin/env node
/**
 * Generates b3-browser-facts.mjs from track-b-browser.ts curriculum.
 * Run: node scripts/generate-b3-facts.mjs
 */
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CURRICULUM = path.join(__dirname, '../src/content/curriculum/track-b-browser.ts')
const OUT = path.join(__dirname, 'b3-browser-facts.mjs')

function parseCurriculum() {
  const src = fs.readFileSync(CURRICULUM, 'utf8')
  const topics = []
  let section = 'Browser'
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

function sectionContext(section) {
  if (section.includes('Architecture')) return 'browser processes, threads, and navigation lifecycle'
  if (section.includes('Window') || section.includes('BOM')) return 'the browser global environment (window, document, BOM APIs)'
  if (section.includes('DOM Fundamentals')) return 'the DOM tree, selection, manipulation, and traversal'
  if (section.includes('DOM Events')) return 'DOM events, propagation, delegation, and listener options'
  if (section.includes('HTML Parsing')) return 'HTML parsing, script loading, and page lifecycle events'
  if (section.includes('Critical Rendering')) return 'the critical rendering path from HTML/CSS to pixels'
  if (section.includes('Layout')) return 'layout, reflow, paint, compositing, and GPU layers'
  if (section.includes('Event Loop')) return 'browser task scheduling, microtasks, and rendering opportunities'
  if (section.includes('requestAnimationFrame')) return 'requestAnimationFrame and frame-aligned updates'
  if (section.includes('HTTP')) return 'HTTP from the browser perspective (requests, headers, caching)'
  if (section.includes('Fetch')) return 'the Fetch API for network requests in the browser'
  if (section.includes('AbortController')) return 'AbortController, cancellation, and stale-request races'
  if (section.includes('Same-Origin')) return 'the Same-Origin Policy and cross-origin restrictions'
  if (section.includes('CORS')) return 'Cross-Origin Resource Sharing (CORS) and preflight'
  if (section.includes('Cookies')) return 'HTTP cookies, attributes, and security implications'
  if (section.includes('Web Storage')) return 'localStorage, sessionStorage, and storage trade-offs'
  if (section.includes('IndexedDB')) return 'IndexedDB for structured client-side storage'
  if (section.includes('Caching')) return 'browser HTTP caching, validation, and cache layers'
  if (section.includes('Content Security')) return 'Content Security Policy (CSP) directives and XSS mitigation'
  if (section.includes('Security Fundamentals')) return 'browser security: XSS, CSRF, clickjacking, and token storage'
  if (section.includes('Web Workers')) return 'Web Workers and off-main-thread computation'
  if (section.includes('Service Workers')) return 'Service Workers, caches, and offline behavior'
  if (section.includes('WebSockets')) return 'WebSocket connections and real-time messaging'
  if (section.includes('Server-Sent')) return 'Server-Sent Events (SSE) and EventSource'
  if (section.includes('Observer')) return 'Observer APIs (Intersection, Resize, Mutation, Performance)'
  if (section.includes('Blob')) return 'Blob, File, and object URL APIs'
  if (section.includes('Performance')) return 'browser performance metrics, Core Web Vitals, and profiling'
  if (section.includes('Resource Loading')) return 'resource hints, priorities, and render-blocking assets'
  if (section.includes('Navigation')) return 'History API, SPA navigation, and browser history stack'
  if (section.includes('iframe')) return 'iframes, postMessage, and cross-document communication'
  if (section.includes('URL')) return 'URL anatomy, URL API, and encoding'
  if (section.includes('Forms')) return 'HTML forms, FormData, and constraint validation'
  if (section.includes('Clipboard')) return 'Clipboard, drag-and-drop, and selection APIs'
  if (section.includes('Permissions')) return 'Permissions API and device APIs in secure contexts'
  if (section.includes('Accessibility')) return 'accessibility tree, focus, and keyboard navigation in the browser'
  if (section.includes('Developer Tools')) return 'Chrome DevTools panels for frontend debugging'
  if (section.includes('Interview')) return 'senior frontend browser interview reasoning'
  return 'browser and Web Platform fundamentals'
}

function makeFact(topic) {
  const ctx = sectionContext(topic.section)
  const title = topic.title
  const what = `${title} is a core Web Platform concept in ${topic.section.split(' — ')[1] ?? 'Browser Fundamentals'}. It belongs to ${ctx}. Understanding ${title} helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.`
  const why = `Frontend engineers interact with the browser every day, but frameworks hide ${title.toLowerCase()} details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.`
  const model = `Treat ${title} as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).`
  const how = [
    `Locate ${title} in ${topic.section}: map it to MDN reference docs and observe behavior in DevTools.`,
    `Connect ${title} to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).`,
    `Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.`,
    `Use DevTools (Elements, Network, Performance, Application) to verify assumptions about ${title.toLowerCase()}.`,
    `Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story.`,
  ]
  const code = `// ${title} — minimal browser example
console.log('[${topic.id}]', typeof ${title.includes('API') || title.includes('Event') ? 'window' : 'document'});
// Open DevTools → verify behavior for: ${title}
// Spec reference: developer.mozilla.org (search "${title}")`
  const caption = `${title} — observe in DevTools while this runs`
  const pitfall = `Interview trap: describing ${title} from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.`
  const internals = [
    `${title} is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.`,
    `Main-thread work for ${title.toLowerCase()} can block rendering — profile with Performance panel if users report jank.`,
    `Cross-origin and security policies (SOP, CORS, CSP) often determine whether ${title.toLowerCase()} succeeds in production.`,
  ]
  return { what, why, model, how, code, caption, pitfall, internals }
}

const topics = parseCurriculum()
const lines = [
  '/** Auto-generated browser B3 topic facts. Regenerate: node scripts/generate-b3-facts.mjs */',
  'function e(what, why, model, how, code, caption, pitfall, internals) {',
  '  return { what, why, model, how, code, caption, pitfall, internals }',
  '}',
  '',
  'export const FACTS = {',
]

for (const topic of topics) {
  const f = makeFact(topic)
  const esc = (s) => JSON.stringify(s)
  lines.push(`  ${esc(topic.id)}: e(`)
  lines.push(`    ${esc(f.what)},`)
  lines.push(`    ${esc(f.why)},`)
  lines.push(`    ${esc(f.model)},`)
  lines.push(`    [${f.how.map(esc).join(', ')}],`)
  lines.push(`    ${esc(f.code)},`)
  lines.push(`    ${esc(f.caption)},`)
  lines.push(`    ${esc(f.pitfall)},`)
  lines.push(`    [${f.internals.map(esc).join(', ')}],`)
  lines.push('  ),')
}

lines.push('}')
lines.push('')

fs.writeFileSync(OUT, lines.join('\n'))
console.log(`Wrote ${topics.length} facts to ${OUT}`)
