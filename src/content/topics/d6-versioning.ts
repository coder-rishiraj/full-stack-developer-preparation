import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'API versioning evolves the contract without breaking existing clients — via URL path (/v1/), header (Accept-Version), or query param. Includes resource representation versions (ETags), deprecation timelines, and additive vs breaking change policies.',
  whyExists:
    'Clients ship on mobile and partner integrations lag months. Breaking field renames or semantic changes without version strand old clients. Versioning provides parallel supported contracts during migration windows.',
  mentalModel:
    'v1 frozen semantics; v2 improves. Default route oldest supported; sunset headers warn deprecation. Prefer additive changes (new optional fields) over breaking. Major version bump for incompatible changes only.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Strategy', 'Example', 'Tradeoff'],
      rows: [
        ['URL path', '/v1/users', 'Most visible; easy routing at gateway'],
        ['Header', 'Accept: application/vnd.api+json;version=2', 'Clean URLs; harder to test in browser'],
        ['Query', '?api-version=2', 'Easy override; messy caching'],
        ['Representation', 'ETag / If-Match', 'Optimistic concurrency not API version'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Version routing at gateway',
      diagram: `flowchart TB
  Client --> GW[API Gateway]
  GW -->|/v1/*| SvcV1[Service v1 handlers]
  GW -->|/v2/*| SvcV2[Service v2 handlers]
  SvcV1 --> DB[(Shared DB with compat layer)]`,
    },
    {
      type: 'list',
      items: [
        'Deprecation: Sunset header + Release-Date + migration guide',
        'OpenAPI per major version',
        'Adapter layer maps v1 DTO ↔ internal domain model',
        'Never break v1 without major bump and timeline',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Breaking change in v2',
      code: `# v1: { "name": "full string" }
# v2: { "first_name": "...", "last_name": "..." }

GET /v1/profile/42   # unchanged contract
GET /v2/profile/42   # new shape

Response headers on v1:
Deprecation: true
Sunset: Sat, 01 Feb 2027 00:00:00 GMT
Link: </v2/profile/42>; rel="successor-version"`,
    },
  ],
  tradeoffs: {
    advantages: ['Safe client migration', 'Parallel documentation', 'Clear breaking boundary'],
    disadvantages: ['Multiple code paths to maintain', 'Database schema may serve all versions'],
    alternatives: ['Feature flags per client', 'GraphQL schema evolution'],
    whenToUse: ['Public/partner APIs with long-lived clients'],
    whenNotToUse: ['Internal only sync-deployed services — sometimes shared proto suffices'],
  },
  failureModes: [
    'Silent breaking change in minor release',
    'Too many supported versions unmaintainable',
    'Version not enforced — default drift',
    'Shared DB migration breaks old version handlers',
  ],
  production: {
    maintainability: ['Version sunset policy 12-24 months', 'Contract tests per version'],
    observability: ['Traffic per version metrics', 'Alert deprecated version usage before sunset'],
    security: ['Old version still needs security patches'],
    scalability: ['Route versions to same scalable backend with adapters'],
  },
  interview: {
    expectations: ['URL vs header versioning', 'Additive vs breaking', 'Deprecation communication'],
    commonQuestions: ['How version public API?', 'Breaking field rename?'],
    followUps: ['Share DB across versions?', 'Mobile old app support?'],
    misconceptions: ['Version every small additive field', 'v2 means duplicate entire codebase always'],
    traps: ['Removing v1 field without bump'],
    strongSignals: ['Sunset headers', 'Adapter pattern', 'OpenAPI diff CI gate'],
  },
  keyTakeaways: [
    'Major version for incompatible changes; prefer additive in minor.',
    'URL /v1/ most common for public REST.',
    'Document deprecation with Sunset header and date.',
    'Adapter maps old DTO to core domain.',
    'Monitor usage before retiring old versions.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why API versioning?', answerHint: 'Evolve API without breaking existing integrated clients.' },
    { level: 'intermediate', question: 'URL vs header versioning?', answerHint: 'URL explicit routable; header clean URLs — pick one consistently.' },
    { level: 'advanced', question: 'Rename required field — strategy?', answerHint: 'Add new field v1 optional both; deprecate old; v2 remove old; sunset timeline.' },
  ],
  flashcards: [
    { front: 'Breaking change', back: 'Requires major version bump e.g. v1→v2' },
    { front: 'Additive change', back: 'New optional field — often no version bump needed' },
    { front: 'Sunset header', back: 'Communicates date old version stops being supported' },
    { front: 'ETag versioning', back: 'Resource instance concurrency — separate from API major version' },
  ],
  quickRevision: [
    '/v1/ path common',
    'Additive preferred',
    'Sunset deprecated',
    'Adapter layer',
    'Monitor version traffic',
  ],
  systemDesign: {
    problem: 'Evolve payment API from v1 synchronous charge to v2 async charge with webhook without breaking 500 partner integrations.',
    requirements: {
      functional: ['v1 POST /charges sync', 'v2 POST /charges returns 202 + webhook', 'Shared merchant accounts'],
      nonFunctional: ['18 month v1 support', 'Clear deprecation headers'],
    },
    scaleAssumptions: ['500 partners half on v1', '10k charges/s'],
    capacityEstimates: ['Same backend; version routers to handlers'],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `POST /v1/charges → 201 sync result\nPOST /v2/charges → 202 {charge_id} + webhook charge.completed`,
      },
    ],
    dataModel: [{ type: 'list', items: ['Internal charge aggregate', 'v1/v2 mappers to same model'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Gateway routes by path prefix; shared domain service; webhooks v2 only.' }],
    diagram: {
      mermaid: `flowchart LR
  P1[Partner v1] --> V1[v1 handler sync]
  P2[Partner v2] --> V2[v2 handler async]
  V1 --> Core[Charge service]
  V2 --> Core
  V2 --> WH[Webhooks]`,
      caption: 'Shared core dual facades',
    },
    dataFlow: ['v1 blocking flow preserved', 'v2 queue + webhook'],
    storage: ['Single charges table'],
    caching: ['Idempotency shared'],
    asyncProcessing: ['v2 async completion pipeline'],
    scaling: ['Horizontal charge workers'],
    consistency: ['Strong charge creation both versions'],
    reliability: ['v1 partners migration playbook'],
    failureScenarios: ['Partner ignores Sunset — rate limit nudge + email'],
    security: ['Same auth both versions'],
    observability: ['Traffic % v1 vs v2 dashboard'],
    bottlenecks: ['Maintaining dual handlers — sunset deadline'],
    alternatives: ['Feature flag per API key instead of path version'],
    tradeoffs: ['Long support window cost vs partner velocity'],
    interviewFollowUps: ['Same idempotency key cross version?'],
    evolution: [
      { stage: '1. Simple design', description: 'v1 only.', bottleneck: 'Need async model.' },
      { stage: '2. Improve', description: 'Launch v2 parallel.', bottleneck: 'Dual maintenance.' },
      { stage: '3. Improve', description: 'Deprecation headers + docs.', bottleneck: 'Straggler partners.' },
      { stage: '4. Scale further', description: 'Retire v1 after sunset.', bottleneck: 'Forced migrations support load.' },
    ],
  },
}
