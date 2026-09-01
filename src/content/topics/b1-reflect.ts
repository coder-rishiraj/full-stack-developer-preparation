import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Reflect is a built-in object with methods mirroring Proxy trap names — default object operation behavior callable programmatically (get, set, defineProperty, etc.).',
  whyExists: 'Proxy traps need reliable forwarding to default behavior. Reflect provides single API matching meta-object protocol invariants.',
  mentalModel: 'Object ops as functions: Reflect.get(obj,key) instead of obj[key] — same semantics, usable inside traps.',
  howItWorks: [
    { type: 'list', items: [
      'Methods correspond 1:1 to Proxy traps',
      'Reflect.construct replaces new with arg array',
      'Reflect.ownKeys = keys+symbols',
      'Returns boolean success for defineProperty/delete',
      'Prefer Reflect in Proxy traps for forwarding',
    ] },
  ],
  example: [
    { type: 'code', language: 'javascript', code: 'const handler = {\n  get(t, k, r) { console.log(k); return Reflect.get(t, k, r); }\n};' },
  ],
  tradeoffs: {
    advantages: [
      'Clean trap forwarding',
      'Functional object ops',
      'Matches Proxy invariants',
    ],
    disadvantages: [
      'Less familiar API',
      'Verbose vs dot syntax',
    ],
    alternatives: [
      'Direct property access',
      'Object.* legacy methods',
    ],
    whenToUse: [
      'Inside Proxy handlers',
      'Meta-programming libraries',
    ],
    whenNotToUse: [
      'Normal application code paths',
    ],
  },
  failureModes: [
    'Using target[k] in trap breaking receiver `this`',
    'Ignoring boolean return of defineProperty',
  ],
  production: {
    maintainability: [
      'Use Reflect in all Proxy traps consistently',
    ],
  },
  interview: {
    expectations: [
      'Reflect vs Object methods',
      'Why receiver matters in Reflect.get',
    ],
    commonQuestions: [
      'Explain Reflect',
    ],
    followUps: [
      'Real-world use?',
    ],
    misconceptions: [
      'Superficial definition only',
    ],
    traps: [
      'Common pitfall in reflect',
    ],
    strongSignals: [
      'Reflect completes ES6 meta protocol with Proxy',
    ],
  },
  keyTakeaways: [
    'Reflect completes ES6 meta protocol with Proxy',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Reflect.get purpose?', answerHint: 'Invokes [[Get]] internal method; honors receiver.' },
    { level: 'intermediate', question: 'Reflect in Proxy trap?', answerHint: 'Forward default behavior preserving invariants.' },
    { level: 'advanced', question: 'Reflect.construct use?', answerHint: 'Call constructor with newTarget and args array.' },
  ],
  flashcards: [
    { front: 'Reflect', back: 'Built-in meta-object operation methods' },
    { front: 'Receiver', back: 'Third arg to Reflect.get for correct this binding' },
  ],
  quickRevision: [
    'Mirrors Proxy traps',
    'Use in handlers',
    'Reflect.get/set/construct',
    'Boolean results',
    'Meta-object protocol',
  ],
}
