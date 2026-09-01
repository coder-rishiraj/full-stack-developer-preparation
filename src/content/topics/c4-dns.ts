import type { TopicContent } from '@/domain/types'

export const dnsContent: TopicContent = {
  whatIsIt:
    'DNS (Domain Name System) maps human-readable domain names (api.example.com) to IP addresses and other records (MX, CNAME, TXT). Hierarchical distributed database: resolvers query recursive/iterative through root → TLD → authoritative nameservers.',
  whyExists:
    'IPs change, load-balance, and are hard to remember. DNS decouples service identity from network location, enables CDN routing, email routing (MX), and service discovery patterns.',
  mentalModel:
    'Phone book for the internet. Browser asks resolver “what IP for api.example.com?” Resolver caches answer (TTL), walks DNS tree if miss, returns A/AAAA record. CNAME is alias; multiple A records = round-robin or anycast.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Record', 'Purpose'],
      rows: [
        ['A', 'IPv4 address'],
        ['AAAA', 'IPv6 address'],
        ['CNAME', 'Alias to another name'],
        ['MX', 'Mail server priority + host'],
        ['TXT', 'Arbitrary text (SPF, verification)'],
        ['NS', 'Authoritative nameserver'],
        ['TTL', 'Cache lifetime in seconds'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Resolution flow',
      diagram: `sequenceDiagram
  participant B as Browser
  participant R as Resolver
  participant Root as Root NS
  participant TLD as .com NS
  participant Auth as example.com NS
  B->>R: api.example.com?
  R->>Root: referral
  R->>TLD: referral
  R->>Auth: A record
  Auth-->>R: 203.0.113.10 TTL=300
  R-->>B: cached answer`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Caching layers',
      text: 'OS stub resolver → ISP/public resolver (8.8.8.8) → browser cache. TTL controls staleness; low TTL for fast failover, high for stability.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'dig lookup',
      code: `dig api.example.com A +short
# 203.0.113.10

dig api.example.com CNAME
# cdn.example.net.`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Java InetAddress resolution',
      code: `InetAddress addr = InetAddress.getByName("api.example.com");
String ip = addr.getHostAddress(); // blocks on DNS
// Cache TTL controlled by JVM security policy (networkaddress.cache.ttl)`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'UDP port 53 default; TCP for large responses/truncation.',
        'DNSSEC signs records — prevents cache poisoning if validated.',
        'Negative caching: NXDOMAIN also cached with TTL.',
        'Split-horizon: internal DNS returns private IPs for corp hosts.',
        'Service mesh / K8s CoreDNS for cluster.local internal names.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Decouples names from IPs — change backend without client updates',
      'Distributed, cached, highly scalable',
      'Rich record types for mail, verification, CDN',
    ],
    disadvantages: [
      'Propagation delay with TTL and caching',
      'Misconfiguration causes subtle outages',
      'Plain DNS not encrypted (DoH/DoT add privacy)',
    ],
    alternatives: [
      'Static /etc/hosts for dev',
      'Service discovery (Consul, Eureka) inside datacenter',
      'Hardcoded IPs (anti-pattern)',
    ],
    whenToUse: [
      'All public service naming',
      'CDN CNAME cutover, blue-green DNS switch',
    ],
    whenNotToUse: [
      'Low-latency in-cluster calls — use service mesh DNS',
      'Secrets in TXT without understanding exposure',
    ],
  },
  failureModes: [
    'TTL too high — slow failover after IP change.',
    'CNAME at apex (some providers need ALIAS/ANAME).',
    'Circular CNAME chains.',
    'DNS resolver timeout → cascading app failures.',
    'Cache poisoning without DNSSEC (historical risk).',
  ],
  interview: {
    expectations: [
      'Explain resolution steps and record types',
      'Role of TTL and caching',
      'A vs CNAME vs MX',
    ],
    commonQuestions: [
      'How does DNS work?',
      'What is TTL?',
      'A record vs CNAME?',
      'What happens when you type URL in browser?',
    ],
    followUps: [
      'DNS in microservice deployment?',
      'DoH vs traditional DNS?',
    ],
    misconceptions: [
      'DNS always returns one IP (can be multiple A records)',
      'CNAME and A interchangeable at apex',
      'DNS lookup happens once per HTTP request always',
    ],
    traps: ['Forgetting caching layers when explaining “propagation time”'],
    strongSignals: [
      'Mentions recursive vs authoritative',
      'TTL trade-offs for failover',
      'Connects to connection pooling / keep-alive',
    ],
  },
  keyTakeaways: [
    'DNS maps names → IPs (+ MX, TXT, etc.).',
    'Resolver walks hierarchy; answers cached by TTL.',
    'A/AAAA direct; CNAME alias.',
    'Low TTL for migration; high for stability.',
    'First step before TCP connect in HTTP client.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does DNS do?',
      answerHint: 'Resolves domain names to IP addresses and other resource records.',
    },
    {
      level: 'intermediate',
      question: 'What is TTL and why does it matter?',
      answerHint: 'Cache duration; low TTL faster failover, more query load.',
    },
    {
      level: 'advanced',
      question: 'Difference between recursive and authoritative DNS?',
      answerHint: 'Recursive resolves on behalf of client; authoritative owns zone data.',
    },
  ],
  flashcards: [
    { front: 'A vs AAAA', back: 'A = IPv4; AAAA = IPv6' },
    { front: 'CNAME', back: 'Alias pointing to another canonical name' },
    { front: 'TTL', back: 'How long resolvers cache a record' },
  ],
  quickRevision: [
    'Root → TLD → authoritative',
    'A / AAAA / CNAME / MX / TXT',
    'TTL controls cache',
    'UDP 53, TCP if truncated',
    'dig for debugging',
    'JVM DNS cache TTL',
    'Before TCP in HTTP flow',
  ],
}

export const content = dnsContent
