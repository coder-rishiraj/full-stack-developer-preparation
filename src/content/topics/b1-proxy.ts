import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Proxy wraps a target object and intercepts operations (get, set, delete, apply) via handler traps — meta-programming for validation, logging, reactivity.',
  whyExists: 'Need centralized interception without mutating every call site. Vue 3 reactivity and ORM lazy loading use Proxy patterns.',
  mentalModel: 'Transparent wrapper: client talks to Proxy; traps run your code then forward (or block) to target.',
  howItWorks: [
    { type: 'list', items: [
      'new Proxy(target, handler)',
      'Traps: get, set, has, deleteProperty, apply, construct',
      'Reflect methods match trap semantics',
      'RevocableProxy via Proxy.revocable',
      'Invariants prevent inconsistent trap behavior',
    ] },
  ],
  example: [
    { type: 'code', language: 'javascript', code: 'const p = new Proxy(user, {\n  set(t, k, v) { if (k===\'age\' && v<0) throw Error(); return Reflect.set(t,k,v); }\n});' },
  ],
  tradeoffs: {
    advantages: [
      'Centralized validation/logging',
      'Virtual properties via get trap',
      'Reactive systems',
    ],
    disadvantages: [
      'Performance overhead vs direct access',
      'Hard to debug indirection',
      'Cannot proxy some builtins easily',
    ],
    alternatives: [
      'Manual getters/setters',
      'Decorators (stage 3)',
    ],
    whenToUse: [
      'Validation layers',
      'Observability',
      'Reactive state',
    ],
    whenNotToUse: [
      'Simple objects without cross-cutting needs',
    ],
  },
  failureModes: [
    'Infinite recursion if trap reads same property unguarded',
    'Forgetting Reflect.set return value',
  ],
  production: {
    performance: [
      'Avoid Proxy on hot inner loops',
    ],
    security: [
      'Do not expose Proxy to untrusted code for sandbox alone',
    ],
  },
  interview: {
    expectations: [
      'Common traps',
      'Proxy vs Object.defineProperty',
    ],
    commonQuestions: [
      'Explain Proxy',
    ],
    followUps: [
      'Real-world use?',
    ],
    misconceptions: [
      'Superficial definition only',
    ],
    traps: [
      'Common pitfall in proxy',
    ],
    strongSignals: [
      'Vue 3 reactivity uses Proxy',
      'Reflect aligns with traps',
    ],
  },
  keyTakeaways: [
    'Vue 3 reactivity uses Proxy',
    'Reflect aligns with traps',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is a Proxy trap?', answerHint: 'Handler method intercepting object operation.' },
    { level: 'intermediate', question: 'Why Reflect with Proxy?', answerHint: 'Default forwarding + matches trap invariants.' },
    { level: 'advanced', question: 'Proxy for validation example?', answerHint: 'set trap rejects invalid values before target update.' },
  ],
  flashcards: [
    { front: 'Proxy', back: 'Wrapper intercepting object ops' },
    { front: 'Reflect.set', back: 'Forwards set in trap correctly' },
  ],
  quickRevision: [
    'Proxy(target, handler)',
    'Traps intercept ops',
    'Use Reflect in traps',
    'Revocable for cleanup',
    'Vue3 reactivity',
  ],
}
