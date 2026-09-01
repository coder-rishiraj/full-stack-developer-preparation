import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Prompt and version tracking records which system prompt, model, RAG index, and app release served each response — enabling rollback, A/B analysis, and audit reproducibility.',
  whyExists: 'Silent prompt changes cause quality regressions. You need git-like versioning for prompts, configs, and index snapshots.',
  mentalModel: 'Recipe card version on every plate — know which chef instructions produced this dish when complaints arrive.',
  howItWorks: [
    { type: 'list', items: [
      'Store prompts in git with semver tags.',
      'Log prompt_version, model_id, index_version per request.',
      'Feature flags route % traffic to new prompt.',
      'Rollback = flip flag to previous version.',
      'Link eval runs to specific version combo.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Response metadata: prompt_v2.3.1, model gpt-4o-2024-08-06, index_build 2025-08-15. Regression traced to prompt_v2.3.1 citation rule change.' },
  ],
  tradeoffs: {
    advantages: [
      'Safe rollout and rollback',
      'Audit trail',
    ],
    disadvantages: [
      'Version proliferation',
      'Storage of prompt hashes',
    ],
    alternatives: [
      'Manual changelog only — weak',
    ],
    whenToUse: [
      'Any prod prompt iteration',
    ],
    whenNotToUse: [
      'Static prompt forever',
    ],
  },
  failureModes: [
    'Untagged prod requests',
    'Index updated without version bump',
    'Rollback without eval confirmation',
  ],
  production: {
    maintainability: [
      'Prompt registry in repo',
      'CI diff on prompt PRs',
    ],
    observability: [
      'Metrics sliced by prompt_version',
    ],
    reliability: [
      'Canary % before full rollout',
    ],
  },
  interview: {
    expectations: [
      'Version in logs',
      'Flag rollback',
    ],
    commonQuestions: [
      'Track prompt changes?',
    ],
    followUps: [
      'Index version coupling?',
    ],
    misconceptions: [
      'Edit prompt in prod UI without log',
    ],
    traps: [
      'No index version in cache key',
    ],
    strongSignals: [
      'Git prompts + log version + canary',
    ],
  },
  keyTakeaways: [
    'Version prompts in git',
    'Log prompt/model/index version',
    'Feature flag rollouts',
    'Eval tied to version',
    'Fast rollback path',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why version prompts?', answerHint: 'Reproduce/debug responses; rollback regressions; audit.' },
    { level: 'intermediate', question: 'Index version tracking?', answerHint: 'index_build id in logs and cache keys; re-embed bumps version.' },
    { level: 'advanced', question: 'Prompt CI?', answerHint: 'Golden eval on PR; block merge if metric drops.' },
  ],
  flashcards: [
    { front: 'prompt_version', back: 'Semver tag logged with each LLM response' },
    { front: 'index_version', back: 'Identifies vector snapshot used for retrieval' },
    { front: 'Canary rollout', back: 'Route small % to new prompt before full deploy' },
  ],
  quickRevision: [
    'Git prompts',
    'Log versions',
    'Index version',
    'Canary flag',
    'Eval on PR',
  ],
}
