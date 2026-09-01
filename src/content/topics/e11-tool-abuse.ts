import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Tool abuse is attackers or misaligned models exploiting agent tools — SSRF, SQL injection via tool args, spam sends, resource exhaustion — through crafted prompts or inputs.',
  whyExists: 'Tools bridge LLM to real systems. Each tool is an API surface; models can be tricked into malicious args.',
  mentalModel: 'Robot arm in factory — if anyone can program it via chat, expect havoc without safety cages.',
  howItWorks: [
    { type: 'list', items: [
      'Validate and sanitize all tool arguments.',
      'SSRF protection on HTTP tools.',
      'Parameterized queries only in SQL tools.',
      'Rate limit and cap expensive tools.',
      'Block tool chaining to escalate privilege.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'HTTP tool asked to fetch http://169.254.169.254/ — blocked by egress allowlist. Email tool rate limited 5/hour per user.' },
  ],
  tradeoffs: {
    advantages: [
      'Reduces real-world impact',
    ],
    disadvantages: [
      'Limits legitimate automation',
    ],
    alternatives: [
      'Read-only tools only',
    ],
    whenToUse: [
      'Every tool-enabled agent',
    ],
    whenNotToUse: [
      'Unsandboxed shell in prod',
    ],
  },
  failureModes: [
    'Raw SQL from model',
    'Open HTTP tool SSRF',
    'Unlimited loop calling paid API tool',
  ],
  production: {
    security: [
      'Arg schema validation',
      'SSRF blocklist',
    ],
    cost: [
      'Per-tool rate limits',
    ],
    observability: [
      'Alert anomalous tool volume',
    ],
  },
  interview: {
    expectations: [
      'SSRF and SQL risks',
      'Validation',
    ],
    commonQuestions: [
      'Secure agent tools?',
    ],
    followUps: [
      'HTTP tool design?',
    ],
    misconceptions: [
      'Model picks safe args always',
    ],
    traps: [
      'Shell tool in customer chat',
    ],
    strongSignals: [
      'Schema validate + allowlist + rate limit + sandbox',
    ],
  },
  keyTakeaways: [
    'Validate every tool arg',
    'SSRF and SQL protections',
    'Rate limit expensive tools',
    'No arbitrary shell',
    'Audit anomalous patterns',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Tool abuse?', answerHint: 'Malicious use of agent tools via tricked model or user.' },
    { level: 'intermediate', question: 'SSRF via HTTP tool?', answerHint: 'Block internal IPs/metadata; allowlist domains; no redirects.' },
    { level: 'advanced', question: 'Tool escalation?', answerHint: 'Prevent chain read_config → admin_tool; separate privilege tiers.' },
  ],
  flashcards: [
    { front: 'SSRF', back: 'Server-side request forgery via HTTP tool to internal URLs' },
    { front: 'Tool arg validation', back: 'JSON Schema check before executing function' },
    { front: 'Tool rate limit', back: 'Cap calls per user/time for abuse prevention' },
  ],
  quickRevision: [
    'Validate args',
    'SSRF block',
    'SQL parameterized',
    'Rate limit tools',
    'No shell',
  ],
}
