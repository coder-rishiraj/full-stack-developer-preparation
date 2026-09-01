import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Requirements gathering in system design interviews is the structured opening phase — clarifying problem statement, functional scope, non-functional targets, constraints, assumptions, and out-of-scope items — before capacity estimation or architecture drawing.',
  whyExists:
    'Ambiguous prompts ("design Twitter") hide scale and feature choices. Strong candidates drive clarification like product managers — avoiding wrong designs and demonstrating communication skills interviewers score as heavily as technical boxes.',
  mentalModel:
    'Doctor intake before prescription. Symptoms (prompt), history (scale), allergies (constraints), goals (NFRs). Diagnosis (architecture) comes only after understanding the patient — not after guessing.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Question type', 'Examples', 'Why ask'],
      rows: [
        ['Scale', 'DAU? peak QPS?', 'Drives capacity'],
        ['Functional', 'Edit posts? DMs?', 'Scope APIs'],
        ['NFR', 'Latency? availability?', 'Cache vs strong DB'],
        ['Constraints', 'Mobile only? GDPR?', 'Storage region auth'],
        ['Assumptions', 'Logged-in users only?', 'Write down explicitly'],
        ['Out of scope', 'No recommendations v1?', 'Save time'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Interview time allocation',
      diagram: `flowchart LR
  Req[Requirements 5 min] --> Cap[Capacity 5 min]
  Cap --> HLD[HLA 10 min]
  HLD --> Deep[Deep dive 10 min]
  Deep --> Wrap[Failure + observability 5 min]`,
    },
    {
      type: 'list',
      items: [
        'First 3–5 minutes — do not skip even if prompt seems clear',
        'Propose defaults: "Assume 100M DAU unless you say otherwise"',
        'Confirm with interviewer before moving on',
        'Write bullets visible — functional vs non-functional separate',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Prompt: design Instagram. Candidate asks: photos only or video? Follow graph required? DAU scale? p99 feed latency? Availability target? Mobile upload dominant? Answers: photo+v1, full social graph, 500M DAU, p99 300ms feed, 99.9%, mobile. Out of scope: stories reels. Proceeds with confirmed bullets.',
    },
  ],
  tradeoffs: {
    advantages: ['Correct design target', 'Communication signal', 'Time saved avoiding rework'],
    disadvantages: ['Too many questions — annoy interviewer', 'Too few — wrong design'],
    alternatives: ['Assume silently — risky'],
    whenToUse: ['First minutes every HLD interview'],
    whenNotToUse: ['Interviewer says "assume X Y Z" listed — confirm only'],
  },
  failureModes: [
    'Jump to diagram in minute one',
    'Never confirm assumptions',
    'Confuse functional and non-functional lists',
    'Ask implementation ("Redis or Memcached?") too early',
    'Ignore constraint (HIPAA, single region)',
  ],
  production: {
    maintainability: ['PRD and RFC process mirrors interview requirements phase'],
  },
  interview: {
    expectations: ['Clarifying questions', 'Written bullets', 'Confirm before HLD'],
    commonQuestions: ['What would you ask for X?', 'How allocate 45 min?'],
    followUps: ['Interviewer vague — what defaults?', 'Scope creep mid-interview?'],
    misconceptions: ['Requirements phase shows weakness — opposite true'],
    traps: ['Silent assumptions on scale'],
    strongSignals: ['Structured functional/NFR/out-of-scope', 'Proposed defaults', 'Time box 5 min'],
  },
  keyTakeaways: [
    'Start with clarifying questions — scale, features, NFRs, constraints.',
    'Separate functional, non-functional, out-of-scope bullets.',
    'Propose reasonable defaults if interviewer vague.',
    'Confirm understanding before capacity and HLD.',
    'Budget ~5 minutes — do not over-question.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'First three questions for URL shortener?', answerHint: 'Scale QPS? custom aliases? analytics required? availability?' },
    { level: 'intermediate', question: '45-minute interview time split?', answerHint: 'Reqs 5, capacity 5, HLD 10, deep dive 10, failure/obs 5, buffer discussion.' },
    { level: 'advanced', question: 'Interviewer refuses to answer scale?', answerHint: 'State explicit assumptions 100M DAU write down proceed ask confirmation ok to continue.' },
  ],
  flashcards: [
    { front: 'Requirements gathering goal', back: 'Align scope scale and quality before designing' },
    { front: 'Propose defaults', back: 'Assume reasonable scale when interviewer vague' },
    { front: 'Out of scope', back: 'Explicitly exclude features to bound time' },
    { front: 'Confirm step', back: 'Does this match what you want before HLD?' },
  ],
  quickRevision: [
    'Ask scale features NFR',
    'Write bullets',
    'Out of scope',
    'Propose defaults',
    'Confirm 5 min',
  ],
}
