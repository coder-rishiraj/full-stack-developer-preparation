import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A Content Delivery Network (CDN) caches static and cacheable dynamic content at edge PoPs close to users — reducing latency, origin load, and bandwidth cost. Examples: CloudFront, Cloudflare, Akamai, Fastly. Uses DNS anycast and HTTP cache headers.',
  whyExists:
    'Users are global; origin in us-east-1 is slow from Mumbai. Repeated assets (JS, images, video segments) should not cross oceans every request. CDN terminates TLS at edge and serves from local cache on hit.',
  mentalModel:
    'Reverse proxy cache farm worldwide. First user in region fetches from origin (MISS), CDN stores copy. Subsequent users get HIT from edge. Cache-Control, TTL, and purge API control freshness.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Mechanism', 'Behavior', 'Knob'],
      rows: [
        ['Cache HIT', 'Edge serves without origin', 'High TTL immutable assets'],
        ['Cache MISS', 'Origin fetch + store', 'First request slower'],
        ['Purge/invalidate', 'Remove stale edge copies', 'On deploy or price change'],
        ['Signed URLs', 'Time-limited access to private content', 'Video, downloads'],
        ['Stale-while-revalidate', 'Serve stale while refreshing', 'Smoother latency'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'CDN cache hit path',
      diagram: `sequenceDiagram
  participant U as User Mumbai
  participant E as Edge PoP
  participant O as Origin US
  U->>E: GET /static/app.js
  alt cache HIT
    E-->>U: 200 from edge
  else MISS
    E->>O: GET /static/app.js
    O-->>E: 200 Cache-Control max-age=31536000
    E-->>U: 200
  end`,
    },
    {
      type: 'list',
      items: [
        'Do not cache personalized HTML without Vary careful design',
        'Versioned filenames (app.v2.js) enable long immutable TTL',
        'Dynamic API rarely CDN-cached unless edge compute or short TTL public data',
        'Origin shield reduces origin load from many edges',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Caching headers for static assets',
      code: `# Immutable hashed asset
Cache-Control: public, max-age=31536000, immutable

# HTML shell — short TTL or no-cache
Cache-Control: public, max-age=60, stale-while-revalidate=300

# Private user dashboard
Cache-Control: private, no-store`,
    },
  ],
  tradeoffs: {
    advantages: ['Low global latency', 'DDoS absorption', 'Origin offload', 'TLS at edge'],
    disadvantages: ['Cache invalidation complexity', 'Stale content risk', 'Cost at high egress'],
    alternatives: ['Self-host geo replicas', 'Service worker cache only'],
    whenToUse: ['Static assets, media, public API responses', 'Global user base'],
    whenNotToUse: ['Highly personalized uncacheable responses', 'Strong read consistency requirements without validation'],
  },
  failureModes: [
    'Cached wrong user data on shared URL without auth separation',
    'Forgot purge after critical content update',
    'Origin overload when CDN misconfigured bypass',
    'SSL cert expiry at edge',
    'Geo-blocking and compliance cache in wrong region',
  ],
  production: {
    performance: ['Long TTL + fingerprinted assets', 'HTTP/2/3 at edge', 'Compress brotli/gzip'],
    scalability: ['CDN scales automatically; watch origin on miss storms'],
    reliability: ['Multi-origin failover', 'Health checks'],
    security: ['WAF at CDN', 'Signed cookies for private video', 'Block origin direct access'],
    observability: ['Hit ratio, origin bandwidth, 5xx at edge', 'Cache status response header'],
    cost: ['Cache hit saves origin egress; optimize TTL vs freshness'],
  },
  interview: {
    expectations: ['Hit/miss', 'Cache-Control', 'Purge strategy'],
    commonQuestions: ['CDN vs Redis cache?', 'Cache API responses?'],
    followUps: ['Private content on CDN?', 'Cache bust on deploy?'],
    misconceptions: ['CDN caches everything by default', 'CDN replaces need for app cache'],
    traps: ['Caching authenticated API with same URL for all users'],
    strongSignals: ['Immutable hashed assets', 'Origin shield', 'Signed URL pattern'],
  },
  keyTakeaways: [
    'Edge caches close to users — HIT avoids origin round trip.',
    'Cache-Control + TTL + purge manage freshness.',
    'Static assets: long TTL with content hash in filename.',
    'Never cache private responses on shared cache keys.',
    'CDN complements origin Redis/app cache layers.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'CDN purpose?', answerHint: 'Reduce latency and origin load by caching at edge PoPs.' },
    { level: 'intermediate', question: 'Cache bust on deploy?', answerHint: 'Fingerprint filenames or query version; purge CDN paths.' },
    { level: 'advanced', question: 'Serve private video via CDN?', answerHint: 'Signed URLs/cookies, short TTL, origin auth, token at edge.' },
  ],
  flashcards: [
    { front: 'CDN HIT', back: 'Served from edge without contacting origin' },
    { front: 'immutable cache directive', back: 'Asset never changes for this URL — max TTL safe' },
    { front: 'CDN vs origin Redis', back: 'CDN edge geographic; Redis app data cache near origin' },
    { front: 'Vary header', back: 'Cache separate entries per header value e.g. Accept-Encoding' },
  ],
  quickRevision: [
    'Edge PoP cache',
    'HIT/MISS',
    'Cache-Control TTL',
    'Hash filenames',
    'Purge on change',
  ],
  systemDesign: {
    problem: 'Deliver global media-heavy news site (images, video, static JS) with fast TTFB and minimal origin load during viral article.',
    requirements: {
      functional: ['Serve pages/media', 'Update breaking news images', 'Video streaming'],
      nonFunctional: ['Global p95 TTFB < 200ms static', 'Survive 10× traffic spike', 'HTTPS everywhere'],
    },
    scaleAssumptions: ['100M MAU global', '1M RPS peak edge', 'Origin 5k RPS acceptable on miss'],
    capacityEstimates: ['95%+ CDN hit ratio target', 'Origin shield + S3 origin'],
    api: [{ type: 'paragraph', text: 'HTML from origin/API; assets on cdn.example.com' }],
    dataModel: [{ type: 'list', items: ['S3/object storage origin', 'CDN distribution with behaviors per path'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'CloudFront → S3 static; API HTML short TTL; WAF; signed URLs for premium video.' }],
    diagram: {
      mermaid: `flowchart TB
  Users --> CDN[CDN edge]
  CDN -->|MISS| Shield[Origin shield]
  Shield --> S3[(S3 origin)]
  CDN -->|HIT| Users`,
      caption: 'Multi-tier CDN with origin shield',
    },
    dataFlow: ['Asset upload S3 → CDN prefetch optional → users HIT edge', 'Breaking image → purge path /images/xyz.jpg'],
    storage: ['S3 + CDN cache'],
    caching: ['Primary design element — tiered TTLs'],
    asyncProcessing: ['Warm cache on publish via prefetch API'],
    scaling: ['CDN automatic; origin limited miss rate'],
    consistency: ['Eventual at edge — purge on critical updates'],
    reliability: ['Multi-origin S3 cross-region'],
    failureScenarios: ['Viral miss storm — origin shield + scale S3', 'Stale headline image — automated purge hook on CMS publish'],
    security: ['WAF', 'OAC restrict S3 to CDN only'],
    observability: ['Hit ratio, origin 5xx, bandwidth by PoP'],
    bottlenecks: ['HTML dynamic not cacheable — optimize separately'],
    alternatives: ['Multiple regional origins without CDN — worse latency'],
    tradeoffs: ['HTML edge cache vs freshness for personalized nav'],
    interviewFollowUps: ['Personalized header with CDN?', 'Live video latency?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single origin server.', bottleneck: 'Global latency + overload.' },
      { stage: '2. Improve', description: 'CDN static only.', bottleneck: 'HTML origin hot.' },
      { stage: '3. Improve', description: 'S3 origin + shield + WAF.', bottleneck: 'Breaking news purge lag.' },
      { stage: '4. Scale further', description: 'Edge SSR/islands; automated purge pipeline.', bottleneck: 'Cost at scale.' },
    ],
  },
}
