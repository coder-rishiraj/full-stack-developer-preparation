import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Data leakage in LLM systems is unintended exposure of training data, RAG documents, secrets, or other users' context through model outputs, logs, embeddings, or error messages.",
  whyExists: 'Models memorize; RAG mixes tenants; logs capture everything. Leakage causes compliance breaches and competitive harm.',
  mentalModel: 'Water cooler that repeats private hallway conversations — isolate what each customer hears.',
  howItWorks: [
    { type: 'list', items: [
      'Cross-tenant retrieval without filter leaks docs.',
      'Prompt injection exfiltrates system prompt or secrets.',
      'Logs/traces store full chats accessible to wrong staff.',
      'Side-channel via timing or embed similarity.',
      'Mitigate: ACL, redaction, output filters, access audit.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Missing tenant filter returns competitor pricing doc in answer. Fix: metadata filter + output scan for foreign tenant markers + alert.' },
  ],
  tradeoffs: {
    advantages: [
      'Leak prevention builds trust',
    ],
    disadvantages: [
      'Defense layers add latency',
    ],
    alternatives: [
      'Dedicated index per tenant',
    ],
    whenToUse: [
      'Multi-tenant with sensitive data',
    ],
    whenNotToUse: [
      'Public data only single tenant',
    ],
  },
  failureModes: [
    'Shared cache key cross-tenant',
    'Support staff sees all logs',
    'Error stack trace with connection string',
  ],
  production: {
    security: [
      'Tenant isolation at every layer',
      'Log RBAC',
    ],
    observability: [
      'Leak detection canaries',
    ],
    reliability: [
      'Fail closed on filter errors',
    ],
  },
  interview: {
    expectations: [
      'Retrieval + log leakage paths',
      'Tenant filter',
    ],
    commonQuestions: [
      'Prevent data leakage in RAG?',
    ],
    followUps: [
      'Cross-tenant cache?',
    ],
    misconceptions: [
      "LLM won't repeat training data",
    ],
    traps: [
      'tenant_id from client only',
    ],
    strongSignals: [
      'Filter + cache keys + log RBAC + audit',
    ],
  },
  keyTakeaways: [
    'Tenant filter every retrieval',
    'No cross-tenant cache',
    'Scrub logs and errors',
    'Monitor exfil patterns',
    'Dedicated indexes for high isolation',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LLM data leakage?', answerHint: "Unintended exposure of private docs/secrets/other users' data." },
    { level: 'intermediate', question: 'RAG leakage vector?', answerHint: 'Missing ACL filter; wrong chunk retrieved and quoted.' },
    { level: 'advanced', question: 'Embedding side-channel?', answerHint: 'Probe similarity to infer presence of secret docs — rate limit and audit queries.' },
  ],
  flashcards: [
    { front: 'Cross-tenant leak', back: 'User A retrieves User B documents via missing filter' },
    { front: 'Log leakage', back: 'Sensitive chat in logs seen by unauthorized staff' },
    { front: 'Canary token', back: 'Fake secret in system prompt to detect exfiltration' },
  ],
  quickRevision: [
    'Tenant ACL',
    'Cache isolation',
    'Log RBAC',
    'Output scan',
    'Fail closed',
  ],
}
