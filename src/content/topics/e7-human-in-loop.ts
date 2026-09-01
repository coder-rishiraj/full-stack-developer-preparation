import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Human-in-the-loop (HITL) pauses agent for human approval, correction, or labeling on high-stakes actions — payments, deletes, policy edge cases.',
  whyExists: 'Fully autonomous agents risk costly mistakes. HITL adds governance and training signal.',
  mentalModel: 'Agent proposes action → queue for human → approved/rejected/edited → resume or abort.',
  howItWorks: [
    { type: 'list', items: [
      'Define approval gates on tool class or risk score',
      'UI queue with context snippet',
      'Timeout and default deny',
      'Log decisions for audit and fine-tune',
      'Async resume via webhook/event',
    ] },
  ],
  example: [
    { type: 'code', language: 'text', code: 'Agent: propose refund $500\n→ Human inbox: Approve | Edit | Reject\n→ On approve: execute refund tool' },
  ],
  tradeoffs: {
    advantages: [
      'Safety on high impact',
      'Quality labels for FT',
    ],
    disadvantages: [
      'Latency and staffing cost',
      'Queue backlog',
    ],
    alternatives: [
      'Full auto',
      'Rule-based only no LLM',
    ],
    whenToUse: [
      'Finance ops',
      'Moderation',
      'Medical suggestions',
    ],
    whenNotToUse: [
      'Low risk read-only tasks',
    ],
  },
  failureModes: [
    'Approval fatigue → rubber stamp',
    'Stale context when human responds late',
    'Bypass gate in code path',
  ],
  production: {
    security: [
      'Audit log who approved what',
      'Default deny on timeout',
    ],
    reliability: [
      'Idempotent resume tokens',
    ],
  },
  interview: {
    expectations: [
      'When require human approval',
      'Audit trail',
    ],
    commonQuestions: [
      'Explain Human-in-the-Loop',
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
      'Gates on risky tools',
      'Approval queue UI',
      'Default deny timeout',
    ],
  },
  keyTakeaways: [
    'Gates on risky tools',
    'Approval queue UI',
    'Default deny timeout',
    'Audit log',
    'Resume token',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why HITL?', answerHint: 'Prevent high-stakes autonomous errors.' },
    { level: 'intermediate', question: 'What to gate?', answerHint: 'Mutating tools, high $, policy sensitive.' },
    { level: 'advanced', question: 'Scale HITL?', answerHint: 'Risk routing; auto-approve low risk; prioritize queue.' },
  ],
  flashcards: [
    { front: 'HITL', back: 'Human approval before agent action proceeds' },
    { front: 'Default deny', back: 'Timeout without approval aborts action' },
  ],
  quickRevision: [
    'Risk-based gates',
    'Approval queue',
    'Audit trail',
    'Default deny',
    'Resume workflow',
    'Train from edits',
  ],
}
