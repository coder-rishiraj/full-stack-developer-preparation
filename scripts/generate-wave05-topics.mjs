#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../src/content/topics')

function q(s) {
  if (typeof s !== 'string') return JSON.stringify(s)
  if (s.includes("'") || s.includes('"') || s.includes('\n') || s.includes('`'))
    return JSON.stringify(s)
  return `'${s}'`
}

function lines(arr, indent = 4) {
  const pad = ' '.repeat(indent)
  return arr.map((s) => `${pad}${q(s)},`).join('\n')
}

function blocks(arr) {
  return arr
    .map((b) => {
      if (b.type === 'paragraph')
        return `    { type: 'paragraph', text: ${q(b.text)} },`
      if (b.type === 'list')
        return `    { type: 'list',${b.ordered ? ' ordered: true,' : ''} items: [\n${lines(b.items, 6)}\n    ] },`
      if (b.type === 'code')
        return `    { type: 'code', language: ${q(b.language)},${b.caption ? ` caption: ${q(b.caption)},` : ''} code: ${q(b.code)} },`
      if (b.type === 'mermaid')
        return `    { type: 'mermaid', caption: ${q(b.caption || '')}, diagram: ${q(b.diagram)} },`
      return ''
    })
    .join('\n')
}

function tradeoffs(t) {
  return `  tradeoffs: {
    advantages: [\n${lines(t.advantages)}\n    ],
    disadvantages: [\n${lines(t.disadvantages)}\n    ],
    alternatives: [\n${lines(t.alternatives)}\n    ],
    whenToUse: [\n${lines(t.whenToUse)}\n    ],
    whenNotToUse: [\n${lines(t.whenNotToUse)}\n    ],
  },`
}

function production(p) {
  const keys = ['performance', 'scalability', 'reliability', 'security', 'observability', 'maintainability', 'cost']
  const parts = keys
    .filter((k) => p[k]?.length)
    .map((k) => `    ${k}: [\n${lines(p[k], 6)}\n    ],`)
  return `  production: {\n${parts.join('\n')}\n  },`
}

function interview(i) {
  const keys = ['expectations', 'commonQuestions', 'followUps', 'misconceptions', 'traps', 'strongSignals']
  const parts = keys.map((k) => `    ${k}: [\n${lines(i[k], 6)}\n    ],`)
  return `  interview: {\n${parts.join('\n')}\n  },`
}

function iqs(arr) {
  return arr
    .map(
      (x) =>
        `    { level: ${q(x.level)}, question: ${q(x.question)}, answerHint: ${q(x.answerHint)} },`
    )
    .join('\n')
}

function flashcards(arr) {
  return arr.map((f) => `    { front: ${q(f.front)}, back: ${q(f.back)} },`).join('\n')
}

function systemDesign(sd) {
  return `  systemDesign: {
    problem: ${q(sd.problem)},
    requirements: {
      functional: [\n${lines(sd.functional, 8)}\n      ],
      nonFunctional: [\n${lines(sd.nonFunctional, 8)}\n      ],
    },
    scaleAssumptions: [\n${lines(sd.scaleAssumptions)}\n    ],
    capacityEstimates: [\n${lines(sd.capacityEstimates)}\n    ],
    api: [\n${blocks(sd.apiBlocks || [])}\n    ],
    dataModel: [\n${blocks(sd.dataModelBlocks || [])}\n    ],
    highLevelArchitecture: [\n${blocks(sd.archBlocks || [])}\n    ],
    diagram: {
      mermaid: ${q(sd.mermaid)},
      caption: ${q(sd.diagramCaption || '')},
    },
    dataFlow: [\n${lines(sd.dataFlow)}\n    ],
    storage: [\n${lines(sd.storage)}\n    ],
    caching: [\n${lines(sd.caching)}\n    ],
    asyncProcessing: [\n${lines(sd.asyncProcessing)}\n    ],
    scaling: [\n${lines(sd.scaling)}\n    ],
    consistency: [\n${lines(sd.consistency)}\n    ],
    reliability: [\n${lines(sd.reliability)}\n    ],
    failureScenarios: [\n${lines(sd.failureScenarios)}\n    ],
    security: [\n${lines(sd.security)}\n    ],
    observability: [\n${lines(sd.observability)}\n    ],
    bottlenecks: [\n${lines(sd.bottlenecks)}\n    ],
    alternatives: [\n${lines(sd.alternatives)}\n    ],
    tradeoffs: [\n${lines(sd.sdTradeoffs)}\n    ],
    interviewFollowUps: [\n${lines(sd.interviewFollowUps)}\n    ],
    evolution: [\n${sd.evolution
      .map(
        (e) =>
          `      { stage: ${q(e.stage)}, description: ${q(e.description)},${e.bottleneck ? ` bottleneck: ${q(e.bottleneck)},` : ''} },`
      )
      .join('\n')}\n    ],
  },`
}

function render(id, t) {
  const how = t.howItWorks?.length ? `\n  howItWorks: [\n${blocks(t.howItWorks)}\n  ],` : ''
  const ex = t.example?.length ? `\n  example: [\n${blocks(t.example)}\n  ],` : ''
  const sd = t.systemDesign ? `\n${systemDesign(t.systemDesign)}` : ''
  return `import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: ${q(t.whatIsIt)},
  whyExists: ${q(t.whyExists)},
  mentalModel: ${q(t.mentalModel)},${how}${ex}
  keyTakeaways: [\n${lines(t.keyTakeaways)}\n  ],
  interviewQuestions: [\n${iqs(t.interviewQuestions)}\n  ],
  flashcards: [\n${flashcards(t.flashcards)}\n  ],
  quickRevision: [\n${lines(t.quickRevision)}\n  ],${sd}
${tradeoffs(t.tradeoffs)}
  failureModes: [\n${lines(t.failureModes)}\n  ],
${production(t.production)}
${interview(t.interview)}
}
`
}

const sdBase = (overrides) => ({
  scaleAssumptions: ['Clarify DAU and peak QPS in interview'],
  capacityEstimates: ['Back-of-envelope storage and bandwidth from QPS × payload'],
  apiBlocks: [{ type: 'code', language: 'http', code: 'GET /health → 200' }],
  dataModelBlocks: [{ type: 'list', items: ['Core entities with primary keys and indexes'] }],
  archBlocks: [{ type: 'paragraph', text: 'Clients → CDN/LB → stateless services → data stores.' }],
  mermaid: 'flowchart LR\n  C[Client] --> API[API]\n  API --> DB[(Database)]',
  diagramCaption: 'High-level request path',
  dataFlow: ['Request validated → business logic → persistence → response'],
  storage: ['Primary database; object store for blobs if needed'],
  caching: ['CDN for static; Redis for hot reads'],
  asyncProcessing: ['Background workers for heavy or non-critical work'],
  scaling: ['Horizontal stateless tier; shard data by key'],
  consistency: ['Strong for money/auth; eventual for analytics'],
  reliability: ['Retries with backoff; idempotent writes'],
  failureScenarios: ['Hot keys; dependency timeout; partial outage'],
  security: ['AuthN/Z, rate limits, input validation'],
  observability: ['RED/USE metrics, tracing, SLO dashboards'],
  bottlenecks: ['Database write path; fan-out; cold cache'],
  alternatives: ['Managed SaaS for non-differentiating parts'],
  sdTradeoffs: ['Complexity vs time-to-market'],
  interviewFollowUps: ['Multi-region?', 'Cost at 10× scale?'],
  evolution: [
    { stage: '1. Simple design', description: 'Monolith + single DB.', bottleneck: 'Vertical scale limit.' },
    { stage: '2. Improve', description: 'Cache + read replicas.', bottleneck: 'Write bottleneck remains.' },
    { stage: '3. Improve', description: 'Async pipeline + sharding.', bottleneck: 'Ops complexity.' },
    { stage: '4. Scale further', description: 'Geo partition + dedicated services.', bottleneck: 'Consistency across regions.' },
  ],
  ...overrides,
})

