import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Sensitive-data handling classifies, minimizes, encrypts, and controls PII, PHI, PCI, and secrets throughout LLM ingest, inference, storage, and logging lifecycles.',
  whyExists: 'Regulations (GDPR, HIPAA) and customer contracts require knowing what data touches models and where it persists.',
  mentalModel: 'Traffic light labels on data — green public FAQ, red health records never to public API.',
  howItWorks: [
    { type: 'list', items: [
      'Data classification tags at ingest.',
      'Minimize: send only necessary fields to model.',
      'Encrypt at rest for indexes and logs.',
      'Regional routing for data residency.',
      'Retention schedules and deletion workflows.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'HR docs tagged confidential → on-prem embed + private LLM only; support FAQs public tier → external API OK; all tiers encrypted S3 + KMS.' },
  ],
  tradeoffs: {
    advantages: [
      'Compliance and customer trust',
    ],
    disadvantages: [
      'Complex routing',
      'Reduced model choice',
    ],
    alternatives: [
      'Air-gapped private stack only',
    ],
    whenToUse: [
      'Enterprise regulated data',
    ],
    whenNotToUse: [
      'Public marketing copy only',
    ],
  },
  failureModes: [
    'Confidential doc in shared external index',
    'Infinite log retention',
    'Wrong region processing',
  ],
  production: {
    security: [
      'Classification-driven routing',
      'KMS encryption',
    ],
    maintainability: [
      'Data inventory map',
    ],
    reliability: [
      'Block misclassified upload paths',
    ],
  },
  interview: {
    expectations: [
      'Classify and route',
      'Minimize to model',
    ],
    commonQuestions: [
      'Handle sensitive data with LLM?',
    ],
    followUps: [
      'HIPAA considerations?',
    ],
    misconceptions: [
      'Provider zero-retention solves all',
    ],
    traps: [
      'Log retentions forever',
    ],
    strongSignals: [
      'Classification tags + private tier + encryption + retention',
    ],
  },
  keyTakeaways: [
    'Classify at ingest',
    'Minimize sent to model',
    'Route by sensitivity tier',
    'Encrypt and retain limits',
    'Regional residency',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Sensitive data in LLM?', answerHint: 'PII/PHI/secrets — classify, minimize, protect, control routing.' },
    { level: 'intermediate', question: 'Minimization?', answerHint: 'Retrieve only needed fields; redact before external API.' },
    { level: 'advanced', question: 'BAA with provider?', answerHint: 'Business associate agreement for HIPAA; verify subprocessors and retention.' },
  ],
  flashcards: [
    { front: 'Data classification', back: 'Labels driving storage, routing, and retention policy' },
    { front: 'Data minimization', back: 'Send least data necessary to model' },
    { front: 'Data residency', back: 'Process/store in required geographic region' },
  ],
  quickRevision: [
    'Classify ingest',
    'Minimize to model',
    'Private tier',
    'KMS encrypt',
    'Retention policy',
  ],
}
