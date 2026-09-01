import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'PII handling in LLM pipelines detects, redacts, blocks, or tokenizes personally identifiable information before embed, log, model call, or storage — meeting privacy regulations.',
  whyExists: 'Users paste SSNs, emails, health data into chat. Logs, indexes, and third-party APIs create compliance exposure without PII controls.',
  mentalModel: 'Shredder and label maker — strip or mask sensitive fields before they leave your trust boundary.',
  howItWorks: [
    { type: 'list', items: [
      'Detect PII via regex, NER, or DLP service.',
      'Redact/mask in prompts sent to external LLM.',
      'Block or route to on-prem model for sensitive class.',
      'Scrub logs and traces; never index raw PII in shared vector store.',
      'Retention limits and DSAR delete workflows.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Ingress scanner masks email/phone in user message; placeholder tokens in prompt; rehydrate only in trusted downstream; block if credit card detected.' },
  ],
  tradeoffs: {
    advantages: [
      'Compliance and trust',
      'Reduced breach impact',
    ],
    disadvantages: [
      'False positives hurt UX',
      'Latency of scanning',
    ],
    alternatives: [
      'Private LLM only',
      'No external API for sensitive tier',
    ],
    whenToUse: [
      'Any user-facing LLM with enterprise data',
    ],
    whenNotToUse: [
      'Synthetic data sandbox only',
    ],
  },
  failureModes: [
    'PII in application logs',
    'Embed pipeline skips scan',
    'Rehydration leaks to model',
  ],
  production: {
    security: [
      'DLP at ingress and egress',
      'Data residency routing',
    ],
    reliability: [
      'Fail closed on scan errors for regulated tier',
    ],
    maintainability: [
      'PII entity catalog versioned',
    ],
  },
  interview: {
    expectations: [
      'Redact before external API',
      'Log scrubbing',
    ],
    commonQuestions: [
      'PII in LLM app?',
    ],
    followUps: [
      'GDPR delete from vector index?',
    ],
    misconceptions: [
      'Provider deletes your data automatically',
    ],
    traps: [
      'Log full chat for debug in prod',
    ],
    strongSignals: [
      'Scan → mask → policy route → scrub logs',
    ],
  },
  keyTakeaways: [
    'Scan before model and index',
    'Redact in external calls',
    'Scrub logs and traces',
    'DSAR delete from stores',
    'Route sensitive to private model',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'PII handling in LLM?', answerHint: 'Detect, redact, block, or use private model; scrub logs.' },
    { level: 'intermediate', question: 'PII in RAG index?', answerHint: 'Avoid indexing raw PII; mask at ingest; metadata for delete.' },
    { level: 'advanced', question: 'GDPR erasure?', answerHint: 'Delete vectors/docs by user id; purge logs; confirm provider data handling.' },
  ],
  flashcards: [
    { front: 'DLP scan', back: 'Detect PII at ingress before LLM/index/log' },
    { front: 'Redaction', back: 'Replace PII with placeholders in external prompts' },
    { front: 'DSAR delete', back: 'Remove user data from indexes, logs, caches on request' },
  ],
  quickRevision: [
    'Ingress DLP',
    'Mask external',
    'Scrub logs',
    'Private model tier',
    'DSAR delete',
  ],
}
