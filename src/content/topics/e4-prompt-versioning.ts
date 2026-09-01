import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Prompt versioning tracks system/user prompt templates like code — semantic versions, git storage, diff review, rollback, and linking prompt hash to eval scores and production traffic.',
  whyExists: 'Prompt tweaks silently change behavior. Without versioning, regressions untraceable and A/B tests unreproducible.',
  mentalModel: 'Git for prompts: v1.2.0 system prompt tagged; deploy pins version; eval suite runs on each bump before promote.',
  howItWorks: [
    { type: 'list', items: [
      'Store templates in repo or registry with semver',
      'Parameterize variables {{user_name}} not string concat in code',
      'CI runs offline eval on prompt change PR',
      'Production logs prompt_version with each request',
      'Canary new version; rollback via config flag',
    ] },
  ],
  example: [
    { type: 'code', language: 'yaml', code: 'prompt_id: support-agent\nversion: 2.3.1\nsystem: |\n  You are a helpful support bot.\n  Use only provided context.\nvariables: [context, user_name]', caption: 'Versioned template' },
  ],
  tradeoffs: {
    advantages: [
      'Reproducible behavior',
      'Safe rollback',
    ],
    disadvantages: [
      'Overhead for tiny projects',
    ],
    alternatives: [
      'Hardcoded strings',
      'Feature flags only',
    ],
    whenToUse: [
      'Production LLM apps',
    ],
    whenNotToUse: [
      'One-off experiments',
    ],
  },
  failureModes: [
    'Untracked hotfix in prod config',
    'Variable schema break on upgrade',
    'Eval not run on merge',
  ],
  production: {
    maintainability: [
      'Prompt registry + code review',
      'Link version to Langfuse/LangSmith traces',
    ],
    reliability: [
      'Automated regression eval gate',
    ],
  },
  interview: {
    expectations: [
      'Semver prompts',
      'Eval gate on change',
    ],
    commonQuestions: [
      'How version prompts?',
    ],
    followUps: [
      'Rollback strategy?',
    ],
    misconceptions: [
      'Prompts too volatile to version',
    ],
    traps: [
      'Edit prod prompt without tag',
    ],
    strongSignals: [
      'Git, semver, eval CI, request logging',
    ],
  },
  keyTakeaways: [
    'Version prompts like code',
    'Semver + git review',
    'Eval CI on prompt PR',
    'Log version per request',
    'Canary and rollback',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why prompt versioning?', answerHint: 'Trace behavior changes; rollback regressions.' },
    { level: 'intermediate', question: 'Deploy new prompt safely?', answerHint: 'Offline eval → canary → full rollout.' },
    { level: 'advanced', question: 'Link eval to version?', answerHint: 'Hash prompt; store scores keyed by version id.' },
  ],
  flashcards: [
    { front: 'Prompt registry', back: 'Central store of versioned templates' },
    { front: 'Canary prompt', back: 'Route small traffic to new version first' },
  ],
  quickRevision: [
    'Semver templates',
    'Git + PR review',
    'Eval CI gate',
    'Log prompt_version',
    'Parameterized vars',
    'Canary rollback',
  ],
}
