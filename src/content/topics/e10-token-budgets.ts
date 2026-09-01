import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Token budgeting allocates max input+output tokens per user, session, tenant, or request — enforcing cost caps and fitting context before calling the model.',
  whyExists: 'Unbounded prompts and history cause bill shock and context overflow errors. Budgets enforce product limits and fair use.',
  mentalModel: 'Prepaid phone plan — count minutes (tokens) before call; truncate or reject when over limit.',
  howItWorks: [
    { type: 'list', items: [
      'Pre-count with tokenizer before API call.',
      'Reserve completion budget from context window.',
      'Truncate RAG/history lowest priority first.',
      'Daily/monthly tenant aggregates in Redis/DB.',
      'Downgrade model or reject when over cap.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Plan allows 500K tokens/day/tenant. Middleware sums usage; at 90% warn admin; at 100% return 402 with upgrade link; per-request max 8K input 2K output.' },
  ],
  tradeoffs: {
    advantages: [
      'Predictable cost',
      'Prevents context errors',
    ],
    disadvantages: [
      'Truncation hurts quality',
      'Tokenizer mismatch edge cases',
    ],
    alternatives: [
      'Unlimited enterprise contract',
    ],
    whenToUse: [
      'SaaS LLM products',
    ],
    whenNotToUse: [
      'Internal single team unlimited',
    ],
  },
  failureModes: [
    'No output token reserve — truncate mid-generation',
    'Budget counted post-hoc only',
    'Wrong tokenizer underestimate',
  ],
  production: {
    cost: [
      'Hard and soft caps',
      'Admin override audit',
    ],
    reliability: [
      'Pre-flight count middleware',
    ],
    observability: [
      'budget_utilization gauge',
    ],
  },
  interview: {
    expectations: [
      'Pre-count',
      'Reserve completion',
    ],
    commonQuestions: [
      'Enforce token budget?',
    ],
    followUps: [
      'Truncate strategy?',
    ],
    misconceptions: [
      'Post-hoc billing enough',
    ],
    traps: [
      'Ignore output reserve',
    ],
    strongSignals: [
      'Pre-count + reserve + tenant rollup',
    ],
  },
  keyTakeaways: [
    'Pre-count before call',
    'Reserve output tokens',
    'Truncate RAG/history by priority',
    'Per-tenant daily caps',
    '402 or downgrade over limit',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Token budget?', answerHint: 'Cap tokens per user/tenant/request before LLM call.' },
    { level: 'intermediate', question: 'Truncation order?', answerHint: 'Drop oldest history, lowest rerank scores, then warn user.' },
    { level: 'advanced', question: 'Soft vs hard cap?', answerHint: 'Soft warn/throttle; hard reject or require payment.' },
  ],
  flashcards: [
    { front: 'Output reserve', back: 'Leave max_completion_tokens free in window' },
    { front: 'Pre-flight count', back: 'Tokenizer estimate before API call' },
    { front: '402 Payment Required', back: 'HTTP response when tenant exceeds token plan' },
  ],
  quickRevision: [
    'Pre-count',
    'Reserve output',
    'Truncate priority',
    'Tenant daily cap',
    'Soft/hard limit',
  ],
}
