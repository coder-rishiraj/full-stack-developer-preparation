import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Tool permissions enforce least privilege — role-based tool allowlists, scoped credentials, read-only vs mutating tools, per-user authZ before handler runs.',
  whyExists: 'One compromised prompt should not exfiltrate all data. Permissions map user/agent role to permitted tools and data scope.',
  mentalModel: 'Key ring: agent holds only keys for allowed doors; each tool checks ACL before execute.',
  howItWorks: [
    { type: 'list', items: [
      'Tool registry tagged read/mutate/admin',
      'Map user role → allowed tool subset per session',
      'Inject user OAuth token into tool context not global admin',
      'Deny by default unknown tools',
      'Audit every tool invocation with principal',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: 'function canUseTool(user: User, tool: string) {\n  return USER_TOOLS[user.role].includes(tool);\n}' },
  ],
  tradeoffs: {
    advantages: [
      'Blast radius containment',
      'Compliance audit trail',
    ],
    disadvantages: [
      'Complex policy matrix',
      'Token pass-through bugs',
    ],
    alternatives: [
      'Single admin tool suite',
      'Prompt-only guardrails',
    ],
    whenToUse: [
      'Multi-tenant agents',
      'Enterprise copilots',
    ],
    whenNotToUse: [
      'Demo with full admin API',
    ],
  },
  failureModes: [
    'Prompt jailbreak grants shell',
    'Shared service account across users',
    'Tool omits authZ check',
  ],
  production: {
    security: [
      'RBAC on tools',
      'Per-user scoped tokens',
    ],
    observability: [
      'Alert on denied tool attempts',
    ],
  },
  interview: {
    expectations: [
      'Least privilege tools',
      'RBAC before execute',
    ],
    commonQuestions: [
      'Explain Tool Permissions',
    ],
    followUps: [
      'Production concerns?',
    ],
    misconceptions: [
      'Works in demo equals prod ready',
    ],
    traps: [
      'Missing security cap',
    ],
    strongSignals: [
      'Allowlist per role/user',
      'Separate read vs mutate',
      'Scoped credentials',
    ],
  },
  keyTakeaways: [
    'Allowlist per role/user',
    'Separate read vs mutate',
    'Scoped credentials',
    'Deny default',
    'Audit invocations',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why tool permissions?', answerHint: 'Limit damage from bad prompts or users.' },
    { level: 'intermediate', question: 'Implement how?', answerHint: 'RBAC map; check before handler; scoped OAuth.' },
    { level: 'advanced', question: 'Multi-tenant isolation?', answerHint: 'Tenant id in every tool query; no cross-tenant tokens.' },
  ],
  flashcards: [
    { front: 'Least privilege', back: 'Agent gets minimum tools needed for task' },
    { front: 'Scoped token', back: 'User OAuth passed to tool not global admin key' },
  ],
  quickRevision: [
    'RBAC tool allowlist',
    'Read vs mutate tags',
    'Scoped creds',
    'Deny default',
    'Audit log',
    'No shared admin',
  ],
}
