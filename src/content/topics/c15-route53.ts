import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Amazon Route 53 is AWS DNS and traffic management service — register domains, host zones with A/AAAA/CNAME/MX records, health checks, and routing policies (simple, weighted, latency, failover, geolocation). Integrates with ALB/CloudFront via alias records.',
  whyExists:
    'Users need human-readable names resolving to changing IPs. Route 53 provides authoritative DNS with low TTL, health-checked failover between regions, and weighted split for blue/green or gradual migration.',
  mentalModel:
    'Phone book of the internet for your domain. Client asks Route 53 for api.example.com → returns ALB alias IP. Health check fails on primary → failover policy returns secondary region record.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Record type', 'Use'],
      rows: [
        ['A/AAAA alias', 'Point to AWS resource ALB CloudFront S3 website'],
        ['CNAME', 'Alias to another hostname — not apex domain'],
        ['Weighted routing', 'Split traffic 90/10 canary'],
        ['Latency routing', 'Return lowest latency region record'],
        ['Failover', 'Primary + secondary with health check'],
        ['Private hosted zone', 'VPC-internal DNS app.internal'],
      ],
    },
    {
      type: 'list',
      items: [
        'Alias records to AWS resources free; no charge per query like CNAME chain.',
        'Health checks HTTP/HTTPS/TCP monitor endpoint every 30s.',
        'TTL low (60s) for faster failover; higher TTL reduces query cost and latency.',
        'Registrar vs hosted zone — can use Route 53 DNS with external registrar NS delegation.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'api.example.com alias to ALB in us-east-1 primary. Failover record secondary ALB eu-west-1 with health check on /health. If primary unhealthy, DNS returns EU within TTL window. Weighted 5% to new version ALB during canary.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Global anycast network of Route 53 resolvers — 100% SLA on DNS.',
        'DNSSEC signing available for hosted zones.',
        'Resolver endpoints hybrid DNS on-prem ↔ VPC.',
        'Query logging to CloudWatch for audit and debugging.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['AWS-native alias integration', 'Health-checked failover', 'Multiple routing policies'],
    disadvantages: ['DNS propagation/TTL delay not instant switch', 'Complex policies harder to debug', 'Cost at massive query volume'],
    alternatives: ['Cloudflare DNS', 'External registrar DNS only', 'Global load balancer anycast without DNS failover'],
    whenToUse: ['AWS app public DNS', 'Multi-region failover', 'Private VPC service discovery complement'],
    whenNotToUse: ['Instant traffic shift alone — use ALB weighted targets with DNS as coarse switch'],
  },
  failureModes: [
    'TTL 3600 — failover slow after outage',
    'Health check too aggressive — flapping failover',
    'CNAME at apex domain invalid — use alias A',
    'Forgot lower NS delegation — domain not resolving',
    'Weighted routing without session stickiness confuses stateful users briefly',
  ],
  production: {
    reliability: ['Health checks on meaningful endpoint not static 200', 'Secondary region tested regularly'],
    observability: ['Query logging', 'CloudWatch alarms on health check status'],
    security: ['Private zones for internal only records', 'IAM scoped change permissions'],
    maintainability: ['IaC Terraform route53 records', 'Document TTL and failover runbook'],
  },
  interview: {
    expectations: ['Alias vs CNAME', 'Failover routing', 'TTL tradeoff', 'Weighted canary'],
    commonQuestions: ['Multi-region failover DNS?', 'Point domain to ALB?'],
    followUps: ['DNS vs ALB for traffic split?', 'Private hosted zone?'],
    misconceptions: ['DNS change instant worldwide', 'Route 53 only for AWS domains'],
    traps: ['Relying DNS alone for zero-downtime without health checks'],
    strongSignals: ['Alias to ALB', 'Health-checked failover', 'TTL aligned to RTO', 'Weighted migration'],
  },
  keyTakeaways: [
    'Route 53 = DNS hosting + traffic routing policies.',
    'Alias records integrate tightly with AWS load balancers.',
    'Failover requires health checks and appropriate TTL.',
    'Weighted routing enables gradual traffic migration.',
    'Private hosted zones for VPC-internal names.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Route 53 purpose?', answerHint: 'DNS service — domain records, health checks, routing policies to AWS resources.' },
    { level: 'intermediate', question: 'Alias vs CNAME at apex?', answerHint: 'Alias A record works at zone apex pointing to ALB; CNAME not allowed at apex.' },
    { level: 'advanced', question: 'Primary region down — Route 53 behavior?', answerHint: 'Health check fails; failover policy returns secondary record — clients re-resolve after TTL.' },
  ],
  flashcards: [
    { front: 'Alias record', back: 'Route 53 record pointing to AWS resource without CNAME chain' },
    { front: 'Weighted routing', back: 'Distribute queries by assigned weights — canary' },
    { front: 'TTL', back: 'DNS cache duration — lower faster failover more queries' },
    { front: 'Private hosted zone', back: 'DNS resolvable only within associated VPCs' },
  ],
  quickRevision: ['DNS + routing policies', 'Alias to ALB/CF', 'Health check failover', 'TTL tradeoff', 'Weighted canary'],
}
