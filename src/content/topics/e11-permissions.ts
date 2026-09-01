import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Permission boundaries define explicit limits on what LLM agents and tools can access — filesystem paths, API scopes, DB rows, network hosts — enforced outside the model.',
  whyExists: 'Models cannot reliably self-police. Hard boundaries in code prevent one prompt from becoming lateral movement.',
  mentalModel: 'Electric fence around allowed pasture — model sheep cannot graze neighbor field even if convinced.',
  howItWorks: [
    { type: 'list', items: [
      'Tool implementations enforce scope server-side.',
      'OAuth scopes per integration not full admin.',
      'Chroot/sandbox for code execution.',
      'Network egress allowlist from worker.',
      'Deny by default; explicit grants per role.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'File tool maps to /workspace/{session_id}/ only; SQL tool uses read-only role limited to views; HTTP tool blocks internal 10.0.0.0/8.' },
  ],
  tradeoffs: {
    advantages: [
      'Strong security guarantee',
    ],
    disadvantages: [
      'Limits agent flexibility',
      'Policy maintenance',
    ],
    alternatives: [
      'Human executes privileged steps',
    ],
    whenToUse: [
      'All agents with tools',
    ],
    whenNotToUse: [
      'Never trust model to choose scope',
    ],
  },
  failureModes: [
    'Tool accepts path ../ escape',
    'Shared DB creds across tenants',
    'DNS rebinding on HTTP tool',
  ],
  production: {
    security: [
      'Sandbox code exec',
      'Egress firewall',
    ],
    reliability: [
      'Deny on permission check error',
    ],
    observability: [
      'Log denied tool attempts',
    ],
  },
  interview: {
    expectations: [
      'Enforce in code not prompt',
      'Sandbox',
    ],
    commonQuestions: [
      'Permission boundaries for agents?',
    ],
    followUps: [
      'SQL tool safe design?',
    ],
    misconceptions: [
      "Tell model don't access X enough",
    ],
    traps: [
      'Arbitrary shell tool',
    ],
    strongSignals: [
      'Server-side scope + sandbox + egress allowlist',
    ],
  },
  keyTakeaways: [
    'Enforce permissions in code',
    'Deny by default',
    'Sandbox code and network',
    'Least OAuth scope',
    'Log denied attempts',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Permission boundaries?', answerHint: 'Hard limits on what tools can access — enforced server-side.' },
    { level: 'intermediate', question: 'Safe file tool?', answerHint: 'Jail to session directory; block ..; read-only option; size cap.' },
    { level: 'advanced', question: 'Multi-tenant SQL tool?', answerHint: 'Row-level security; tenant_id bind param; read-only views; query allowlist.' },
  ],
  flashcards: [
    { front: 'Deny by default', back: 'No tool access unless explicitly granted' },
    { front: 'Egress allowlist', back: 'Network tool may only reach approved hosts' },
    { front: 'Path jail', back: 'File tool restricted to session subdirectory' },
  ],
  quickRevision: [
    'Code not prompt',
    'Deny default',
    'Sandbox exec',
    'OAuth least scope',
    'Egress allowlist',
  ],
}
