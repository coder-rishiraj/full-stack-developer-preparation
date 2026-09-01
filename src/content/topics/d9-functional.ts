import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Functional requirements in system design interviews define what the system must do — user-visible features, core workflows, actors, and scope boundaries — expressed as concrete capabilities ("user can post tweet, follow, view timeline") not implementation details.',
  whyExists:
    'Without clear functional scope, interviews drift into over-engineered platforms or miss critical flows. Functional reqs set the contract for API design, data model, and capacity assumptions. They also show you clarify ambiguity before building.',
  mentalModel:
    'Product spec headline bullets. Who does what? User posts link; visitor clicks short URL; admin bans user. In scope vs out of scope prevents building Slack when asked for Pastebin.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Category', 'Example statements', 'Interview tip'],
      rows: [
        ['Actors', 'User, guest, admin, system', 'Name 2–3 max'],
        ['Core flows', 'Create, read, update, delete key entities', '3–5 flows only'],
        ['Constraints', 'Anonymous vs logged-in', 'Affects auth design'],
        ['Out of scope', 'No edit history v1', 'Saves time explicitly'],
        ['Edge cases', 'Custom alias collision', 'Mention briefly'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Functional scope map',
      diagram: `flowchart TB
  InScope[In scope: shorten redirect analytics]
  OutScope[Out of scope: social graph messaging]
  InScope --> API[Drive API design]
  InScope --> Data[Drive data model]`,
    },
    {
      type: 'list',
      items: [
        'First 3–5 minutes — confirm with interviewer',
        'Use verbs: upload, share, search, notify',
        'Separate MVP vs nice-to-have if time short',
        'Functional drives features; non-functional drives quality bars',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'URL shortener functional: (1) user creates short link from long URL optional custom alias; (2) anonymous redirect via short code; (3) owner views click analytics; (4) links expire optionally. Out of scope: user accounts SSO, A/B test URLs. Drives entities: links, clicks, optional users.',
    },
  ],
  tradeoffs: {
    advantages: ['Aligns interview with problem', 'Prevents scope creep', 'Structures rest of session'],
    disadvantages: ['Too long list wastes time', 'Under-spec misses follow-up traps'],
    alternatives: ['Jump to diagram — risky without alignment'],
    whenToUse: ['Start of every HLD interview', 'After problem statement'],
    whenNotToUse: ['When interviewer pre-listed reqs — confirm only'],
  },
  failureModes: [
    'Assumed features interviewer did not ask for',
    'Missed critical flow (payment) until end',
    'Confused functional with non-functional ("must be fast")',
    'No out-of-scope — over-built design',
    'Vague "handle users" without actions',
  ],
  production: {
    maintainability: ['Functional reqs map to user stories in real projects'],
  },
  interview: {
    expectations: ['3–5 bullet capabilities', 'Actors named', 'Out of scope stated'],
    commonQuestions: ['What features for X?', 'Clarify ambiguous prompt?'],
    followUps: ['What if we add editing?', 'Guest vs auth?'],
    misconceptions: ['Functional includes latency targets — that is non-functional'],
    traps: ['Build entire Google suite for simple prompt'],
    strongSignals: ['Explicit out-of-scope', 'Confirm with interviewer', 'Flows map to APIs'],
  },
  keyTakeaways: [
    'Functional = what system does — features and flows.',
    '3–5 core capabilities; name actors.',
    'State out-of-scope to save interview time.',
    'Confirm understanding before capacity/HLD.',
    'Do not mix latency/scale here — non-functional separate.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Functional vs non-functional?', answerHint: 'Functional = features/actions; non-functional = latency, scale, availability.' },
    { level: 'intermediate', question: 'Functional reqs for chat app?', answerHint: '1:1 and group messaging, online status, read receipts optional, media share — state MVP subset.' },
    { level: 'advanced', question: 'Interviewer adds "edit message" mid-interview?', answerHint: 'Ack scope change; impact data model versioning, sync to recipients, storage — reprioritize time.' },
  ],
  flashcards: [
    { front: 'Functional requirement', back: 'What the system must do — features and behaviors' },
    { front: 'Out of scope', back: 'Explicitly excluded features to bound interview design' },
    { front: 'Actor', back: 'User role interacting with system — user admin guest' },
    { front: 'Core flow', back: 'End-to-end user journey e.g. post → feed → like' },
  ],
  quickRevision: [
    'What not how',
    '3–5 bullets',
    'Name actors',
    'Out of scope',
    'Confirm first',
  ],
}
