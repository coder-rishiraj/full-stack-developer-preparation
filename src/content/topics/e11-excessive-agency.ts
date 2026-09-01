import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Excessive agency is when an LLM agent has more autonomy or tool permissions than the task requires — deleting records, sending emails, or chaining actions without human approval.',
  whyExists: 'Tool-rich agents feel magical until one misinterpreted instruction mass-deletes or spams customers. Scope must match intent.',
  mentalModel: 'Give intern keys to entire building vs one room — agency should match task envelope.',
  howItWorks: [
    { type: 'list', items: [
      'Principle of least privilege on tool registry.',
      'Human-in-the-loop for irreversible actions.',
      'Max tool iterations and action budgets.',
      'Separate read vs write tools; confirm writes.',
      'Policy engine evaluates proposed action plan.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Support bot read-only ticket lookup by default; refund tool requires manager OAuth approval step; agent capped at 5 tool calls per turn.' },
  ],
  tradeoffs: {
    advantages: [
      'Limits blast radius',
    ],
    disadvantages: [
      'Friction in UX',
      'Approval latency',
    ],
    alternatives: [
      'Read-only agents only',
    ],
    whenToUse: [
      'Any agent with side effects',
    ],
    whenNotToUse: [
      'Sandboxed code exec with no external IO',
    ],
  },
  failureModes: [
    'Admin tool on customer channel',
    'Unbounded agent loop purchases',
    'Auto-send email tool on injection',
  ],
  production: {
    security: [
      'Tool allowlist per role',
      'HITL for destructive',
    ],
    reliability: [
      'Iteration and spend caps',
    ],
    observability: [
      'Log every tool call with args hash',
    ],
  },
  interview: {
    expectations: [
      'Least privilege',
      'HITL',
    ],
    commonQuestions: [
      'Limit agent agency?',
    ],
    followUps: [
      'Read vs write split?',
    ],
    misconceptions: [
      'More tools always better',
    ],
    traps: [
      'Shell tool in prod chat',
    ],
    strongSignals: [
      'Allowlist + HITL + caps + audit',
    ],
  },
  keyTakeaways: [
    'Least privilege tools',
    'HITL for irreversible',
    'Cap iterations and spend',
    'Read/write separation',
    'Audit all actions',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Excessive agency?', answerHint: 'Agent has more permissions/autonomy than task needs.' },
    { level: 'intermediate', question: 'Mitigations?', answerHint: 'Allowlist, HITL, caps, read-only default, policy engine.' },
    { level: 'advanced', question: 'Plan-then-execute pattern?', answerHint: 'Model proposes plan; policy approves; executor runs fixed steps.' },
  ],
  flashcards: [
    { front: 'HITL', back: 'Human in the loop approves high-risk actions' },
    { front: 'Tool allowlist', back: 'Only registered safe tools per context' },
    { front: 'Action budget', back: 'Max tool calls or $ per agent session' },
  ],
  quickRevision: [
    'Least privilege',
    'HITL destructive',
    'Tool caps',
    'Read-only default',
    'Audit calls',
  ],
}
