import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Secrets management for LLM apps stores API keys, OAuth tokens, and DB credentials in vaults (AWS Secrets Manager, HashiCorp Vault) — injected at runtime, never in prompts, repos, or client bundles.',
  whyExists: 'Leaked OpenAI keys mean instant financial abuse. LLM apps tempt logging prompts that contain pasted secrets.',
  mentalModel: 'Keys live in a safe; app checks out short-lived credential per request; never write safe combo on sticky note (git).',
  howItWorks: [
    { type: 'list', items: [
      'Store provider keys in Secrets Manager; rotate on schedule.',
      'Backend proxy holds keys; clients use session JWT only.',
      'IAM roles for workers — no static keys on EC2.',
      'Scan repos and CI for accidental commits.',
      'Separate keys per env and tenant tier if needed.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Lambda reads OPENAI_KEY from Secrets Manager at cold start cache; ECS task role fetches per rotation; frontend never sees provider key.' },
  ],
  tradeoffs: {
    advantages: [
      'Rotation and audit',
      'Blast radius control',
    ],
    disadvantages: [
      'Vault dependency',
      'Cold start fetch latency',
    ],
    alternatives: [
      'Cloud provider secret mount',
    ],
    whenToUse: [
      'Every prod LLM deployment',
    ],
    whenNotToUse: [
      'Hardcode in demo — never prod',
    ],
  },
  failureModes: [
    'Key in frontend bundle',
    'Secret in logged prompt',
    'Shared prod key across tenants',
  ],
  production: {
    security: [
      'Rotate quarterly',
      'Least privilege IAM',
    ],
    reliability: [
      'Cache secrets with TTL refresh',
    ],
    maintainability: [
      'No secrets in env files in git',
    ],
  },
  interview: {
    expectations: [
      'Backend proxy',
      'Vault rotation',
    ],
    commonQuestions: [
      'Where store OpenAI key?',
    ],
    followUps: [
      'Rotate without downtime?',
    ],
    misconceptions: [
      'Env var in docker image OK',
    ],
    traps: [
      'Key in browser for demo',
    ],
    strongSignals: [
      'Secrets Manager + proxy + scan CI',
    ],
  },
  keyTakeaways: [
    'Never client-side provider keys',
    'Vault + IAM roles',
    'Backend proxy only',
    'Rotate and audit',
    'Scan repos for leaks',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LLM API key storage?', answerHint: 'Secrets Manager/Vault; server-side only; never frontend.' },
    { level: 'intermediate', question: 'Rotation strategy?', answerHint: 'Dual active keys; rolling deploy; invalidate old after cutover.' },
    { level: 'advanced', question: 'Tenant-specific provider keys?', answerHint: 'BYOK vault per tenant; map tenant_id → secret ref at gateway.' },
  ],
  flashcards: [
    { front: 'BYOK', back: 'Bring your own key — tenant supplies provider credential' },
    { front: 'Secrets Manager', back: 'Managed vault with rotation and audit' },
    { front: 'Backend proxy', back: 'Server injects key; client uses app auth only' },
  ],
  quickRevision: [
    'Vault not git',
    'Backend proxy',
    'IAM roles',
    'Rotate keys',
    'Scan CI',
  ],
}
