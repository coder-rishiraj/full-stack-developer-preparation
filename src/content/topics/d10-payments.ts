import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A payment system processes money movement between customers, merchants, and banks — handling authorization, capture, settlement, refunds, idempotency, and PCI compliance with strong consistency for balances.',
  whyExists:
    'Payments are correctness-critical: duplicate charges destroy trust; lost payments lose revenue. Integrating card networks, wallets, and fraud checks requires a dedicated platform with ledger accounting, not ad-hoc API calls from checkout code.',
  mentalModel:
    'Checkout creates PaymentIntent (idempotent). Auth holds funds via PSP (Stripe/Adyen). Capture moves money on ship. Double-entry ledger records every cent. Webhooks reconcile async state. Outbox ensures events emitted after DB commit.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'API layer validates idempotency-key. Ledger service writes immutable journal entries (debit/credit) in transaction. PSP adapter calls external network. Reconciliation workers match PSP reports to internal ledger nightly. Fraud service scores before auth.',
    },
    {
      type: 'mermaid',
      caption: 'Payment state machine',
      diagram: `stateDiagram-v2
  [*] --> Created
  Created --> Authorized: auth OK
  Authorized --> Captured: capture
  Authorized --> Voided: cancel
  Captured --> Refunded: refund partial/full
  Created --> Failed: decline`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Idempotent charge',
      code: `POST /v1/payments
Idempotency-Key: order-99-charge
{ "amount_cents": 4999, "currency": "USD", "payment_method": "pm_..." }
→ 200 { "payment_id": "pay_1", "status": "authorized" }`,
    },
  ],
  keyTakeaways: [
    'Idempotency keys on every mutating payment API.',
    'Ledger double-entry — balances derived from journal, not mutable floats.',
    'Never store raw PAN; use PSP tokenization (PCI scope reduction).',
    'Reconcile PSP settlements vs internal ledger daily.',
    'Evolve: sync PSP call → ledger + outbox → multi-region with saga.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Auth vs capture?',
      answerHint: 'Auth holds funds; capture settles later — useful for shipping delays.',
    },
    {
      level: 'intermediate',
      question: 'How prevent double charge on retry?',
      answerHint: 'Idempotency key stored with unique constraint; return same result on replay.',
    },
    {
      level: 'advanced',
      question: 'Design exactly-once ledger + PSP when PSP is at-least-once?',
      answerHint: 'Internal idempotency + reconciliation; never trust webhook alone without verify API.',
    },
  ],
  flashcards: [
    { front: 'Idempotency-Key', back: 'Same key + same body → same payment_id, no double charge' },
    { front: 'Double-entry ledger', back: 'Every transaction balanced debits and credits' },
    { front: 'PCI scope', back: 'Tokenize cards at PSP; never log PAN/CVV' },
  ],
  quickRevision: [
    'PaymentIntent state machine',
    'Idempotency-Key header',
    'Ledger journal immutable',
    'PSP webhooks + verify',
    'Outbox for events',
    'Nightly reconciliation',
  ],
  systemDesign: {
    problem:
      'Design a payment platform processing $10B/year, supporting cards and wallets, auth/capture/refund, merchant payouts, with audit-grade ledger and 99.99% correctness.',
    requirements: {
      functional: [
        'Create payment with auth and optional capture',
        'Full/partial refund',
        'Merchant balance and payout scheduling',
        'Payment status query and webhooks to merchants',
      ],
      nonFunctional: [
        'No duplicate charges (idempotent)',
        'Ledger auditable and immutable',
        'PCI DSS compliant (minimal scope)',
        'p99 API latency < 500ms excluding PSP',
      ],
    },
    scaleAssumptions: [
      '$10B/year ≈ $317/s average; peak 10k TPS during sales',
      '10M merchants/users; 100M transactions/year stored',
      'Multi-currency support',
    ],
    capacityEstimates: [
      'Ledger: 100M rows/year × 200 B ≈ 20 GB/year + indexes',
      '10k TPS peak → shard ledger by account_id; queue PSP calls if rate limited',
      'Webhook outbox: 10k events/s peak',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `POST /v1/payments          (Idempotency-Key)
POST /v1/payments/{id}/capture
POST /v1/payments/{id}/refund
GET  /v1/payments/{id}
POST /v1/payouts`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'Payment: id, merchant_id, amount, currency, status, idempotency_key, psp_ref',
          'LedgerEntry: entry_id, account_id, debit, credit, payment_id, ts (append-only)',
          'Account: merchant_id, balance derived or materialized',
          'IdempotencyRecord: key, request_hash, response_body, expires_at',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Payment API → Ledger service (Postgres serializable per account) → PSP adapter. Fraud pre-check. Outbox publisher sends merchant webhooks. Reconciliation batch compares PSP CSV to ledger. Secrets in HSM/Vault.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  Client --> API[Payment API]
  API --> Fraud[Fraud Scorer]
  API --> Ledger[(Ledger DB)]
  API --> PSP[PSP Adapter]
  PSP --> Visa[Card Network]
  Ledger --> Outbox[Outbox]
  Outbox --> WH[Merchant Webhooks]
  Recon[Reconciliation Job] --> PSP
  Recon --> Ledger`,
      caption: 'Ledger is source of truth; PSP is external effect',
    },
    dataFlow: [
      'POST with Idempotency-Key → check idempotency table',
      'Begin DB txn: insert payment + ledger entries',
      'Call PSP auth → update status on response',
      'Commit txn → outbox event',
      'Worker delivers webhook with signed payload',
      'Capture/refund repeat with idempotency',
    ],
    storage: [
      'Postgres ledger with append-only entries',
      'Idempotency keys Redis/Postgres TTL 24h',
      'Cold archive for compliance 7 years',
    ],
    caching: [
      'Do not cache balances without version',
      'Read payment status from primary or sync replica',
    ],
    asyncProcessing: [
      'Webhook delivery retries',
      'Settlement reconciliation nightly',
      'Payout batch to merchant bank accounts',
    ],
    scaling: [
      'Shard ledger by merchant_id',
      'PSP connection pooling; circuit breaker',
      'Separate read API for payment history',
    ],
    consistency: [
      'Strong consistency for ledger per account',
      'PSP state eventual — reconcile discrepancies',
      'Idempotency gives exactly-once UX',
    ],
    reliability: [
      'Saga: if PSP timeout, mark pending + reconciliation job',
      'Never double-refund — idempotent refund keys',
      'Ledger immutable — corrections via adjusting entries',
    ],
    failureScenarios: [
      'PSP timeout after auth succeeded → reconciliation marks authorized',
      'Duplicate webhook → idempotent status transition',
      'Partial network partition → queue captures until PSP reachable',
    ],
    security: [
      'PCI: tokenized PM only; TLS 1.2+; audit logs',
      'HMAC webhook signatures',
      'Rate limit and fraud block',
    ],
    observability: [
      'Payment funnel metrics by status',
      'Ledger imbalance alert (must always zero sum)',
      'Reconciliation diff dashboard',
    ],
    bottlenecks: [
      'PSP rate limits',
      'Hot merchant account row locking',
      'Reconciliation batch window',
    ],
    alternatives: [
      'Stripe Connect hosted (faster, less control)',
      'Event sourcing entire payment aggregate',
    ],
    tradeoffs: [
      'Auth+capture vs single charge UX',
      'Materialized balance vs compute from ledger',
      'Build vs buy PSP integration',
    ],
    interviewFollowUps: [
      'Design split payment marketplace?',
      'Chargeback handling flow?',
      'Multi-currency FX ledger?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Direct Stripe charge in checkout handler.',
        bottleneck: 'No ledger; hard reconcile; duplicate retries charge twice.',
      },
      {
        stage: '2. Improve',
        description: 'Payment service + idempotency + status table.',
        bottleneck: 'Mutable balance column; audit gaps.',
      },
      {
        stage: '3. Improve',
        description: 'Double-entry ledger + outbox webhooks + reconciliation.',
        bottleneck: 'Single DB write ceiling; PSP coupling.',
      },
      {
        stage: '4. Scale further',
        description: 'Sharded ledger; multi-PSP routing; fraud ML; geo-redundant.',
        bottleneck: 'Cross-shard transactions; regulatory per region.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Audit trail', 'Idempotent safe retries', 'Merchant trust'],
    disadvantages: ['High compliance burden', 'PSP dependency', 'Complex reconciliation'],
    alternatives: ['Full PSP hosted checkout', 'Crypto on-chain (different domain)'],
    whenToUse: ['Marketplaces', 'SaaS billing', 'E-commerce'],
    whenNotToUse: ['Internal fake credits only — simpler wallet OK'],
  },
  failureModes: [
    'Missing idempotency → double charge',
    'Float money types → rounding bugs',
    'Trust webhook without PSP verify → fraudulent status',
  ],
  production: {
    performance: ['Async webhooks; sync only auth path'],
    scalability: ['Shard ledger; PSP pools'],
    reliability: ['Reconciliation; pending state machine'],
    security: ['PCI scope minimization; vault secrets'],
    observability: ['Ledger balance invariant checks'],
    cost: ['PSP fees dominate infra cost'],
  },
  interview: {
    expectations: [
      'Idempotency + ledger + state machine',
      'Auth/capture/refund flows',
      'Reconciliation and webhooks',
    ],
    commonQuestions: ['Design payment system', 'Prevent double charge?'],
    followUps: ['Marketplace split?', 'Chargebacks?'],
    misconceptions: ['Float dollars in DB is fine'],
    traps: ['No idempotency on POST'],
    strongSignals: ['Double-entry, Idempotency-Key, outbox, reconciliation, PCI tokenization'],
  },
}
