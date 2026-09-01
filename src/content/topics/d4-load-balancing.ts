import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Load balancing distributes incoming traffic across multiple backend servers (or tasks) to improve throughput, fault tolerance, and utilization. Layers include DNS, L4 (TCP), L7 (HTTP), and client-side/service-mesh balancers.',
  whyExists:
    'Single servers hit CPU, connection, and NIC limits. Without load balancing, one node failure takes down the service; with it, traffic shifts to healthy peers. It also enables rolling deploys and autoscaling.',
  mentalModel:
    'A load balancer is a traffic director with a health-aware routing table. Each request is mapped to a backend via an algorithm (round robin, least connections, consistent hash). Unhealthy targets are removed from rotation.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Layer', 'What it sees', 'Examples'],
      rows: [
        ['DNS', 'Hostname → multiple A records', 'Route53, Cloudflare (coarse, TTL caching)'],
        ['L4', 'IP + port', 'AWS NLB, HAProxy TCP mode'],
        ['L7', 'HTTP path, headers, cookies', 'NGINX, ALB, Envoy'],
        ['Client-side', 'App picks instance from registry', 'gRPC client LB, Eureka + Ribbon'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'L7 load balancer path-based routing',
      diagram: `flowchart LR
  Client --> DNS[DNS]
  DNS --> LB[L7 Load Balancer]
  LB -->|/api| API1[API pod 1]
  LB -->|/api| API2[API pod 2]
  LB -->|/static| CDN[CDN / static pool]
  LB --> HC[Health checks]
  HC --> API1
  HC --> API2`,
    },
    {
      type: 'list',
      items: [
        'Health checks: HTTP /health, TCP connect, custom — interval + threshold',
        'Sticky sessions: cookie or consistent hash on user_id (trade statelessness)',
        'SSL termination at LB vs passthrough (security/compliance tradeoff)',
        'Connection draining: stop new requests before kill pod',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Flash sale: 50 API pods behind ALB. Least-outstanding-requests algorithm sends traffic to pods with spare capacity. Unhealthy pods fail /health (DB down) and drop from target group within 2 checks.',
    },
    {
      type: 'code',
      language: 'nginx',
      caption: 'Upstream block with health-aware peers',
      code: `upstream api {
  least_conn;
  server 10.0.1.10:8080 max_fails=3 fail_timeout=30s;
  server 10.0.1.11:8080 max_fails=3 fail_timeout=30s;
}
server {
  location / {
    proxy_pass http://api;
    proxy_set_header X-Request-Id $request_id;
  }
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Horizontal scale and fault isolation',
      'Zero-downtime deploys with draining',
      'L7 routing enables microservice path rules',
    ],
    disadvantages: [
      'LB becomes critical infrastructure — HA pair or managed service',
      'Sticky sessions complicate scale-down',
      'Misconfigured health checks cause flapping or blackholes',
    ],
    alternatives: [
      'DNS round robin only (no health awareness)',
      'Service mesh sidecar (Envoy) for east-west',
      'Anycast at edge (Cloudflare)',
    ],
    whenToUse: ['Any multi-instance HTTP/TCP service', 'Kubernetes Ingress', 'Blue/green cutover'],
    whenNotToUse: ['Single dev laptop', 'Stateful primary-only DB writes without read replica LB distinction'],
  },
  failureModes: [
    'Thundering herd when all clients reconnect to same healthy node',
    'Health check passes but app broken (check too shallow)',
    'Long-lived WebSocket stuck on dying node without drain',
    'Hot key with consistent hash — one shard overloaded',
  ],
  production: {
    performance: ['Keep LB close to clients (edge) and backends (same AZ)', 'HTTP/2 multiplexing at L7'],
    scalability: ['Auto-scale target groups on CPU/RPS', 'Separate pools for read-heavy vs write-heavy'],
    reliability: ['Multi-AZ LB', 'Circuit break unhealthy AZ'],
    observability: ['5xx rate per target', 'Target connection count', 'Synthetic probes'],
    security: ['WAF at L7', 'mTLS for internal east-west'],
  },
  interview: {
    expectations: [
      'Compare L4 vs L7 with examples',
      'Explain algorithms and sticky sessions',
      'Discuss health checks and connection draining',
    ],
    commonQuestions: ['Round robin vs least connections?', 'How handle WebSockets behind LB?'],
    followUps: ['Global load balancing across regions?', 'Consistent hashing for cache nodes?'],
    misconceptions: ['LB replaces autoscaling', 'DNS LB is enough for fast failover'],
    traps: ['Ignoring keep-alive connection pinning to one pod'],
    strongSignals: ['Mentions draining, grace period, readiness vs liveness'],
  },
  keyTakeaways: [
    'L4 fast opaque; L7 smart HTTP routing.',
    'Health checks must reflect real dependencies.',
    'Algorithms: RR, least conn, weighted, consistent hash.',
    'Drain connections before pod termination.',
    'Client-side LB for gRPC/microservice meshes.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why load balance?',
      answerHint: 'Scale, fault tolerance, even utilization.',
    },
    {
      level: 'intermediate',
      question: 'L4 vs L7 difference?',
      answerHint: 'TCP vs HTTP-aware routing, headers, TLS termination.',
    },
    {
      level: 'advanced',
      question: 'Design LB for sticky WebSocket chat.',
      answerHint: 'Consistent hash on room_id or cookie; drain on upgrade; Redis pub/sub for cross-node.',
    },
  ],
  flashcards: [
    { front: 'L7 load balancer', back: 'HTTP-aware: path, host, headers' },
    { front: 'Least connections', back: 'Send to backend with fewest active connections' },
    { front: 'Connection draining', back: 'Stop new traffic; finish in-flight before shutdown' },
    { front: 'Consistent hashing', back: 'Stable mapping user→node; minimal remapping on scale' },
  ],
  quickRevision: [
    'DNS coarse; L4 TCP; L7 HTTP',
    'Health: readiness ≠ liveness',
    'Algorithms: RR, least conn, hash',
    'Sticky vs stateless apps',
    'Drain + grace period on deploy',
  ],
  systemDesign: {
    problem: 'Design load balancing for a global HTTP API (booking) with autoscaling Kubernetes pods, WebSocket notifications, and zero-downtime deploys.',
    requirements: {
      functional: ['Route REST to API pool', 'Upgrade to WebSocket on /ws', 'Blue/green deploy support'],
      nonFunctional: ['p99 add < 20ms LB overhead', 'Multi-AZ', 'Automatic unhealthy removal'],
    },
    scaleAssumptions: ['Peak 100k RPS REST', '50k concurrent WebSockets', '20–200 pods'],
    capacityEstimates: [
      'Managed ALB handles 100k+ RPS with proper target sizing',
      'WebSocket memory on LB if terminated — often pass-through to pods',
    ],
    api: [{ type: 'paragraph', text: 'Public HTTPS → ALB → Ingress → Service → Pods' }],
    dataModel: [{ type: 'paragraph', text: 'Target group: pod IP, port, health status, weight' }],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Route53 latency routing → regional ALB → NGINX Ingress (L7 path rules) → K8s Service (ClusterIP) → pods. WebSocket: Ingress with upgrade headers; optional Redis backplane for fan-out.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  Users --> R53[Route53 latency]
  R53 --> ALB[Regional ALB]
  ALB --> Ing[Ingress NGINX]
  Ing --> Svc[K8s Service]
  Svc --> P1[Pod]
  Svc --> P2[Pod]
  P1 & P2 --> Redis[(Redis pub/sub)]
  Ing -->|/health| HC[Health aggregator]`,
      caption: 'Regional L7 path to pod pool',
    },
    dataFlow: [
      'TLS terminate at ALB',
      'Ingress routes /v1/* to api-svc',
      'kube-proxy or IPVS distributes to endpoints',
      'preStop hook + draining waits 30s',
    ],
    storage: ['N/A — stateless LB config in IaC'],
    caching: ['Optional edge CDN for GET static assets'],
    asyncProcessing: ['N/A'],
    scaling: ['HPA on CPU/RPS; cluster autoscaler for nodes'],
    consistency: ['Config propagation eventual across LB nodes'],
    reliability: ['Multi-AZ targets', 'Retry idempotent GET on 502 from dead pod'],
    failureScenarios: [
      'All pods fail health → 503; circuit to fallback page',
      'AZ outage → Route53 shift traffic',
      'Sticky WS on dead pod → client reconnect + room hash',
    ],
    security: ['WAF rate limits', 'Only LB exposes public SG'],
    observability: ['Target 5xx, latency, active connections, drain events'],
    bottlenecks: ['Single hot pod if hash skew', 'Ingress controller CPU on TLS'],
    alternatives: ['Service mesh for east-west only; edge LB for north-south'],
    tradeoffs: [
      'Terminate TLS at LB vs pod (key management)',
      'Sticky sessions vs external session store',
    ],
    interviewFollowUps: [
      'Readiness probe that checks DB?',
      'How blue/green switch traffic?',
    ],
    evolution: [
      { stage: '1. Simple design', description: 'Single NGINX RR to 2 VMs.', bottleneck: 'No health-aware removal.' },
      { stage: '2. Improve', description: 'Managed ALB + ASG + HTTP health.', bottleneck: 'Deploy drops connections.' },
      { stage: '3. Improve', description: 'K8s rolling update + preStop drain + proper probes.', bottleneck: 'WebSocket cross-pod fan-out.' },
      { stage: '4. Scale further', description: 'Multi-region latency LB; Redis WS backplane; weighted canary.', bottleneck: 'Global session stickiness complexity.' },
    ],
  },
}
