import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'AI customer-support system design: RAG over KB + ticket history, tool integrations (CRM, refunds), human handoff, multi-tenant ACL, and observability for enterprise support automation.',
  whyExists: 'Support volume scales faster than headcount. Architecture must balance automation, accuracy, safety, and escalation to humans.',
  mentalModel: 'Tier-0 bot with librarian backroom — retrieves policies, drafts reply, escalates edge cases to human with full context packet.',
  howItWorks: [
    { type: 'list', items: [
      'Ingress: chat widget, email parser, API.',
      'Retrieve KB + past tickets with tenant/user ACL.',
      'LLM drafts answer with citation requirement.',
      'Tools: ticket update, order lookup (read-only default).',
      'Confidence low or user asks → queue human agent.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'User asks refund status → retrieve policy + order tool → grounded reply with ticket link → if sentiment angry or confidence <0.7 route to agent dashboard with suggested draft.' },
  ],
  tradeoffs: {
    advantages: [
      '24/7 deflection',
      'Consistent policy answers',
    ],
    disadvantages: [
      'Wrong answer trust damage',
      'Integration complexity',
    ],
    alternatives: [
      'Search-only deflection',
      'Human-only with AI assist sidebar',
    ],
    whenToUse: [
      'High-volume repetitive support',
    ],
    whenNotToUse: [
      'High-risk medical/legal without human review',
    ],
  },
  failureModes: [
    'Wrong refund policy cited',
    'Cross-customer data in reply',
    'Infinite bot loop blocking human',
  ],
  production: {
    reliability: [
      'Escalation SLA',
      'Abstain on low retrieval',
    ],
    security: [
      'Tenant ACL on every retrieval',
    ],
    observability: [
      'Deflection rate, CSAT, escalation reasons',
    ],
  },
  interview: {
    expectations: [
      'RAG + tools + handoff',
      'Metrics',
    ],
    commonQuestions: [
      'Design AI support bot?',
    ],
    followUps: [
      'Escalation triggers?',
    ],
    misconceptions: [
      '100% automation goal',
    ],
    traps: [
      'Refund write tool without HITL',
    ],
    strongSignals: [
      'ACL + citations + confidence escalate + CRM integration',
    ],
  },
  keyTakeaways: [
    'RAG over KB + tickets',
    'Read-only tools default',
    'Human handoff with context',
    'Citation grounded answers',
    'Track deflection and CSAT',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'AI support core components?', answerHint: 'RAG KB, LLM, tools (CRM), human handoff, analytics.' },
    { level: 'intermediate', question: 'When escalate to human?', answerHint: 'Low confidence, angry user, policy exception, tool failure, user request.' },
    { level: 'advanced', question: 'Multi-tenant support SaaS?', answerHint: 'Per-tenant KB index, branding, tool creds, budget caps, isolated logs.' },
  ],
  flashcards: [
    { front: 'Deflection rate', back: 'Fraction of issues resolved without human agent' },
    { front: 'Handoff packet', back: 'Summary, retrieval ids, draft reply sent to human UI' },
    { front: 'Support RAG ACL', back: 'KB chunks filtered by customer product and entitlements' },
  ],
  quickRevision: [
    'RAG+CRM tools',
    'Cite KB',
    'Confidence escalate',
    'Tenant ACL',
    'CSAT metrics',
  ],
  systemDesign: {
    problem: 'Design AI customer-support platform for 500 enterprises, 50M chats/year, p95 response <5s, 40% deflection target, GDPR compliant.',
    requirements: {
      functional: [
        'Omnichannel chat/email',
        'RAG over KB and macros',
        'CRM/ticket tools',
        'Human agent copilot and takeover',
        'Admin analytics dashboard',
      ],
      nonFunctional: [
        'p95 <5s first response',
        '99.9% availability',
        'Tenant data isolation',
        'Audit all tool actions',
        'SOC2 logging',
      ],
    },
    scaleAssumptions: [
      '50M conversations/year',
      'Peak 2K concurrent chats',
      '10K KB articles per enterprise avg',
    ],
    capacityEstimates: [
      'LLM gateway 500 RPS burst',
      'Vector index ~50M chunks total sharded',
      'Postgres metadata + Redis session cache',
    ],
    dataFlow: [
      'Message → classify intent → retrieve KB/tickets → LLM draft → validate citations → respond or escalate',
      'Agent takeover streams same thread context',
      'Feedback thumbs → eval pipeline',
    ],
    storage: [
      'Postgres tenants/users/tickets',
      'pgvector or dedicated vector per tenant partition',
      'S3 raw KB uploads',
      'ClickHouse analytics',
    ],
    caching: [
      'Semantic cache for FAQ intents',
      'Redis session context',
      'CDN for widget static',
    ],
    asyncProcessing: [
      'KB ingest embed pipeline',
      'Nightly eval batch',
      'Webhook CRM sync',
    ],
    scaling: [
      'Horizontal stateless tier; shard by tenant.',
    ],
    consistency: [
      'Strong for auth/billing; eventual for analytics.',
    ],
    reliability: [
      'Retries, idempotency keys, DLQ for async.',
    ],
    failureScenarios: [
      'Provider outage; hot tenant; index lag.',
    ],
    security: [
      'Tenant ACL on retrieval',
      'PII scan ingress',
      'HITL for refund tool',
      'IRSA/AWS KMS',
    ],
    observability: [
      'Deflection, CSAT, grounded rate, escalation reason, $/chat',
    ],
    bottlenecks: [
      'Retrieval latency on large KB',
      'LLM tail latency',
      'Hot enterprise during launch',
    ],
    alternatives: [
      'Zendesk AI native',
      'Human-first with copilot only',
    ],
    tradeoffs: [
      'Automation vs trust — conservative escalation early',
      'Shared vs dedicated index per tenant',
    ],
    interviewFollowUps: [
      'Voice channel?',
      'Multi-language KB?',
      'Fine-tune vs RAG only?',
    ],
    api: [
      { type: 'code', language: 'http', code: 'POST /v1/conversations/{id}/messages\nGET /v1/conversations/{id}/suggested-reply\nPOST /v1/conversations/{id}/escalate' },
    ],
    dataModel: [
      { type: 'list', items: [
        'Tenant, User, Conversation, Message',
        'KbDocument, Chunk(embedding, acl_tags)',
        'Escalation(ticket_id, reason, suggested_reply)',
        'ToolAuditLog(tenant, tool, args_hash, actor)',
      ] },
    ],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Stateless orchestrator; session in Redis; RAG and LLM behind internal gateway with rate limits and model routing.' },
    ],
    diagram: { mermaid: "flowchart LR\n  User --> GW[API Gateway]\n  GW --> Orch[Support Orchestrator]\n  Orch --> RAG[RAG Service]\n  Orch --> LLM[LLM Gateway]\n  Orch --> Tools[CRM Tools]\n  Orch --> Agent[Human Agent UI]\n  RAG --> VDB[(Vector DB)]\n  Tools --> CRM[(CRM API)]", caption: 'Support request path' },
    evolution: [
      { stage: '1. MVP', description: 'Single model + basic RAG.', bottleneck: 'Cost and quality variance.' },
      { stage: '2. Production', description: 'Routing, eval, observability.', bottleneck: 'Ops complexity.' },
      { stage: '3. Enterprise', description: 'Multi-tenant ACL, audit, fallbacks.', bottleneck: 'Compliance overhead.' },
    ],
  },
}
