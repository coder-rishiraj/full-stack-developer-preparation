import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Adversarial testing probes LLM apps with attack prompts, poisoned documents, fuzzed inputs, and red-team scenarios — finding injection, leakage, and tool abuse before attackers do.',
  whyExists: 'Happy-path eval misses security failures. Adversarial suites stress defenses like penetration testing for AI.',
  mentalModel: 'Fire drill and red team war games — try to break policies on purpose in controlled environment.',
  howItWorks: [
    { type: 'list', items: [
      'Curated attack prompt library (jailbreaks, injection).',
      'Poisoned RAG docs in staging index.',
      'Automated regression on security metrics.',
      'Human red team for creative attacks.',
      'Track pass/fail rate per release.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'CI runs 200 attack prompts against staging; block if secret_canary leaked or refund_tool invoked without approval; compare to baseline on prompt change.' },
  ],
  tradeoffs: {
    advantages: [
      'Finds real vulnerabilities',
    ],
    disadvantages: [
      'Arms race with new attacks',
      'False sense if library stale',
    ],
    alternatives: [
      'External pentest only periodic',
    ],
    whenToUse: [
      'Before prod prompt/tool changes',
    ],
    whenNotToUse: [
      'Replace all functional eval',
    ],
  },
  failureModes: [
    'Stale attack library',
    'Test prod with real secrets',
    'Only automated no human red team',
  ],
  production: {
    security: [
      'Staging-only adversarial runs',
      'Rotate attack sets',
    ],
    maintainability: [
      'Version attack corpus in repo',
    ],
    observability: [
      'security_regression dashboard',
    ],
  },
  interview: {
    expectations: [
      'Red team mindset',
      'CI integration',
    ],
    commonQuestions: [
      'Adversarial test LLM app?',
    ],
    followUps: [
      'Metrics?',
    ],
    misconceptions: [
      'Same as unit tests',
    ],
    traps: [
      'Attack prod users',
    ],
    strongSignals: [
      'Corpus + CI gate + canary secrets + human red team',
    ],
  },
  keyTakeaways: [
    'Attack prompt libraries',
    'Poisoned doc tests',
    'CI security regression',
    'Canary secret detection',
    'Human red team complements auto',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Adversarial testing for LLM?', answerHint: 'Deliberate attack prompts/docs to find security failures.' },
    { level: 'intermediate', question: 'What to measure?', answerHint: 'Injection success rate, secret leak, unauthorized tool use.' },
    { level: 'advanced', question: 'Continuous vs release gate?', answerHint: 'Nightly full corpus; PR subset; block deploy on regression.' },
  ],
  flashcards: [
    { front: 'Attack corpus', back: 'Versioned library of jailbreak and injection prompts' },
    { front: 'Canary secret', back: 'Fake credential to detect exfiltration in tests' },
    { front: 'Security regression', back: 'Metric worsening vs baseline on new release' },
  ],
  quickRevision: [
    'Attack library',
    'Poisoned RAG tests',
    'CI gate',
    'Canary secrets',
    'Red team',
  ],
}
