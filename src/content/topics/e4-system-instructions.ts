import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'System instructions are the persistent prompt defining model role, tone, constraints, and policies — highest-priority behavior guide sent as system role message.',
  whyExists: 'Without system prompt, model defaults to generic assistant. Product needs consistent persona, safety rules, and output format across all user turns.',
  mentalModel: 'Employee handbook read before every shift. User messages are customer questions; system tells how to behave.',
  howItWorks: [
    { type: 'list', items: [
      'First system message: role, scope, formatting, refusals.',
      'Keep stable for prompt caching discounts.',
      'Separate product policy from RAG context (user/context).',
      'Version and A/B test system prompts.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'system: You are Acme support bot. Answer only from CONTEXT. Cite [id]. Refuse medical advice. user: + retrieved chunks + question.' },
  ],
  tradeoffs: {
    advantages: [
      'Consistent behavior',
      'Central policy updates',
    ],
    disadvantages: [
      'Competes with RAG for tokens',
      'Overlong system dilutes focus',
    ],
    alternatives: [
      'Developer role on some APIs',
    ],
    whenToUse: [
      'Every prod chatbot',
    ],
    whenNotToUse: [
      'Duplicating entire KB in system',
    ],
  },
  failureModes: [
    'Conflicting system vs user instructions',
    'Stale system after product change',
    'Sensitive secrets in system prompt logged',
  ],
  production: {
    maintainability: [
      'Version system prompts in git',
      'Feature flag prompt variants',
    ],
    security: [
      'No secrets in prompt',
      'Audit injection attempts',
    ],
  },
  interview: {
    expectations: [
      'Role and placement',
      'vs RAG context',
    ],
    commonQuestions: [
      'What goes in system prompt?',
    ],
    followUps: [
      'Prompt injection via user?',
    ],
    misconceptions: [
      'System unlimited priority always',
    ],
    traps: [
      'Whole doc in system',
    ],
    strongSignals: [
      'Concise policy + RAG separate',
    ],
  },
  keyTakeaways: [
    'Defines role and rules',
    'System role message',
    'Keep concise and stable',
    'Version prompts',
    'Separate from retrieved context',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'System instructions purpose?', answerHint: 'Persistent behavior, tone, constraints for model.' },
    { level: 'intermediate', question: 'System vs RAG context?', answerHint: 'System=policies; RAG=facts per query in user/context.' },
    { level: 'advanced', question: 'Update system safely?', answerHint: 'Version, offline eval, gradual rollout, regression golden set.' },
  ],
  flashcards: [
    { front: 'System message', back: 'High-priority behavior and policy instructions' },
    { front: 'Prompt versioning', back: 'Track changes for rollback and eval' },
    { front: 'Stable prefix', back: 'Unchanging system start enables token caching' },
  ],
  quickRevision: [
    'Role+rules',
    'System message',
    'Concise',
    'Version it',
    'RAG separate',
  ],
}
