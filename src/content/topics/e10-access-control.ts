import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Access control for LLM apps enforces who can call which models, tools, documents, and actions — RBAC, ABAC, tenant isolation, and scope-limited API keys at the gateway and tool layer.',
  whyExists: "LLM features expose powerful read/write tools. Without authZ, one user retrieves another tenant's RAG docs or triggers admin actions via agent tools.",
  mentalModel: 'Bouncer with a list: identity checked at door, document shelf access per role, tool buttons disabled unless permitted.',
  howItWorks: [
    { type: 'list', items: [
      'Authenticate user/service at API gateway (JWT, mTLS).',
      'Authorize model routes, feature flags, and token budgets per role.',
      'RAG queries MUST filter vectors by tenant_id and document ACL.',
      'Tool handlers re-check permission before side effects.',
      'Audit log denied and sensitive allowed actions.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Support agent role: read KB for team=support; no hr_docs tool. Admin: escalate tool + billing lookup. Filter applied in vector DB and tool registry.' },
  ],
  tradeoffs: {
    advantages: [
      'Prevents cross-tenant leaks',
      'Least privilege for tools',
    ],
    disadvantages: [
      'Latency on ACL checks',
      'Complex policy matrix',
    ],
    alternatives: [
      'Separate index per tenant',
      'Human approval for sensitive tools',
    ],
    whenToUse: [
      'Every multi-tenant LLM product',
    ],
    whenNotToUse: [
      'Single-user local prototype without PII',
    ],
  },
  failureModes: [
    'Missing tenant filter on retrieval',
    'Tool executes before authZ',
    'Over-broad service account keys',
  ],
  production: {
    security: [
      'Deny by default',
      'Central policy engine',
      'Rotate API keys',
    ],
    reliability: [
      'Fail closed on authZ errors',
    ],
    observability: [
      'Log authZ decisions with trace id',
    ],
  },
  interview: {
    expectations: [
      'Tenant filter + tool authZ',
      'Fail closed',
    ],
    commonQuestions: [
      'Secure multi-tenant RAG?',
    ],
    followUps: [
      'ABAC vs RBAC?',
    ],
    misconceptions: [
      'AuthN enough without authZ on tools',
    ],
    traps: [
      'Tenant id from client body only',
    ],
    strongSignals: [
      'Filter at retrieval + tool gate + audit',
    ],
  },
  keyTakeaways: [
    'AuthN + AuthZ at gateway and tools',
    'Tenant filter on every retrieval',
    'Least privilege tool registry',
    'Audit sensitive actions',
    'Fail closed',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Access control in LLM apps?', answerHint: 'Who can use models, read docs, invoke tools — RBAC/ABAC + tenant isolation.' },
    { level: 'intermediate', question: 'Where enforce tenant isolation?', answerHint: 'Vector metadata filter, API gateway, tool handlers — not prompt alone.' },
    { level: 'advanced', question: 'Design policy for agent tools?', answerHint: 'Tool allowlist per role; confirm human for destructive; audit + rate limits.' },
  ],
  flashcards: [
    { front: 'Fail closed', back: 'Deny access when authZ check errors or ambiguous' },
    { front: 'Tenant filter', back: 'Mandatory metadata constraint on vector search' },
    { front: 'Tool authZ', back: 'Re-check permission before executing side effects' },
  ],
  quickRevision: [
    'AuthN+AuthZ',
    'Tenant filter RAG',
    'Tool gate',
    'Audit log',
    'Fail closed',
  ],
}
