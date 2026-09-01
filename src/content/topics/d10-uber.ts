import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Uber matches riders to nearby drivers in real time — geospatial indexing, supply/demand pricing, trip state machines, and location streaming at city scale.',
  whyExists: 'Taxi dispatch was manual and opaque. Uber needs sub-second driver discovery, accurate ETAs, surge during imbalance, and payment/settlement after trip completion.',
  mentalModel: 'Riders and drivers publish GPS ticks. Geohash/quadtree index finds drivers in radius. Match assigns offer to driver; trip FSM: requested → accepted → in_progress → completed. Surge multiplier from demand/supply ratio per geofence.',
  howItWorks: [
    { type: 'paragraph', text: 'Location service ingests driver heartbeats (every 3–4s) into Redis GEO or geohash shards. Ride request queries nearby available drivers, ranks by ETA/distance/rating. Driver app receives offer with timeout; accept locks driver. Pricing service applies base fare + distance + time + surge.' },
    { type: 'mermaid', caption: 'Match flow', diagram: "flowchart TB\n  R[Rider request] --> Match[Matching Service]\n  Match --> Geo[Geo Index]\n  Geo --> Offer[Push offer to drivers]\n  Offer --> Trip[Trip state machine]\n  Trip --> Pay[Payment settle]" },
  ],
  example: [
    { type: 'code', language: 'http', caption: 'Core ride APIs', code: "POST /v1/rides  { pickup, dropoff, tier }\n→ 202 { ride_id, status: \"searching\", surge_multiplier }\n\nPOST /v1/drivers/{id}/location  { lat, lng, heading }\nGET  /v1/rides/{id}  → status, driver, eta" },
  ],
  keyTakeaways: [
    'Geo index (Redis GEO, geohash, H3) for nearby driver queries.',
    'Trip state machine with idempotent transitions.',
    'Surge pricing from supply/demand per cell — not global.',
    'Location updates high volume — separate path from ride API.',
    'Evolve: monolith dispatch → geo-sharded location + async matching.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How find drivers near a rider?', answerHint: 'Geospatial index; query radius; filter available status.' },
    { level: 'intermediate', question: 'How handle surge pricing?', answerHint: 'Demand/supply ratio per geofence; multiplier cache; cap UX.' },
    { level: 'advanced', question: 'Driver location at 1M updates/s — architecture?', answerHint: 'Partition by geohash; Redis cluster; batch to analytics; WebSocket gateway.' },
  ],
  flashcards: [
    { front: 'Geo index choice', back: 'Redis GEO / geohash tiles / H3 hex cells' },
    { front: 'Surge', back: 'Local demand/supply ratio → multiplier' },
    { front: 'Trip FSM', back: 'requested → matched → ongoing → completed/cancelled' },
  ],
  quickRevision: [
    'Location stream → geo index',
    'Match ranks ETA + distance',
    'Offer timeout + driver lock',
    'Surge per geofence',
    'Payment after trip complete',
    'Separate location write path',
  ],
  systemDesign: {
    problem: 'Design Uber ride-hailing for 100M monthly riders, 5M drivers, peak 1M concurrent trips, match within 30s p99.',
    requirements: {
      functional: [
        'Request ride with pickup/dropoff',
        'Match driver and track trip',
        'Surge pricing display',
        'Driver location updates',
        'Payment and receipt',
      ],
      nonFunctional: [
        'Match p99 < 30s',
        'Location ingest 500k updates/s',
        'Strong consistency for trip billing',
        '99.9% availability in metro',
      ],
    },
    scaleAssumptions: [
    '100M riders, 5M drivers, 15M rides/day',
    'Driver ping every 4s → ~1.25M location writes/s',
    'Avg trip 20 min, 3 concurrent rides per driver peak',
    ],
    capacityEstimates: [
    'Location: 1.25M writes/s × 50 B ≈ 62 MB/s ingest',
    'Trip DB: 15M rides/day rows + state history — sharded SQL',
    'Geo index memory: active drivers × geohash entries in Redis cluster',
    ],
    api: [
    { type: 'code', language: 'http', code: "POST /v1/rides\nPOST /v1/drivers/{id}/location\nPATCH /v1/rides/{id}/status" },
    ],
    dataModel: [
    { type: 'list', items: [
      'Driver: id, status, vehicle, rating, current_geohash',
      'Ride: id, rider_id, driver_id, status, fare_breakdown, route_polyline',
      'LocationTick: driver_id, lat, lng, ts (TTL stream)',
      'SurgeCell: geohash, multiplier, updated_at',
    ] },
    ],
    highLevelArchitecture: [
    { type: 'paragraph', text: 'Mobile apps → API gateway → Ride/Match/Pricing/Location microservices. Location writes to Kafka → geo index updaters. Match reads geo + driver status. Payment service on trip complete.' },
    ],
    diagram: {
      mermaid: "flowchart LR\n  Apps --> GW[Gateway]\n  GW --> Match[Matching]\n  GW --> Loc[Location]\n  Loc --> Kafka[Kafka]\n  Kafka --> Geo[(Redis GEO)]\n  Match --> Geo\n  Match --> TripDB[(Trips)]",
      caption: 'Decoupled location ingest from matching',
    },
    dataFlow: [
    'Driver ping → Kafka → update GEO + last_seen',
    'Ride request → surge lookup → geo query → rank drivers → push offer',
    'Accept → lock driver → trip ongoing → route ETA',
    'Complete → fare calc → payment → release driver',
    ],
    storage: [
    'Sharded Postgres for trips/users',
    'Redis GEO for hot driver positions',
    'S3 for route history optional',
    ],
    caching: [
    'Surge multipliers per cell in Redis',
    'Driver profile cache',
    'ETA matrix cache between popular points',
    ],
    asyncProcessing: [
    'Receipt email',
    'Fraud scoring',
    'Surge recalc every minute per cell',
    ],
    scaling: [
    'Geo partition by city/geohash',
    'Location consumers scale with Kafka partitions',
    'Match service horizontal with sticky geohash routing',
    ],
    consistency: [
    'Trip state transitions transactional',
    'Location eventually consistent (seconds OK)',
    'Payment strong idempotent',
    ],
    reliability: [
    'Offer retry to next driver on timeout',
    'Idempotent ride create with client token',
    'Circuit break payment provider',
    ],
    failureScenarios: [
    'Geo index stale → match far driver',
    'Surge bug → PR crisis',
    'Payment double charge without idempotency key',
    ],
    security: [
    'Verify rider/driver identity',
    'Rate limit ride spam',
    'Encrypt PII; mask phone proxy',
    ],
    observability: [
    'Match latency, offer accept rate, surge coverage',
    'Location lag, geo query p99',
    'Trip cancellation reasons',
    ],
    bottlenecks: [
    'Hot geohash during events',
    'Sequential match in dense downtown',
    'Payment provider latency',
    ],
    alternatives: [
    'Batch dispatch (not real-time Uber)',
    'Third-party maps/routing APIs',
    ],
    tradeoffs: [
    'Redis GEO vs dedicated spatial DB',
    'Push all drivers vs pull nearest N',
    'Global vs cell surge',
    ],
    interviewFollowUps: [
    'Design Uber Pool matching?',
    'Handle GPS spoofing?',
    'Multi-stop rides?',
    ],
    evolution: [
      { stage: '1. Simple design', description: 'Monolith + single DB.', bottleneck: 'Vertical scale limit.', },
      { stage: '2. Improve', description: 'Cache + read replicas.', bottleneck: 'Write bottleneck remains.', },
      { stage: '3. Improve', description: 'Async pipeline + sharding.', bottleneck: 'Ops complexity.', },
      { stage: '4. Scale further', description: 'Geo partition + dedicated services.', bottleneck: 'Consistency across regions.', },
    ],
  },
  tradeoffs: {
    advantages: [
    'Real-time geo index scales reads',
    'Cell surge localizes pricing',
    ],
    disadvantages: [
    'Location write storm',
    'Match fairness hard',
    ],
    alternatives: [
    'Scheduled rides only',
    'Fleet-owned dispatch',
    ],
    whenToUse: [
    'On-demand mobility',
    ],
    whenNotToUse: [
    'Fixed route transit without live supply',
    ],
  },
  failureModes: [
    'Double assignment if driver lock fails',
    'Stale location → bad ETA',
    'Surge applied wrong geofence',
  ],
  production: {
    performance: [
      'Geo query bounded radius; pre-filter available',
    ],
    scalability: [
      'Partition location by city',
    ],
    reliability: [
      'Trip idempotency keys',
    ],
    security: [
      'Proxy numbers; auth on every trip API',
    ],
    observability: [
      'Match funnel metrics',
    ],
    cost: [
      'Location ingest dominates — sample analytics ticks',
    ],
  },
  interview: {
    expectations: [
      'Geo index + trip FSM + surge',
    ],
    commonQuestions: [
      'Design Uber',
      'Find nearby drivers?',
    ],
    followUps: [
      'Pool rides?',
      'Cancellation fees?',
    ],
    misconceptions: [
      'Global surge multiplier',
    ],
    traps: [
      'SQL lat/lng without index',
    ],
    strongSignals: [
      'Redis GEO/Kafka location, cell surge, offer timeout chain',
    ],
  },
}
