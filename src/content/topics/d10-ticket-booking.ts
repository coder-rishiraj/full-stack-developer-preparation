import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A ticket booking system sells limited inventory (seats, events) under high concurrency — coordinating search, hold/reserve, payment, and confirmation without double-booking or overselling.',
  whyExists:
    'Flash sales create massive concurrent writes on finite seats. Simple "SELECT then UPDATE" races cause double booking. The domain needs reservations with TTL, strong inventory invariants, idempotent payment, and fair queueing.',
  mentalModel:
    'User searches read-optimized catalog. On select seats, atomic reserve decrements available count or locks seat rows. Hold expires in 10 minutes. Payment confirms reservation; release on timeout. Distributed lock or DB constraint enforces exclusivity.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Patterns: pessimistic row lock (SELECT FOR UPDATE), optimistic versioning, or Redis DECR with Lua for seat holds. Wait queue + virtual waiting room for flash sales. CDN for static event pages; inventory writes go to primary DB shard.',
    },
    {
      type: 'mermaid',
      caption: 'Book flow with hold TTL',
      diagram: `sequenceDiagram
  participant U as User
  participant API
  participant Inv as Inventory
  participant Pay as Payment
  U->>API: reserve seats
  API->>Inv: lock + hold 10m
  Inv-->>API: hold_id
  U->>Pay: pay(hold_id)
  Pay->>Inv: confirm
  Inv-->>U: tickets issued`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Reserve and confirm',
      code: `POST /v1/shows/{id}/reserve
{ "seat_ids": ["A1","A2"], "idempotency_key": "sess-abc" }
→ 201 { "hold_id": "h1", "expires_at": "..." }

POST /v1/holds/{hold_id}/confirm
{ "payment_method": "..." }
→ 200 { "booking_id": "b1", "tickets": [...] }`,
    },
  ],
  keyTakeaways: [
    'Inventory mutation must be atomic — one winner per seat.',
    'Hold with TTL releases unpurchased seats back to pool.',
    'Flash sale: queue users; rate limit reserve API.',
    'Idempotent confirm links payment to hold once.',
    'Evolve: naive UPDATE → row locks → sharded inventory + waiting room.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How prevent double booking?',
      answerHint: 'Transactional lock, unique constraint on seat+show, or atomic DECR.',
    },
    {
      level: 'intermediate',
      question: 'User abandons cart — when seat available again?',
      answerHint: 'Hold TTL 10 min; sweeper releases expired holds.',
    },
    {
      level: 'advanced',
      question: 'Design 100k users buying 1000 seats in 1 minute?',
      answerHint: 'Virtual waiting room, tokenized purchase window, queue, shard inventory by show.',
    },
  ],
  flashcards: [
    { front: 'Hold TTL', back: 'Temporary reservation; auto-release on expiry or payment failure' },
    { front: 'Optimistic locking', back: 'version column; UPDATE WHERE version=v fails if concurrent' },
    { front: 'Waiting room', back: 'Queue excess users before inventory API access during flash sale' },
  ],
  quickRevision: [
    'Search read-heavy; reserve write-critical',
    'Atomic seat lock per show',
    'Hold 10m + sweeper',
    'Idempotent confirm + payment',
    'Rate limit + waiting room',
    'CP inventory — reject if uncertain',
  ],
  systemDesign: {
    problem:
      'Design BookMyShow-style ticketing: browse shows, pick seats, pay, get QR tickets — support flash sale 50k concurrent users for 500 seats without oversell.',
    requirements: {
      functional: [
        'Browse shows and seat maps',
        'Reserve seats with time-limited hold',
        'Pay and confirm booking',
        'Cancel/refund policy',
        'Issue digital tickets with QR',
      ],
      nonFunctional: [
        'Zero oversell (hard invariant)',
        'Reserve p99 < 300ms under load',
        'Fair flash sale access (no bot dominance)',
        'Idempotent booking on payment retry',
      ],
    },
    scaleAssumptions: [
      '10k events; peak flash 50k concurrent for hot show',
      '500 seats/show typical; 1M bookings/day normal',
      'Seat map read 100:1 vs reserve writes on sale day',
    ],
    capacityEstimates: [
      'Inventory rows: 10k shows × 500 seats = 5M rows — Postgres sharded by show_id',
      'Hold table: 50k concurrent × 200 B ≈ 10 MB hot set in Redis + DB audit',
      'QR tickets: 1M/day storage trivial',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `GET  /v1/shows/{id}/seats
POST /v1/shows/{id}/reserve
POST /v1/holds/{hold_id}/confirm
DELETE /v1/holds/{hold_id}`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'Show: show_id, venue, start_time, seat_map_ref',
          'Seat: show_id, seat_id, status (available|held|sold), version',
          'Hold: hold_id, user_id, seat_ids[], expires_at, idempotency_key',
          'Booking: booking_id, hold_id, payment_id, tickets[]',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Read API serves seat maps from cache. Reserve API hits inventory service — Postgres transaction with row locks per seat or Redis Lua hold script. Payment service confirms idempotently. Waiting room queue gates flash traffic. Sweeper releases expired holds.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  User --> WR[Waiting Room Queue]
  WR --> API[Booking API]
  API --> Inv[Inventory Service]
  Inv --> PG[(Postgres Sharded)]
  Inv --> Redis[(Hold Cache)]
  API --> Pay[Payment Service]
  Sweep[Hold Sweeper] --> Inv
  API --> Ticket[Ticket/QR Service]`,
      caption: 'Queue → reserve → pay → confirm; sweeper recycles holds',
    },
    dataFlow: [
      'Browse seats from read replica / cache',
      'Flash sale: queue assigns purchase token',
      'Reserve: BEGIN; lock seats; mark held; create hold row; COMMIT',
      'Start payment; on success confirm transitions held→sold atomically',
      'On hold expiry sweeper sets available',
      'Generate QR ticket async',
    ],
    storage: [
      'Postgres shard by show_id for inventory',
      'Redis optional fast hold layer synced with DB',
      'S3 for static venue maps',
    ],
    caching: [
      'Seat map cache CDN; invalidate on sold count change (approx OK)',
      'Do not cache writable inventory without version checks',
    ],
    asyncProcessing: [
      'Hold expiry sweeper every 30s',
      'Email ticket delivery',
      'Wait queue admission rate control',
    ],
    scaling: [
      'Shard inventory DB by show_id — hot show isolated',
      'Read replicas for browse',
      'Waiting room absorbs flash read/write spike',
    ],
    consistency: [
      'Strong consistency for seat state (CP)',
      'Browse may show stale available count briefly — confirm server-side',
    ],
    reliability: [
      'Confirm idempotent with payment idempotency key',
      'If payment succeeds but confirm fails → reconciliation job completes booking',
      'Saga: release hold on payment failure',
    ],
    failureScenarios: [
      'Two users reserve same seat → one transaction fails unique constraint',
      'Payment double callback → idempotent confirm returns same booking',
      'DB primary fail during flash → fail closed (503) not oversell',
      'Bot swarm → waiting room + CAPTCHA + rate limits',
    ],
    security: [
      'Auth required to reserve',
      'Rate limit per user/IP',
      'QR signed JWT; scan validates once',
      'Anti-scalping limits seats per account',
    ],
    observability: [
      'Oversell detection invariant job (count sold <= capacity)',
      'Hold conversion rate, queue depth',
      'Reserve latency and lock wait time',
    ],
    bottlenecks: [
      'Row lock contention last seats',
      'Single show shard hotspot',
      'Payment PSP latency on confirm path',
    ],
    alternatives: [
      'All-seat lottery instead of FCFS',
      'Assigned seating vs general admission GA counter',
    ],
    tradeoffs: [
      'Redis hold speed vs Postgres as source of truth',
      'Optimistic vs pessimistic locking under contention',
      'Strict queue fairness vs revenue (VIP early access)',
    ],
    interviewFollowUps: [
      'Design seat map real-time updates to UI?',
      'Group booking 8 adjacent seats?',
      'Secondary resale marketplace?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Read seats, UPDATE available=0 if available=1.',
        bottleneck: 'Race double booking.',
      },
      {
        stage: '2. Improve',
        description: 'SELECT FOR UPDATE + hold TTL + payment confirm.',
        bottleneck: 'Flash sale melts DB; unfair bot access.',
      },
      {
        stage: '3. Improve',
        description: 'Waiting room queue; shard by show; idempotent payment.',
        bottleneck: 'Last-seat lock storms; cross-service confirm failures.',
      },
      {
        stage: '4. Scale further',
        description: 'Redis Lua pre-hold + DB confirm; reconciliation; bot detection ML.',
        bottleneck: 'Hybrid consistency ops complexity.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Clear revenue domain', 'Well-known patterns', 'Strong correctness story'],
    disadvantages: ['Flash sale ops hard', 'Bot/fairness fight', 'Cross-service sagas'],
    alternatives: ['Lottery allocation', 'First-pay-wins without hold (worse UX)'],
    whenToUse: ['Events', 'Airlines', 'Cinema', 'Sports'],
    whenNotToUse: ['Unlimited digital goods — no inventory lock needed'],
  },
  failureModes: [
    'Oversell on race or cache/DB drift',
    'Orphan hold never released — ghost unavailable seats',
    'Payment success without confirm — angry customer',
  ],
  production: {
    performance: ['Shard hot show; minimize lock scope'],
    scalability: ['Waiting room; read/write split'],
    reliability: ['Reconciliation; idempotent confirm; fail closed'],
    security: ['Bot mitigation; signed tickets'],
    observability: ['Oversell invariant alerts'],
    cost: ['Queue infra during rare flash events'],
  },
  interview: {
    expectations: [
      'Atomic inventory + hold TTL mandatory',
      'Flash sale queue story',
      'Payment idempotency and saga',
    ],
    commonQuestions: ['Design ticket booking', 'Prevent double booking?'],
    followUps: ['100k users 1k seats?', 'Seat map live updates?'],
    misconceptions: ['Cache seat availability for writes'],
    traps: ['Check-then-act without transaction'],
    strongSignals: ['Hold TTL, row lock/Lua, waiting room, idempotent confirm, oversell invariant'],
  },
}