const topics = {
  'd10-uber': {
    whatIsIt:
      'Uber matches riders to nearby drivers in real time — geospatial indexing, supply/demand pricing, trip state machines, and location streaming at city scale.',
    whyExists:
      'Taxi dispatch was manual and opaque. Uber needs sub-second driver discovery, accurate ETAs, surge during imbalance, and payment/settlement after trip completion.',
    mentalModel:
      'Riders and drivers publish GPS ticks. Geohash/quadtree index finds drivers in radius. Match assigns offer to driver; trip FSM: requested → accepted → in_progress → completed. Surge multiplier from demand/supply ratio per geofence.',
    howItWorks: [
      {
        type: 'paragraph',
        text: 'Location service ingests driver heartbeats (every 3–4s) into Redis GEO or geohash shards. Ride request queries nearby available drivers, ranks by ETA/distance/rating. Driver app receives offer with timeout; accept locks driver. Pricing service applies base fare + distance + time + surge.',
      },
      {
        type: 'mermaid',
        caption: 'Match flow',
        diagram: `flowchart TB
  R[Rider request] --> Match[Matching Service]
  Match --> Geo[Geo Index]
  Geo --> Offer[Push offer to drivers]
  Offer --> Trip[Trip state machine]
  Trip --> Pay[Payment settle]`,
      },
    ],
    example: [
      {
        type: 'code',
        language: 'http',
        caption: 'Core ride APIs',
        code: `POST /v1/rides  { pickup, dropoff, tier }
→ 202 { ride_id, status: "searching", surge_multiplier }

POST /v1/drivers/{id}/location  { lat, lng, heading }
GET  /v1/rides/{id}  → status, driver, eta`,
      },
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
    quickRevision: ['Location stream → geo index', 'Match ranks ETA + distance', 'Offer timeout + driver lock', 'Surge per geofence', 'Payment after trip complete', 'Separate location write path'],
    systemDesign: sdBase({
      problem: 'Design Uber ride-hailing for 100M monthly riders, 5M drivers, peak 1M concurrent trips, match within 30s p99.',
      functional: ['Request ride with pickup/dropoff', 'Match driver and track trip', 'Surge pricing display', 'Driver location updates', 'Payment and receipt'],
      nonFunctional: ['Match p99 < 30s', 'Location ingest 500k updates/s', 'Strong consistency for trip billing', '99.9% availability in metro'],
      scaleAssumptions: ['100M riders, 5M drivers, 15M rides/day', 'Driver ping every 4s → ~1.25M location writes/s', 'Avg trip 20 min, 3 concurrent rides per driver peak'],
      capacityEstimates: [
        'Location: 1.25M writes/s × 50 B ≈ 62 MB/s ingest',
        'Trip DB: 15M rides/day rows + state history — sharded SQL',
        'Geo index memory: active drivers × geohash entries in Redis cluster',
      ],
      apiBlocks: [{ type: 'code', language: 'http', code: `POST /v1/rides\nPOST /v1/drivers/{id}/location\nPATCH /v1/rides/{id}/status` }],
      dataModelBlocks: [{ type: 'list', items: ['Driver: id, status, vehicle, rating, current_geohash', 'Ride: id, rider_id, driver_id, status, fare_breakdown, route_polyline', 'LocationTick: driver_id, lat, lng, ts (TTL stream)', 'SurgeCell: geohash, multiplier, updated_at'] }],
      archBlocks: [{ type: 'paragraph', text: 'Mobile apps → API gateway → Ride/Match/Pricing/Location microservices. Location writes to Kafka → geo index updaters. Match reads geo + driver status. Payment service on trip complete.' }],
      mermaid: `flowchart LR
  Apps --> GW[Gateway]
  GW --> Match[Matching]
  GW --> Loc[Location]
  Loc --> Kafka[Kafka]
  Kafka --> Geo[(Redis GEO)]
  Match --> Geo
  Match --> TripDB[(Trips)]`,
      diagramCaption: 'Decoupled location ingest from matching',
      dataFlow: ['Driver ping → Kafka → update GEO + last_seen', 'Ride request → surge lookup → geo query → rank drivers → push offer', 'Accept → lock driver → trip ongoing → route ETA', 'Complete → fare calc → payment → release driver'],
      storage: ['Sharded Postgres for trips/users', 'Redis GEO for hot driver positions', 'S3 for route history optional'],
      caching: ['Surge multipliers per cell in Redis', 'Driver profile cache', 'ETA matrix cache between popular points'],
      asyncProcessing: ['Receipt email', 'Fraud scoring', 'Surge recalc every minute per cell'],
      scaling: ['Geo partition by city/geohash', 'Location consumers scale with Kafka partitions', 'Match service horizontal with sticky geohash routing'],
      consistency: ['Trip state transitions transactional', 'Location eventually consistent (seconds OK)', 'Payment strong idempotent'],
      reliability: ['Offer retry to next driver on timeout', 'Idempotent ride create with client token', 'Circuit break payment provider'],
      failureScenarios: ['Geo index stale → match far driver', 'Surge bug → PR crisis', 'Payment double charge without idempotency key'],
      security: ['Verify rider/driver identity', 'Rate limit ride spam', 'Encrypt PII; mask phone proxy'],
      observability: ['Match latency, offer accept rate, surge coverage', 'Location lag, geo query p99', 'Trip cancellation reasons'],
      bottlenecks: ['Hot geohash during events', 'Sequential match in dense downtown', 'Payment provider latency'],
      alternatives: ['Batch dispatch (not real-time Uber)', 'Third-party maps/routing APIs'],
      sdTradeoffs: ['Redis GEO vs dedicated spatial DB', 'Push all drivers vs pull nearest N', 'Global vs cell surge'],
      interviewFollowUps: ['Design Uber Pool matching?', 'Handle GPS spoofing?', 'Multi-stop rides?'],
    }),
    tradeoffs: { advantages: ['Real-time geo index scales reads', 'Cell surge localizes pricing'], disadvantages: ['Location write storm', 'Match fairness hard'], alternatives: ['Scheduled rides only', 'Fleet-owned dispatch'], whenToUse: ['On-demand mobility'], whenNotToUse: ['Fixed route transit without live supply'] },
    failureModes: ['Double assignment if driver lock fails', 'Stale location → bad ETA', 'Surge applied wrong geofence'],
    production: { performance: ['Geo query bounded radius; pre-filter available'], scalability: ['Partition location by city'], reliability: ['Trip idempotency keys'], security: ['Proxy numbers; auth on every trip API'], observability: ['Match funnel metrics'], cost: ['Location ingest dominates — sample analytics ticks'] },
    interview: { expectations: ['Geo index + trip FSM + surge'], commonQuestions: ['Design Uber', 'Find nearby drivers?'], followUps: ['Pool rides?', 'Cancellation fees?'], misconceptions: ['Global surge multiplier'], traps: ['SQL lat/lng without index'], strongSignals: ['Redis GEO/Kafka location, cell surge, offer timeout chain'] },
  },

  'd10-url-shortener': {
    whatIsIt:
      'A URL shortener maps short codes to long URLs — optimized for fast redirects, unique key generation, analytics, and abuse resistance at billions of clicks.',
    whyExists:
      'Long URLs break SMS/social limits and are ugly. Shorteners need O(1) lookup redirects, optional custom aliases, click analytics, and TTL for ephemeral links.',
    mentalModel:
      'Short code is primary key → long URL row or cache entry. Redirect 301/302 from edge. Create: hash or random base62 + collision check. Read-heavy — CDN/cache fronting.',
    howItWorks: [{ type: 'paragraph', text: 'Generate 7-char base62 id (or counter + obfuscation). Store mapping in SQL/Dynamo with long_url, owner, created_at, expires_at. Redirect service reads cache-aside Redis then DB. Analytics async via click stream to Kafka.' }],
    example: [{ type: 'code', language: 'http', code: `POST /api/shorten { "url": "https://..." }\n→ 201 { "short": "https://go/x7Kp2" }\n\nGET /x7Kp2 → 302 Location: long URL` }],
    keyTakeaways: ['Random base62 avoids enumeration vs sequential ids', '302 vs 301 tradeoff for analytics vs SEO', 'Cache hot codes at CDN/Redis', 'Separate read redirect path from admin API', 'Evolve: single DB → cache-aside → geo CDN'],
    interviewQuestions: [
      { level: 'basic', question: 'How generate unique short codes?', answerHint: 'Random base62 + DB unique constraint retry; or Snowflake encoded.' },
      { level: 'intermediate', question: '301 vs 302 redirect?', answerHint: '301 cached by browsers — hurts analytics; 302 allows counting each click.' },
      { level: 'advanced', question: '10B redirects/day architecture?', answerHint: 'CDN edge redirect table; origin on miss; async analytics; regional cache.' },
    ],
    flashcards: [
      { front: '302 vs 301', back: '302 for click tracking; 301 permanent SEO' },
      { front: 'Id generation', back: 'Random base62, not sequential integers' },
      { front: 'Read pattern', back: 'Cache-aside Redis + CDN for hot links' },
    ],
    quickRevision: ['POST shorten → code', 'GET redirect 302', 'Redis cache-aside', 'Async click analytics', 'Rate limit create', 'High entropy codes'],
    systemDesign: sdBase({
      problem: 'Design bit.ly: 100M new URLs/month, 10:1 read/write, 100B redirects/month, custom aliases optional.',
      functional: ['Shorten URL', 'Redirect by code', 'Custom alias (premium)', 'Analytics dashboard', 'Link expiry'],
      nonFunctional: ['Redirect p99 < 50ms', 'No lost mappings', 'Prevent link enumeration', 'Global low latency'],
      scaleAssumptions: ['100M creates/month (~40/s avg)', '1B redirects/day (~12k/s avg, 100k peak)', 'Avg long URL 100 chars'],
      capacityEstimates: ['100M rows/month × 200 B meta ≈ 20 GB/month metadata', 'Redirect bandwidth dominated by 302 headers not bodies', 'Redis: top 1% links serve 80% reads'],
      apiBlocks: [{ type: 'code', language: 'http', code: `POST /v1/links\nGET  /{code}  → 302\nGET  /v1/links/{code}/stats` }],
      dataModelBlocks: [{ type: 'list', items: ['Link: code PK, long_url, user_id, created_at, expires_at, click_count_approx', 'CustomAlias: alias PK → code FK'] }],
      mermaid: `flowchart LR
  User --> CDN[CDN/Edge]
  CDN -->|miss| RS[Redirect Svc]
  RS --> Redis[(Redis)]
  RS --> DB[(Links DB)]
  RS --> Q[Click Queue]`,
      dataFlow: ['Create: validate URL → gen code → insert → return short URL', 'Redirect: lookup cache → DB on miss → 302 + enqueue click', 'Analytics worker aggregates clicks'],
      caching: ['Redis cache-aside per code', 'CDN cache 302 with short TTL if analytics need origin hits'],
      asyncProcessing: ['Click aggregation', 'Malware URL scan on create'],
      bottlenecks: ['Viral link hot key in Redis', 'DB on cache cold start'],
      interviewFollowUps: ['Custom domain per user?', 'Preview page before redirect?'],
    }),
    tradeoffs: { advantages: ['Simple read-heavy cache pattern'], disadvantages: ['Abuse/phishing links', 'Cache vs analytics tension'], alternatives: ['Browser bookmark', 'DNS-level short domains'], whenToUse: ['Marketing links', 'SMS campaigns'], whenNotToUse: ['When you need end-to-end encryption of destination'] },
    failureModes: ['Sequential ids scraped', 'Cache stampede on viral link', 'Malware link reputation damage'],
    production: { performance: ['Edge redirect; minimal response body'], scalability: ['Redis cluster; read replicas'], reliability: ['Unique constraint on code gen retry'], security: ['Blocklist URLs; rate limit create'], observability: ['Redirect latency, cache hit ratio'], cost: ['CDN egress minimal for 302'] },
    interview: { expectations: ['Base62 ids, cache-aside, 302 analytics'], commonQuestions: ['Design URL shortener'], followUps: ['Custom alias collision?'], misconceptions: ['Store only in cache'], traps: ['Auto-increment ids'], strongSignals: ['302 + async clicks, random codes, CDN'] },
  },

  'd10-youtube': {
    whatIsIt:
      'YouTube stores, transcodes, and delivers video globally — upload pipeline, adaptive bitrate streaming (DASH/HLS), CDN edge cache, metadata/search, and engagement (views, likes, comments).',
    whyExists:
      'Raw video files are huge and device/network heterogeneous. YouTube needs durable storage, multi-resolution transcoding, CDN delivery, and recommendation at exabyte scale.',
    mentalModel:
      'Upload → blob store → transcode farm produces 144p–4K renditions → manifest (DASH) → CDN caches segments. Metadata in DB; view counts async. Search index separate from video bytes.',
    howItWorks: [
      { type: 'paragraph', text: 'Resumable upload to object storage. Transcoding queue (priority by channel size). Each rendition chunked (2–10s segments). Player requests manifest then adaptive segments based on bandwidth. Popular videos fully CDN-cached; long tail origin fetch.' },
      { type: 'mermaid', caption: 'Upload to playback', diagram: `flowchart LR
  Up[Upload] --> S3[(Raw)]
  S3 --> TC[Transcode]
  TC --> Seg[Segments]
  Seg --> CDN[CDN]
  Play[Player] --> CDN` },
    ],
    example: [{ type: 'code', language: 'http', code: `POST /upload/init → upload_url\nPUT  chunks to storage\nPOST /upload/complete → video_id\n\nGET /v1/videos/{id}/manifest.mpd` }],
    keyTakeaways: ['Separate metadata DB from video blobs', 'Transcoding async — upload != watchable immediately', 'Adaptive bitrate via segment manifests', 'View counts eventual (Kafka aggregate)', 'Evolve: single server → object store + CDN + transcode farm'],
    interviewQuestions: [
      { level: 'basic', question: 'Where store video bytes vs title/tags?', answerHint: 'Object storage/CDN for bytes; SQL/NoSQL for metadata.' },
      { level: 'intermediate', question: 'How adaptive streaming works?', answerHint: 'Manifest lists renditions; player switches segment quality by bandwidth.' },
      { level: 'advanced', question: 'Design view counter at 1B views/day?', answerHint: 'Increment in Redis/local aggregate; flush to DB; approximate OK.' },
    ],
    flashcards: [
      { front: 'Transcode pipeline', back: 'Raw upload → queue → multi-bitrate segments' },
      { front: 'DASH/HLS', back: 'Manifest + chunked segments for ABR' },
      { front: 'View counts', back: 'Async aggregate; eventual consistency' },
    ],
    quickRevision: ['Resumable upload', 'Async transcode', 'CDN segment cache', 'Metadata vs blob split', 'Search index async', 'ABR manifest'],
    systemDesign: sdBase({
      problem: 'Design YouTube: 500M hours uploaded/day equivalent scale discussion, 1B DAU, global playback p99 startup < 2s on CDN hit.',
      functional: ['Upload video', 'Transcode multi quality', 'Stream playback', 'Search and recommendations', 'Comments and likes'],
      nonFunctional: ['Playback startup < 2s cached', 'Durability 11 nines for originals', 'Upload resume on failure', 'Copyright detection async'],
      scaleAssumptions: ['500 hours video/min upload (illustrative)', '80% views on top 20% videos', 'Avg 5 Mbps playback'],
      capacityEstimates: ['Storage exabytes — tiered hot/warm/cold', 'Transcode CPU bound — elastic worker pool', 'CDN egress dominates cost'],
      dataModelBlocks: [{ type: 'list', items: ['Video: id, owner, title, status processing|ready, manifest_urls', 'Segment: video_id, resolution, s3_key pattern', 'ViewAggregate: video_id, count, window'] }],
      mermaid: `flowchart TB
  U[Uploader] --> Ingest[Ingest API]
  Ingest --> Raw[(Object Store)]
  Raw --> WF[Transcode Workers]
  WF --> Seg[(Segments)]
  Seg --> CDN[CDN]
  P[Player] --> CDN`,
      dataFlow: ['Upload chunks → assemble raw → enqueue transcode', 'Workers produce renditions + manifest', 'Publish metadata when ready', 'Play: manifest → segment requests from CDN', 'View event → Kafka → counter service'],
      storage: ['Object store for raw and segments', 'Cassandra/Spanner for metadata at scale'],
      caching: ['CDN edge for segments; origin shield'],
      asyncProcessing: ['Transcoding', 'Content ID scan', 'Search index update', 'Thumbnail generation'],
      bottlenecks: ['Transcode backlog for new uploads', 'CDN miss on long tail', 'Hot video single key — mitigated by CDN'],
      interviewFollowUps: ['Live streaming vs VOD?', 'Copyright Content ID?'],
    }),
    tradeoffs: { advantages: ['CDN scales reads', 'ABR fits networks'], disadvantages: ['Transcode cost and delay', 'View count complexity'], alternatives: ['Single MP4 progressive download (no ABR)'], whenToUse: ['User-generated video platforms'], whenNotToUse: ['Tiny static hosting'] },
    failureModes: ['Upload without transcode stuck processing', 'CDN cache poison wrong segment', 'View counter double count without idempotent events'],
    production: { performance: ['CDN-first playback; prefetch manifest'], scalability: ['Elastic transcode workers'], reliability: ['Resumable uploads'], security: ['Signed URLs for private video'], observability: ['Transcode queue depth, CDN hit ratio'], cost: ['Storage tiering; transcode only needed renditions'] },
    interview: { expectations: ['Blob vs metadata, transcode, CDN, ABR'], commonQuestions: ['Design YouTube'], followUps: ['Live vs VOD?'], misconceptions: ['Store video in SQL BLOB'], traps: ['Synchronous transcode on upload API'], strongSignals: ['Segment CDN, async transcode, Kafka views'] },
  },
}

// Continue with remaining topics in part 2 - load from JSON or inline
// For brevity in script maintenance, define factory for CSS/FE/Python topics

function feTopic(cfg) {
  return {
    whatIsIt: cfg.whatIsIt,
    whyExists: cfg.whyExists,
    mentalModel: cfg.mentalModel,
    howItWorks: cfg.howItWorks || [{ type: 'paragraph', text: cfg.howText || cfg.mentalModel }],
    example: cfg.example || [],
    keyTakeaways: cfg.keyTakeaways,
    interviewQuestions: cfg.interviewQuestions,
    flashcards: cfg.flashcards,
    quickRevision: cfg.quickRevision,
    tradeoffs: cfg.tradeoffs,
    failureModes: cfg.failureModes,
    production: cfg.production || { maintainability: ['Follow team conventions and document decisions'] },
    interview: cfg.interview,
  }
}

Object.assign(topics, {
  'b5-accessibility': feTopic({
    whatIsIt:
      'Web accessibility (a11y) ensures people with disabilities can perceive, operate, understand, and robustly use UIs — WCAG guidelines, assistive tech compatibility, and inclusive design.',
    whyExists:
      'Legal requirements (ADA, EAA), moral inclusion, and business reach (~15%+ users). Inaccessible sites fail keyboard users, screen reader users, and low-vision users.',
    mentalModel:
      'POUR: Perceivable (text alt, contrast), Operable (keyboard, focus), Understandable (labels, errors), Robust (semantic HTML + ARIA when needed). Test with keyboard only and screen reader.',
    howItWorks: [
      { type: 'list', items: ['Semantic HTML first — buttons are button, not div onclick', 'Visible focus indicators; logical tab order', 'Color contrast WCAG AA 4.5:1 text', 'Captions/transcripts for media', 'Skip links and landmark regions'] },
    ],
    example: [{ type: 'code', language: 'html', caption: 'Accessible button vs anti-pattern', code: `<button type="button">Save</button>\n<!-- not: -->\n<div onclick="save()">Save</div>` }],
    keyTakeaways: ['Semantic HTML beats ARIA hacks', 'Keyboard path must mirror mouse path', 'Contrast and focus visible are non-negotiable', 'a11y is shift-left not audit-only', 'Screen readers use DOM accessibility tree'],
    interviewQuestions: [
      { level: 'basic', question: 'What is WCAG?', answerHint: 'Web Content Accessibility Guidelines — POUR principles, levels A/AA/AAA.' },
      { level: 'intermediate', question: 'How test accessibility without tools only?', answerHint: 'Keyboard-only navigation, zoom 200%, screen reader smoke, pause animations.' },
      { level: 'advanced', question: 'When is ARIA required?', answerHint: 'When native HTML cannot express role/state — prefer native elements first.' },
    ],
    flashcards: [
      { front: 'POUR', back: 'Perceivable, Operable, Understandable, Robust' },
      { front: 'First a11y fix', back: 'Use correct semantic HTML element' },
      { front: 'WCAG AA contrast', back: '4.5:1 normal text; 3:1 large text' },
    ],
    quickRevision: ['Semantic HTML first', 'Keyboard + focus', 'Contrast AA', 'Alt text meaningful', 'Labels on inputs', 'Do not disable zoom'],
    tradeoffs: { advantages: ['Broader audience', 'Better SEO/UX for all'], disadvantages: ['Extra design/dev time if bolted on late'], alternatives: ['Separate accessible site (bad)'], whenToUse: ['All production UIs'], whenNotToUse: ['Never skip for public apps'] },
    failureModes: ['Div buttons unreachable by keyboard', 'Icon-only controls without aria-label', 'Low contrast gray on white', 'Removing focus outline without replacement'],
    production: { maintainability: ['Lint jsx-a11y; axe in CI'], security: ['a11y unrelated but forms need accessible errors'], observability: ['Track a11y bug reports in support'] },
    interview: { expectations: ['POUR, keyboard, semantic HTML'], commonQuestions: ['Make modal accessible?'], followUps: ['WCAG levels?'], misconceptions: ['ARIA fixes bad HTML'], traps: ['tabindex > 0 everywhere'], strongSignals: ['Native elements, focus trap in modals, live regions for async'] },
  }),

  'b5-aria': feTopic({
    whatIsIt:
      'ARIA (Accessible Rich Internet Applications) adds roles, states, and properties to expose custom widget semantics to assistive technology when native HTML is insufficient.',
    whyExists:
      'Complex SPAs use div-based widgets. Browsers expose built-in semantics for native controls; ARIA bridges gaps for tabs, comboboxes, live regions — only when HTML cannot.',
    mentalModel:
      'Accessibility tree parallel to DOM. ARIA attributes annotate nodes: role=tablist, aria-selected, aria-expanded. Changes announced via live regions. First rule: no ARIA is better than bad ARIA.',
    howItWorks: [
      { type: 'list', items: ['Roles: landmark (navigation), widget (button), relationship (aria-labelledby)', 'States: aria-expanded, aria-checked, aria-disabled', 'Properties: aria-label, aria-describedby', 'Live regions: aria-live polite/assertive for toasts', 'Hide decorative: aria-hidden=true on icons'] },
    ],
    example: [{ type: 'code', language: 'html', code: `<div role="tablist">\n  <button role="tab" aria-selected="true" aria-controls="panel1">One</button>\n</div>\n<div role="tabpanel" id="panel1">...</div>` }],
    keyTakeaways: ['Prefer native button/input over role=button', 'aria-label when visible text absent', 'aria-live for dynamic updates', 'Do not override native semantics incorrectly', 'Test with NVDA/VoiceOver'],
    interviewQuestions: [
      { level: 'basic', question: 'aria-label vs aria-labelledby?', answerHint: 'label provides string; labelledby references element id(s) for name.' },
      { level: 'intermediate', question: 'aria-hidden on modal backdrop?', answerHint: 'Hide inert background from AT; focus trap in modal; restore focus on close.' },
      { level: 'advanced', question: 'Build accessible combobox?', answerHint: 'Follow WAI-ARIA APG: input + listbox, aria-activedescendant, keyboard arrows.' },
    ],
    flashcards: [
      { front: 'First ARIA rule', back: 'Do not use ARIA if native HTML works' },
      { front: 'aria-live assertive', back: 'Interrupts screen reader — urgent alerts only' },
      { front: 'aria-expanded', back: 'State for disclosure widgets (menus, accordions)' },
    ],
    quickRevision: ['Native first', 'role/state/property', 'aria-live updates', 'APG patterns', 'Focus management', 'Test real AT'],
    tradeoffs: { advantages: ['Enables custom widgets for AT'], disadvantages: ['Easy to get wrong vs native'], alternatives: ['Use native input type=date, details/summary'], whenToUse: ['Custom tabs, trees, comboboxes'], whenNotToUse: ['When button/link/input suffices'] },
    failureModes: ['role=button without keyboard handlers', 'aria-live spam', 'Conflicting label and aria-label', 'aria-hidden on focused element'],
    production: { maintainability: ['Use headless a11y libs (React Aria, Radix)'] },
    interview: { expectations: ['When ARIA needed', 'Common attributes'], commonQuestions: ['Accessible modal?'], followUps: ['APG combobox?'], misconceptions: ['More ARIA = more accessible'], traps: ['aria-label on everything'], strongSignals: ['APG patterns, focus restore, live regions sparingly'] },
  }),

  'b5-box-model': feTopic({
    whatIsIt:
      'The CSS box model describes every element as a rectangular box: content → padding → border → margin. box-sizing controls whether width includes padding/border.',
    whyExists:
      'Layout math needs predictable dimensions. Default content-box makes width=300 plus padding explode layout; border-box makes width include padding and border.',
    mentalModel:
      'Four nested rectangles. width/height apply to content box by default. margin collapses vertically between siblings. outline does not affect layout flow.',
    howItWorks: [
      { type: 'list', items: ['content-box: width = content only', 'border-box: width = content + padding + border', 'margin separates boxes; auto horizontal margin centers block', 'padding affects clickable hit area inside border', 'overflow hidden clips content not margin'] },
    ],
    example: [{ type: 'code', language: 'css', code: `*, *::before, *::after { box-sizing: border-box; }\n.card {\n  width: 200px;\n  padding: 16px;\n  border: 1px solid #ccc;\n}` }],
    keyTakeaways: ['Global border-box is industry default', 'Margin collapse between adjacent vertical margins', 'Padding increases inner space; margin separates elements', 'width 100% + padding overflows without border-box', 'Inline elements ignore width/height (mostly)'],
    interviewQuestions: [
      { level: 'basic', question: 'content-box vs border-box?', answerHint: 'border-box width includes padding and border; easier layout.' },
      { level: 'intermediate', question: 'What is margin collapse?', answerHint: 'Adjacent vertical margins combine to larger of two, not sum.' },
      { level: 'advanced', question: 'Why 100vw causes horizontal scroll?', answerHint: 'vw includes scrollbar width; use 100% or overflow-x hidden carefully.' },
    ],
    flashcards: [
      { front: 'box-sizing border-box', back: 'width includes padding + border' },
      { front: 'Margin collapse', back: 'Vertical adjacent margins merge' },
      { front: 'Outline vs border', back: 'Outline does not affect layout box size' },
    ],
    quickRevision: ['content padding border margin', 'border-box reset', 'margin collapse vertical', 'padding inside border', 'outline no layout', 'inline ignores w/h'],
    tradeoffs: { advantages: ['border-box predictable sizing'], disadvantages: ['Legacy content-box confusion in old CSS'], alternatives: ['calc() for explicit sizes'], whenToUse: ['All component sizing'], whenNotToUse: ['Rare when matching third-party content-box widgets'] },
    failureModes: ['100% width + horizontal padding overflow', 'Margin collapse surprises in layouts', 'Assuming height includes margin'],
    production: { maintainability: ['border-box on *, document in reset'] },
    interview: { expectations: ['Draw four boxes', 'border-box default'], commonQuestions: ['Explain box model'], followUps: ['Margin collapse example?'], misconceptions: ['Padding collapses'], traps: ['box-sizing only on one element inconsistently'], strongSignals: ['border-box reset, collapse, outline vs border'] },
  }),

  'b5-flexbox': feTopic({
    whatIsIt: 'Flexbox is a one-dimensional CSS layout: distribute space along main axis (row/column) and align on cross axis — ideal for nav bars, centering, and flexible rows.',
    whyExists: 'Float/table hacks were fragile. Flexbox solves equal-height columns, vertical centering, and responsive toolbars with minimal code.',
    mentalModel: 'Flex container + flex items. Main axis from flex-direction. justify-content spaces along main; align-items on cross. flex-grow/shrink/basis control item sizing.',
    howItWorks: [{ type: 'list', items: ['display:flex on parent', 'flex-direction row|column sets main axis', 'justify-content: flex-start|center|space-between', 'align-items: stretch|center|flex-start', 'flex: 1 1 auto shorthand for grow shrink basis', 'gap for spacing without margin hacks'] }],
    example: [{ type: 'code', language: 'css', code: `.toolbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 8px;\n}\n.main { flex: 1; }` }],
    keyTakeaways: ['Flex is 1D — use Grid for 2D', 'align-items stretch default makes equal height', 'flex:1 means grow to fill', 'min-width:0 fixes flex overflow ellipsis', 'order changes visual not tab order — avoid for a11y'],
    interviewQuestions: [
      { level: 'basic', question: 'justify-content vs align-items?', answerHint: 'justify on main axis; align on cross axis.' },
      { level: 'intermediate', question: 'Center div horizontally and vertically?', answerHint: 'flex + justify-center + align-center on parent.' },
      { level: 'advanced', question: 'Flex item text overflow ellipsis?', answerHint: 'min-width:0 on flex child; overflow hidden; text-overflow ellipsis.' },
    ],
    flashcards: [
      { front: 'Main axis', back: 'Set by flex-direction (row default)' },
      { front: 'flex: 1', back: 'flex-grow 1 — take remaining space' },
      { front: 'min-width 0', back: 'Allows flex child to shrink below content size' },
    ],
    quickRevision: ['display flex parent', 'justify main align cross', 'flex 1 grow', 'gap not margin', '1D not 2D', 'min-width 0 overflow'],
    tradeoffs: { advantages: ['Easy centering and equal heights'], disadvantages: ['1D only; complex grids awkward'], alternatives: ['CSS Grid for 2D', 'gap in grid also'], whenToUse: ['Nav, rows, centering'], whenNotToUse: ['Full page 2D layout — prefer grid'] },
    failureModes: ['Flex child overflow without min-width:0', 'Using order hurting keyboard order', 'Nested flex without flex-shrink causing overflow'],
    production: { maintainability: ['Consistent flex utilities in design system'] },
    interview: { expectations: ['Main/cross axis', 'Centering pattern'], commonQuestions: ['Flex vs Grid?'], followUps: ['flex-shrink 0 when?'], misconceptions: ['Flex replaces all layout'], traps: ['Forgetting min-width 0'], strongSignals: ['Axis terminology, gap, min-width 0 trick'] },
  }),

  'b5-grid': feTopic({
    whatIsIt: 'CSS Grid is two-dimensional layout: define rows and columns with tracks, gaps, and named areas — page-level and component grids.',
    whyExists: 'Flexbox alone struggles with simultaneous row+column control. Grid enables holy grail layouts, dashboards, and responsive area templates.',
    mentalModel: 'Grid container defines template. Items placed by line numbers, span, or grid-area names. fr unit distributes free space. auto-fill/minmax for responsive columns without media queries.',
    howItWorks: [{ type: 'list', items: ['display:grid; grid-template-columns: repeat(3, 1fr)', 'grid-template-areas for semantic layout', 'gap replaces gutter margins', 'minmax(200px, 1fr) responsive auto-fit columns', 'subgrid (modern) aligns nested grids'] }],
    example: [{ type: 'code', language: 'css', code: `.layout {\n  display: grid;\n  grid-template-columns: 240px 1fr;\n  grid-template-areas: "sidebar main";\n  min-height: 100vh;\n}` }],
    keyTakeaways: ['Grid for 2D; flex for 1D rows', 'fr splits leftover space', 'grid-area readable layouts', 'auto-fit/minmax responsive without breakpoints', 'Implicit vs explicit grid tracks'],
    interviewQuestions: [
      { level: 'basic', question: 'Flex vs Grid?', answerHint: 'Flex 1D distribute; Grid 2D tracks and areas.' },
      { level: 'intermediate', question: 'Responsive columns without media queries?', answerHint: 'repeat(auto-fit, minmax(250px, 1fr)).' },
      { level: 'advanced', question: 'fr vs % in grid?', answerHint: 'fr shares remaining space after fixed tracks; % relative to container can overflow with gap.' },
    ],
    flashcards: [
      { front: 'fr unit', back: 'Fraction of free space in grid' },
      { front: 'auto-fit vs auto-fill', back: 'fit collapses empty tracks; fill keeps them' },
      { front: 'grid-area', back: 'Named placement in template-areas' },
    ],
    quickRevision: ['2D tracks', 'fr and minmax', 'template-areas', 'gap gutters', 'auto-fit responsive', 'subgrid alignment'],
    tradeoffs: { advantages: ['Powerful page layouts', 'Readable area names'], disadvantages: ['Older browser gaps mostly solved', 'Overkill for simple row'], alternatives: ['Flex for toolbars only'], whenToUse: ['Dashboards, page shells'], whenNotToUse: ['Single row of buttons'] },
    failureModes: ['Fixed px columns overflow mobile', 'Implicit tracks unexpected sizing', 'Grid without fallback for very old browsers'],
    production: { maintainability: ['Document grid templates in design tokens'] },
    interview: { expectations: ['2D vs flex', 'minmax pattern'], commonQuestions: ['Build holy grail with grid?'], followUps: ['subgrid?'], misconceptions: ['Grid replaces flex entirely'], traps: ['% width with gap overflow'], strongSignals: ['auto-fit minmax, areas, fr explanation'] },
  }),

  'b5-positioning': feTopic({
    whatIsIt: 'CSS positioning (static, relative, absolute, fixed, sticky) controls how elements are placed and what they are offset against — containing blocks and stacking contexts.',
    whyExists: 'Normal flow cannot overlay modals, sticky headers, or badges. Positioning plus z-index enables layered UI while document flow rules define reference frames.',
    mentalModel: 'static: in flow. relative: offset from self; still occupies space. absolute: out of flow; positioned vs nearest positioned ancestor. fixed: viewport. sticky: hybrid until scroll threshold.',
    howItWorks: [{ type: 'list', items: ['position:relative on parent for absolute children', 'top/right/bottom/left offsets', 'z-index only on positioned elements', 'sticky needs overflow visible ancestor', 'fixed modals + backdrop; watch mobile viewport'] }],
    example: [{ type: 'code', language: 'css', code: `.card { position: relative; }\n.badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n}` }],
    keyTakeaways: ['Absolute needs positioned ancestor', 'Sticky fails if parent overflow:hidden', 'Fixed relative to viewport — mobile URL bar quirks', 'z-index wars — isolate stacking contexts', 'Removed from flow: absolute/fixed'],
    interviewQuestions: [
      { level: 'basic', question: 'absolute positioned relative to what?', answerHint: 'Nearest ancestor with position not static; else viewport.' },
      { level: 'intermediate', question: 'Why sticky not working?', answerHint: 'Ancestor overflow hidden/auto; no room to stick; missing top value.' },
      { level: 'advanced', question: 'Stacking context creation?', answerHint: 'positioned + z-index, opacity <1, transform, filter create new contexts.' },
    ],
    flashcards: [
      { front: 'sticky requirement', back: 'top/bottom set; no overflow:hidden on ancestor' },
      { front: 'absolute containing block', back: 'Nearest positioned ancestor padding edge' },
      { front: 'fixed', back: 'Viewport — modals, FABs' },
    ],
    quickRevision: ['relative anchor', 'absolute out of flow', 'fixed viewport', 'sticky scroll', 'z-index contexts', 'overflow breaks sticky'],
    tradeoffs: { advantages: ['Overlays and sticky nav'], disadvantages: ['Stacking bugs', 'a11y focus with portaled modals'], alternatives: ['Popover API', 'CSS anchor positioning emerging'], whenToUse: ['Badges, modals, sticky headers'], whenNotToUse: ['Whole page layout — grid/flex'] },
    failureModes: ['Sticky inside overflow hidden', 'Modal under header wrong z-index', 'Fixed element clipped on iOS'],
    production: { maintainability: ['Portal modals to body; central z-index scale'] },
    interview: { expectations: ['Containing block', 'sticky pitfalls'], commonQuestions: ['Center absolute element?'], followUps: ['Stacking context?'], misconceptions: ['z-index global ordering'], traps: ['absolute without relative parent'], strongSignals: ['Ancestor chain, portal, sticky overflow'] },
  }),

  'b5-responsive': feTopic({
    whatIsIt: 'Responsive design adapts layout and typography across viewport sizes — fluid grids, flexible images, breakpoints, and mobile-first CSS.',
    whyExists: 'Devices range from 320px phones to ultrawide monitors. Separate m.sites duplicated work; responsive single codebase scales with media queries and fluid units.',
    mentalModel: 'Mobile-first: base styles for small; min-width media queries add complexity. Use relative units (rem, %, fr), max-width on images, container queries for component-level adaptation.',
    howItWorks: [{ type: 'list', items: ['viewport meta tag for mobile scaling', '@media (min-width: 768px) additive rules', 'clamp() for fluid typography', 'container-type inline-size for @container', 'Touch targets min 44px; avoid hover-only UX'] }],
    example: [{ type: 'code', language: 'css', code: `@media (min-width: 768px) {\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\nh1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }` }],
    keyTakeaways: ['Mobile-first min-width queries', 'Fluid type with clamp', 'Images max-width 100%', 'Container queries decouple from viewport', 'Test real devices not only Chrome resize'],
    interviewQuestions: [
      { level: 'basic', question: 'Mobile-first vs desktop-first?', answerHint: 'Mobile-first uses min-width; desktop-first max-width — former preferred.' },
      { level: 'intermediate', question: 'rem vs em?', answerHint: 'rem root-relative consistent; em compounds from parent.' },
      { level: 'advanced', question: 'Container vs media queries?', answerHint: 'Container responds to parent width — reusable components in sidebar vs main.' },
    ],
    flashcards: [
      { front: 'viewport meta', back: 'width=device-width initial-scale=1' },
      { front: 'clamp()', back: 'min preferred max fluid value' },
      { front: 'mobile-first', back: 'Base mobile; min-width breakpoints up' },
    ],
    quickRevision: ['viewport meta', 'min-width breakpoints', 'clamp typography', 'max-width images', 'container queries', 'touch target size'],
    tradeoffs: { advantages: ['One codebase all devices'], disadvantages: ['CSS complexity', 'Performance if loading desktop assets on mobile'], alternatives: ['Adaptive server different HTML', 'Separate native apps'], whenToUse: ['Web apps and marketing sites'], whenNotToUse: ['When native-only product strategy'] },
    failureModes: ['Missing viewport meta tiny text', 'Horizontal scroll from fixed widths', 'Hover-only menus on touch'],
    production: { performance: ['Responsive images srcset', 'Lazy load below fold'] },
    interview: { expectations: ['Mobile-first', 'Relative units'], commonQuestions: ['Three column to one?'], followUps: ['container queries?'], misconceptions: ['More breakpoints = better'], traps: ['px-only layouts'], strongSignals: ['clamp, container queries, srcset'] },
  }),

  'b5-semantic-html': feTopic({
    whatIsIt: 'Semantic HTML uses meaningful tags (header, nav, main, article, button) so document structure is machine-readable — SEO, a11y, and maintainability.',
    whyExists: 'Div soup has no structure for screen readers or search engines. Semantic elements communicate landmarks, headings hierarchy, and control types natively.',
    mentalModel: 'One main per page. Headings h1–h6 sequential. Interactive controls use button/a/input. Landmarks map to screen reader navigation.',
    howItWorks: [{ type: 'list', items: ['header/footer/nav/main/article/section/aside', 'button for actions; a href for navigation', 'label for= id pairs inputs', 'table for tabular data only', 'ul/ol for lists not div stacks'] }],
    example: [{ type: 'code', language: 'html', code: `<main>\n  <article>\n    <h1>Post title</h1>\n    <p>Content...</p>\n  </article>\n</main>` }],
    keyTakeaways: ['One h1 per page typically', 'button vs a by behavior not styling', 'Landmarks reduce aria redundancy', 'Semantic default styles differ — reset intentionally', 'Forms need label association'],
    interviewQuestions: [
      { level: 'basic', question: 'button vs anchor?', answerHint: 'button activates in-page action; a navigates to URL.' },
      { level: 'intermediate', question: 'section vs div?', answerHint: 'section needs thematic heading; div no semantic meaning.' },
      { level: 'advanced', question: 'Multiple nav elements?', answerHint: 'OK with aria-label distinguishing primary vs footer nav.' },
    ],
    flashcards: [
      { front: 'main landmark', back: 'Primary content — one per page ideally' },
      { front: 'button vs a', back: 'Action vs navigation' },
      { front: 'heading order', back: 'Do not skip levels h2 to h4' },
    ],
    quickRevision: ['Landmarks main nav', 'button vs link', 'label for inputs', 'heading hierarchy', 'table for data', 'lists ul ol'],
    tradeoffs: { advantages: ['Free a11y and SEO'], disadvantages: ['Legacy designs may fight defaults'], alternatives: ['None for public web'], whenToUse: ['Always in HTML'], whenNotToUse: ['Never substitute div for button'] },
    failureModes: ['Clickable div without role/key handlers', 'Missing main landmark', 'Placeholder-only inputs no label'],
    production: { maintainability: ['HTML lint rules in CI'] },
    interview: { expectations: ['Landmarks', 'button vs a'], commonQuestions: ['Improve this div soup?'], followUps: ['article vs section?'], misconceptions: ['Semantics irrelevant for SPAs'], traps: ['h1 for logo only sitewide misuse'], strongSignals: ['Landmark map, label/for, heading order'] },
  }),

  'b5-specificity': feTopic({
    whatIsIt: 'CSS specificity determines which rule wins when conflicts occur — calculated from inline styles, IDs, classes/attributes, and elements, plus source order and !important.',
    whyExists: 'Cascade needs deterministic conflict resolution. Without specificity, stylesheets would be unpredictable. Understanding it prevents !important wars and debugging nightmares.',
    mentalModel: 'Score (inline, IDs, classes, elements). Higher wins; tie broken by order. !important beats non-important. Inherited properties separate from cascade winner on element.',
    howItWorks: [{ type: 'list', items: ['Inline style beats stylesheet', '#id beats .class beats element', ':not() does not add; inner selector does', '!important inversions within layer', 'Cascade layers @layer manage ordering explicitly (modern)'] }],
    example: [{ type: 'code', language: 'css', code: `/* specificity: (0,1,0) */\n.btn { color: blue; }\n/* (0,2,0) wins */\n.nav .btn { color: white; }` }],
    keyTakeaways: ['Avoid ID selectors in components', '!important is escape hatch not default', 'Lower specificity easier to override', '@layer for design system ordering', 'Specificity not inheritance'],
    interviewQuestions: [
      { level: 'basic', question: 'Which wins .nav a or a.nav?', answerHint: 'Both (0,1,1) — tie, later rule in file wins.' },
      { level: 'intermediate', question: 'inline vs !important in stylesheet?', answerHint: '!important in author sheet beats normal inline; inline !important beats all.' },
      { level: 'advanced', question: 'Fix specificity wars in large app?', answerHint: 'BEM low specificity, @layer tokens, no IDs, lint max specificity.' },
    ],
    flashcards: [
      { front: 'Specificity order', back: 'inline > id > class > element' },
      { front: '!important', back: 'Beats normal rules; avoid chains' },
      { front: '@layer', back: 'Explicit cascade ordering beyond specificity' },
    ],
    quickRevision: ['inline id class element', 'order ties', 'important last resort', '@layer system', 'inherit != cascade', 'BEM low specificity'],
    tradeoffs: { advantages: ['Predictable conflicts'], disadvantages: ['High specificity hard to override'], alternatives: ['CSS modules scoping', 'Utility-first Tailwind'], whenToUse: ['Understanding debug'], whenNotToUse: ['!important as first fix'] },
    failureModes: ['ID selectors block overrides', '!important everywhere', 'Confusing inheritance with cascade'],
    production: { maintainability: ['Stylelint max specificity; design tokens @layer'] },
    interview: { expectations: ['Calculate specificity', 'Avoid !important'], commonQuestions: ['Why rule not applying?'], followUps: ['@layer?'], misconceptions: ['Later file always wins regardless'], traps: [':hover adds specificity incorrectly thought'], strongSignals: ['BEM, layers, calculate (0,2,1)'] },
  }),
})

// b6 topics - frontend architecture
const b6 = [
  ['b6-a11y-sd', 'Accessibility in Large Apps', 'Embed a11y in design systems, CI axe checks, focus management in SPAs, and organizational practices at scale.'],
  ['b6-api-layer', 'API-Layer Design', 'Typed client wrappers, React Query/SWR caching, error normalization, and versioning boundaries between UI and backend.'],
  ['b6-authentication', 'Frontend Authentication', 'OAuth PKCE, token storage (httpOnly cookies vs memory), refresh rotation, and route guards without exposing secrets.'],
  ['b6-caching', 'Frontend Caching', 'HTTP cache headers, service worker strategies, SWR stale-while-revalidate, and cache invalidation on mutations.'],
  ['b6-component-architecture', 'Component Architecture', 'Smart vs presentational, compound components, colocation, and folder boundaries by feature not type.'],
  ['b6-design-systems-sd', 'Design Systems (System Design)', 'Token pipeline, component library versioning, documentation site, and adoption metrics across squads.'],
  ['b6-error-handling', 'Frontend Error Handling', 'Error boundaries, toast vs inline errors, retry UX, and mapping API errors to user-safe messages.'],
  ['b6-i18n', 'Internationalization', 'Message catalogs, ICU plurals, RTL layout, locale-aware dates/numbers, and lazy-loaded translations.'],
  ['b6-infinite-scrolling', 'Infinite Scrolling', 'Virtualized lists, cursor pagination, sentinel IntersectionObserver, and scroll restoration pitfalls.'],
  ['b6-large-app-architecture', 'Large-Application Architecture', 'Feature folders, route-based code splitting, shared kernel, and dependency rules between modules.'],
  ['b6-micro-frontends', 'Micro-frontends Concepts', 'Module federation, single-spa shell, independent deploys, and shared design token contracts.'],
  ['b6-observability', 'Frontend Observability', 'RUM (Core Web Vitals), error tracking (Sentry), session replay sampling, and client-side tracing correlation.'],
  ['b6-pagination', 'Pagination', 'Offset vs cursor UX, page size tradeoffs, URL-synced page state, and prefetch next page.'],
  ['b6-performance', 'Frontend Performance', 'LCP/INP/CLS budgets, bundle analysis, image optimization, and main-thread long task reduction.'],
  ['b6-realtime-ui', 'Real-time UI', 'WebSocket reconnect backoff, optimistic UI, presence indicators, and ordering events with sequence numbers.'],
  ['b6-state-architecture', 'State Architecture', 'Local vs server vs URL state, when to use Redux/Zustand/React Query, and colocated state minimization.'],
]

for (const [id, title, summary] of b6) {
  topics[id] = feTopic({
    whatIsIt: `${title} in production frontends: ${summary}`,
    whyExists: `Large SPAs outgrow ad-hoc patterns. ${title} provides repeatable structure for teams shipping fast without breaking UX, security, or performance.`,
    mentalModel: `Separate concerns: UI components stay dumb where possible; ${id.includes('state') ? 'state lives at lowest sufficient owner' : 'cross-cutting policies live in dedicated layer'}. Measure with real user metrics not assumptions.`,
    keyTakeaways: [
      `Define clear boundaries for ${title.toLowerCase()}`,
      'Document decisions in ADRs for team alignment',
      'Prefer boring proven patterns over novelty',
      'Instrument and iterate from production signals',
      'Align with design system and API contracts',
    ],
    interviewQuestions: [
      { level: 'basic', question: `What problems does ${title} solve?`, answerHint: summary },
      { level: 'intermediate', question: `Tradeoffs implementing ${title} in React app?`, answerHint: 'Complexity vs consistency; bundle size; team autonomy.' },
      { level: 'advanced', question: `How evolve ${title} as org scales to 50 engineers?`, answerHint: 'Governance, lint rules, platform team, migration guides.' },
    ],
    flashcards: [
      { front: title, back: summary.slice(0, 80) },
      { front: 'First step', back: 'Clarify requirements and non-functional goals' },
      { front: 'Anti-pattern', back: 'One-off hacks without shared pattern' },
    ],
    quickRevision: ['Boundaries', 'Document ADR', 'Measure RUM', 'Align API/DS', 'Incremental rollout', 'Review in PR checklist'],
    tradeoffs: { advantages: ['Consistency at scale', 'Faster onboarding'], disadvantages: ['Upfront architecture cost'], alternatives: ['Monolith SPA until pain justifies split'], whenToUse: ['Multi-team product'], whenNotToUse: ['Tiny marketing site'] },
    failureModes: [`Inconsistent ${title} across squads`, 'No migration path from legacy', 'Over-engineering before product-market fit'],
    production: { performance: ['Budget Core Web Vitals per route'], observability: ['RUM + error tracking'], maintainability: ['Lint/enforce architectural rules'] },
    interview: { expectations: [`Explain ${title} tradeoffs`], commonQuestions: [`Design ${title} for enterprise app?`], followUps: ['How test migration?'], misconceptions: ['One size fits all frameworks'], traps: ['Premature micro-frontends'], strongSignals: ['Concrete patterns, metrics, phased rollout'] },
  })
}

// b6 practice topics - richer content
const practice = {
  'b6-practice-gmail': 'Gmail-like mail client: thread list virtualization, label filters, compose modal, offline draft sync, search with debounce.',
  'b6-practice-google-docs': 'Collaborative editor frontend: OT/CRDT awareness, presence cursors, chunked doc model, conflict-free typing UX.',
  'b6-practice-slack': 'Slack-like chat: channel list, message virtual scroll, websocket reconnect, unread badges, emoji picker lazy load.',
  'b6-practice-social-feed': 'Infinite social feed: cursor pagination, optimistic like, image lazy load, skeleton states, pull-to-refresh mobile.',
  'b6-practice-trading': 'Trading dashboard: low-latency tick updates, WebSocket order book, throttled render batching, error states on stale data.',
  'b6-practice-uber': 'Uber web map UI: driver markers on map tile layer, ride status stepper, geolocation permission UX, surge banner.',
  'b6-practice-youtube': 'YouTube-like video UI: watch page layout, related sidebar, adaptive player shell, comment thread pagination.',
}

for (const [id, desc] of Object.entries(practice)) {
  const name = id.replace('b6-practice-', '').replace(/-/g, ' ')
  topics[id] = feTopic({
    whatIsIt: `Frontend system design practice: ${desc}`,
    whyExists: 'Interviewers ask product-shaped frontend design — not just components but data flow, performance, realtime, and state for recognizable apps.',
    mentalModel: 'Clarify users and flows → component tree → data sources → caching/realtime → performance hotspots → a11y and error states.',
    howItWorks: [{ type: 'list', ordered: true, items: ['Clarify functional scope (MVP vs full)', 'Sketch component hierarchy and routes', 'Define API/events and client cache strategy', 'Identify virtualization and code-split points', 'Plan loading/error/empty states', 'Discuss metrics and rollout'] }],
    example: [{ type: 'code', language: 'text', caption: 'Interview outline', code: `Requirements → UI architecture → State/API → Performance → Edge cases` }],
    keyTakeaways: ['Start requirements not pixels', 'Call out virtualization early for lists', 'Separate server cache from UI state', 'Realtime needs reconnect strategy', 'Name Core Web Vitals risks'],
    interviewQuestions: [
      { level: 'basic', question: `MVP features for ${name}?`, answerHint: 'Pick 3 core flows; defer settings/admin.' },
      { level: 'intermediate', question: 'How handle offline or stale data?', answerHint: 'Optimistic UI + queue; stale indicators; SWR.' },
      { level: 'advanced', question: 'Performance plan for large lists?', answerHint: 'Windowing, memoization, stable keys, prefetch.' },
    ],
    flashcards: [
      { front: id, back: desc.split(',')[0] },
      { front: 'Interview order', back: 'Reqs → arch → data → perf → a11y' },
      { front: 'List perf', back: 'Virtualize + cursor pagination' },
    ],
    quickRevision: ['Scope MVP', 'Component tree', 'API/cache layer', 'Virtualize lists', 'Realtime reconnect', 'Loading/error UX'],
    tradeoffs: { advantages: ['Demonstrates holistic FE SD'], disadvantages: ['Easy to over-scope timebox'], alternatives: ['Whiteboard only no code'], whenToUse: ['Frontend senior interviews'], whenNotToUse: ['Pure algorithm rounds'] },
    failureModes: ['Jump to CSS before data model', 'Ignore mobile', 'No error/loading states'],
    production: { performance: ['Profile list scroll INP'], observability: ['Track client errors by route'] },
    interview: { expectations: ['Structured answer', 'Perf for lists/maps'], commonQuestions: [`Design ${name} frontend`], followUps: ['Scale 10× traffic?'], misconceptions: ['Only visual design'], traps: ['Fetch entire feed at once'], strongSignals: ['Virtualization, cache policy, structured sections'] },
  })
}

// e1 Python topics
const pyTopics = {
  'e1-syntax': {
    whatIsIt: 'Python syntax: indentation blocks, dynamic typing, statements vs expressions, and readable minimal punctuation structure.',
    mentalModel: 'Whitespace defines scope. Everything is object. import binds names. falsy values: None, False, 0, "", [], {}.',
    example: { type: 'code', language: 'python', code: `if score >= 60:\n    print("pass")\nelse:\n    print("fail")` },
  },
  'e1-collections': {
    whatIsIt: 'Python collections: list, tuple, dict, set — mutability, hashing, comprehensions, and Big-O for common operations.',
    mentalModel: 'list ordered mutable; tuple immutable hashable if elements hashable; dict key→value O(1) avg; set unique unordered.',
    example: { type: 'code', language: 'python', code: `counts = {}\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1` },
  },
  'e1-functions': {
    whatIsIt: 'Python functions: def, *args/**kwargs, default mutable trap, first-class functions, lambdas, decorators basics.',
    mentalModel: 'Defaults evaluated once at def time — never mutable default list. LEGB scope. Functions are objects passed as values.',
    example: { type: 'code', language: 'python', code: `def greet(name, prefix="Hello"):\n    return f"{prefix}, {name}"` },
  },
  'e1-classes': {
    whatIsIt: 'Python classes: __init__, self, inheritance, @classmethod/@staticmethod, dataclasses, and dunder methods.',
    mentalModel: 'self explicit instance reference. MRO for inheritance. dataclass reduces boilerplate for data holders.',
    example: { type: 'code', language: 'python', code: `from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float` },
  },
  'e1-packages': {
    whatIsIt: 'Python packaging: venv, pip, pyproject.toml, requirements.txt, and publishing/installing distributable packages.',
    mentalModel: 'venv isolates dependencies. pip install from PyPI. pyproject.toml modern standard (PEP 621). Lock versions for reproducible builds.',
    example: { type: 'code', language: 'bash', code: `python -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt` },
  },
  'e1-async': {
    whatIsIt: 'Python async: async/await, asyncio event loop, coroutines vs threads, aiohttp, and when async helps I/O-bound work.',
    mentalModel: 'Single-thread cooperative multitasking. await yields control at I/O. CPU-bound work needs multiprocessing not async.',
    example: { type: 'code', language: 'python', code: `import asyncio\n\nasync def fetch():\n    await asyncio.sleep(1)\n    return "done"` },
  },
  'e1-type-hints': {
    whatIsIt: 'Python type hints: annotations for tooling (mypy/pyright), Optional, Union, generics, Protocol, and gradual typing.',
    mentalModel: 'Hints not enforced at runtime by default. mypy static check. Use Optional[T] for None. Generics like list[str] Python 3.9+.',
    example: { type: 'code', language: 'python', code: `def total(prices: list[float]) -> float:\n    return sum(prices)` },
  },
}

for (const [id, cfg] of Object.entries(pyTopics)) {
  topics[id] = feTopic({
    whatIsIt: cfg.whatIsIt,
    whyExists: `Python prioritizes readability and batteries-included stdlib. ${id.split('-')[1]} fundamentals prevent bugs and enable tooling in backend/ML scripts.`,
    mentalModel: cfg.mentalModel,
    example: [cfg.example],
    keyTakeaways: [
      'Readability counts — PEP 8 style',
      'Know mutability of collection used',
      'Use venv per project',
      'Type hints for larger codebases',
      'async for I/O concurrency not CPU parallelism',
    ].slice(0, 5),
    interviewQuestions: [
      { level: 'basic', question: `Core idea of ${id.replace('e1-', '')}?`, answerHint: cfg.whatIsIt.slice(0, 100) },
      { level: 'intermediate', question: 'Python gotcha related to this topic?', answerHint: id === 'e1-functions' ? 'Mutable default arguments' : 'See mental model edge cases' },
      { level: 'advanced', question: 'Production practice?', answerHint: 'Lint, type check, lock deps, test in CI' },
    ],
    flashcards: [
      { front: id.replace('e1-', ''), back: cfg.whatIsIt.slice(0, 60) },
      { front: 'PEP 8', back: 'Style guide — indentation 4 spaces' },
      { front: 'venv', back: 'Isolated Python environment per project' },
    ],
    quickRevision: ['Indent blocks', 'Objects everywhere', 'venv + pip', 'mypy optional', 'async I/O bound', 'dataclass for data'],
    tradeoffs: { advantages: ['Readable rapid development'], disadvantages: ['GIL limits CPU threads', 'Dynamic typing runtime errors'], alternatives: ['Go/Rust for CPU hot paths'], whenToUse: ['Backend, scripts, ML glue'], whenNotToUse: ['Hard real-time embedded'] },
    failureModes: ['Mutable default arg bug', 'Blocking call inside async', 'Unpinned pip dependencies'],
    production: { maintainability: ['ruff/black/mypy in CI'], reliability: ['Pin dependencies in lock file'] },
    interview: { expectations: ['Syntax clarity', 'Common gotchas'], commonQuestions: ['list vs tuple?', 'GIL?'], followUps: ['async vs threading?'], misconceptions: ['Type hints slow runtime'], traps: ['def append(item, lst=[])'], strongSignals: ['Explicit gotchas, venv, typing story'] },
  })
}

const ids = Object.keys(topics)
if (ids.length !== 42) {
  console.error(`Expected 42 topics, got ${ids.length}`)
  process.exit(1)
}

for (const id of ids) {
  const file = path.join(OUT, `${id}.ts`)
  fs.writeFileSync(file, render(id, topics[id]), 'utf8')
  console.log('wrote', id)
}

console.log('count:', ids.length)
console.log('ids:', ids.join(', '))
