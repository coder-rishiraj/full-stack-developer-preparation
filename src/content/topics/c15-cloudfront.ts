import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Amazon CloudFront is global CDN caching HTTP responses at edge locations close to users — reducing latency and origin load. Distributes static assets and dynamic content via cache behaviors, TTLs, signed URLs/cookies, and Origin Access Control (OAC) securing S3 origins.',
  whyExists:
    'Users in Tokyo hitting US-East origin adds 200ms+ RTT. CloudFront caches at 400+ PoPs worldwide. Offloads S3/ALB bandwidth, absorbs traffic spikes, enables HTTP/2/3, WAF integration, and custom TLS at edge.',
  mentalModel:
    'Copy of popular content stored in regional mini-servers. First request fetches from origin (S3/ALB); subsequent edge hits serve cached copy until TTL expires. Cache miss or invalidation pulls fresh from origin.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Feature', 'Purpose'],
      rows: [
        ['Distribution', 'Domain + origins + cache behaviors'],
        ['Cache behavior', 'Path pattern → origin, TTL, methods allowed'],
        ['OAC/OAI', 'S3 bucket accessible only via CloudFront'],
        ['Invalidation', 'Purge paths before TTL — costs per path'],
        ['Signed URL/cookie', 'Private content time-limited access'],
        ['Lambda@Edge', 'Run code at edge on request/response'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'CloudFront cache hit path',
      diagram: `sequenceDiagram
  participant U as User Tokyo
  participant CF as CloudFront Edge
  participant O as S3 Origin
  U->>CF: GET /app.js
  alt cache hit
    CF-->>U: 200 cached
  else cache miss
    CF->>O: fetch origin
    O-->>CF: object
    CF-->>U: 200 + cache store
  end`,
    },
    {
      type: 'list',
      items: [
        'Cache-Control from origin respected unless behavior overrides min/default/max TTL.',
        'Dynamic content: short TTL or cache key includes query strings selectively.',
        'Alternate domain CNAME + ACM cert in us-east-1 for custom domain HTTPS.',
        'Origin shield optional central cache layer reducing origin fetches.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'React SPA on S3: CloudFront distribution default behavior → S3 OAC bucket private. index.html short TTL (60s) or invalidation on deploy; hashed assets /static/* long max-age=31536000 immutable. API calls /api/* behavior → ALB origin with caching disabled.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Edge location vs regional edge cache — tiered caching architecture.',
        'HTTP/2 and QUIC supported at edge automatically.',
        'Geo restriction block/allow countries on distribution.',
        'Real-time logs or standard logs to S3 for cache hit ratio analysis.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Low global latency', 'DDoS absorption', 'Reduce origin egress cost', 'HTTPS and HTTP/2 at edge'],
    disadvantages: ['Invalidation delay and cost', 'Stale content if TTL too long', 'Debug cache miss harder'],
    alternatives: ['Direct S3 public — no CDN', 'Cloudflare/Fastly third-party CDN', 'ALB only for dynamic'],
    whenToUse: ['Static assets', 'Global user base', 'S3 website hosting'],
    whenNotToUse: ['Highly personalized per-user HTML with no cache key strategy'],
  },
  failureModes: [
    'Long TTL on index.html — users see old SPA after deploy',
    'S3 public instead of OAC — bypass CDN direct access',
    'Cache API responses with Set-Cookie — leak user data to others',
    'Wrong cache key ignoring auth headers',
    'Invalidation storm on every deploy expensive',
  ],
  production: {
    performance: ['Immutable hashed static assets long TTL', 'Separate behaviors for HTML vs assets'],
    security: ['OAC on S3', 'Signed URLs for private downloads', 'AWS WAF on distribution'],
    cost: ['Optimize cache hit ratio metrics', 'PriceClass_100 if US/EU only sufficient'],
    observability: ['CloudWatch cache hit rate', 'Real-time logs sample 1%'],
  },
  interview: {
    expectations: ['CDN purpose', 'OAC', 'TTL strategy', 'Invalidation vs versioned filenames'],
    commonQuestions: ['Serve SPA from S3 globally?', 'Cache bust on deploy?'],
    followUps: ['Signed URL use case?', 'Dynamic API through CloudFront?'],
    misconceptions: ['CloudFront stores all content forever', 'Invalidation instant worldwide'],
    traps: ['Caching authenticated API responses'],
    strongSignals: ['OAC + private S3', 'Hash filenames not invalidation', 'Behavior per path pattern'],
  },
  keyTakeaways: [
    'CloudFront caches content at edge PoPs globally.',
    'Use OAC so S3 origin is not public.',
    'Long TTL for hashed static; short/none for index.html and APIs.',
    'Prefer filename hashing over invalidation for cache bust.',
    'Cache behaviors route paths to different origins.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What does CDN do?', answerHint: 'Caches content closer to users — lower latency and reduced origin load.' },
    { level: 'intermediate', question: 'Secure S3 static site with CloudFront?', answerHint: 'Private bucket + Origin Access Control; only CloudFront can GetObject.' },
    { level: 'advanced', question: 'Deploy new SPA without stale index.html?', answerHint: 'Short TTL on index.html, content-hash asset filenames, or invalidation on deploy.' },
  ],
  flashcards: [
    { front: 'OAC', back: 'Origin Access Control — CloudFront-only S3 access' },
    { front: 'Cache behavior', back: 'Path pattern rules mapping to origin and TTL' },
    { front: 'Invalidation', back: 'Explicit edge purge before TTL expiry — has cost' },
    { front: 'Signed URL', back: 'Time-limited authenticated access to private objects' },
  ],
  quickRevision: ['Edge cache', 'OAC private S3', 'TTL by asset type', 'Hash bust > invalidation', 'Behaviors per path'],
}
