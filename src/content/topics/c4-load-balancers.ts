import type { TopicContent } from '@/domain/types'

export const loadBalancersContent: TopicContent = {
  whatIsIt:
    'Load balancers distribute incoming traffic across multiple backend servers to improve availability, throughput, and fault tolerance. Layer 4 (TCP) balances connections; Layer 7 (HTTP) routes by URL, headers, cookies. Algorithms: round-robin, least connections, weighted, consistent hash.',
  whyExists:
    'Single server hits CPU/network limits and is SPOF. Load balancing spreads work, removes failed nodes from rotation, enables rolling deploys without downtime, and scales horizontally as demand grows.',
  mentalModel:
    'Traffic cop at highway fork: directs cars (requests) to open lanes (healthy servers). Health checks close lanes with accidents (unhealthy instances). Sticky sessions send same client to same lane when needed.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Algorithm', 'Behavior'],
      rows: [
        ['Round robin', 'Sequential equal rotation'],
        ['Weighted RR', 'Proportional to server capacity'],
        ['Least connections', 'Send to fewest active connections'],
        ['IP hash', 'Same client IP → same server'],
        ['Consistent hash', 'Minimal remap when nodes added/removed'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Load balanced request flow',
      diagram: `flowchart TB
  Clients[Clients] --> LB[Load balancer]
  LB --> H1[Healthy server 1]
  LB --> H2[Healthy server 2]
  LB -.->|health fail| X[Unhealthy server 3]
  H1 --> DB[(Shared DB / cache)]`,
    },
    {
      type: 'list',
      items: [
        'Active health checks: HTTP GET /health every N seconds.',
        'Passive health: observe 5xx rates, circuit break.',
        'DNS load balancing: multiple A records — coarse, TTL delay.',
        'Global server load balancing (GSLB): geo-routing to regions.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'text',
      caption: 'AWS ALB concepts',
      code: `Target group: [i-abc:8080, i-def:8080]
Listener: HTTPS:443 → forward to target group
Health check: GET /actuator/health → 200
Sticky: LB cookie 1 hour (if sessions in-memory)`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring Boot health for LB',
      code: `@RestController
class HealthController {
  @GetMapping("/actuator/health")
  public Map<String, String> health() {
    return Map.of("status", db.isUp() ? "UP" : "DOWN");
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'L4 LB (NLB): fast, any TCP protocol, no URL awareness.',
        'L7 LB (ALB): content routing, TLS, HTTP/2 termination.',
        'Connection draining: stop new requests to instance during deploy.',
        'Thundering herd: many clients reconnect after failure — jitter backoff.',
        'Stateful apps need sticky sessions or externalized session store.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Horizontal scalability and fault tolerance',
      'Zero-downtime deploys with health checks',
      'L7 routing enables microservice path rules',
    ],
    disadvantages: [
      'Sticky sessions complicate even distribution',
      'LB itself must be HA (multi-AZ, pair)',
      'Cold instances may get traffic before warmed up',
    ],
    alternatives: [
      'Client-side load balancing (gRPC, Eureka + Ribbon)',
      'DNS round-robin only (weak health awareness)',
      'Service mesh data plane balancing',
    ],
    whenToUse: [
      'Multiple app instances behind public API',
      'Rolling updates and autoscaling groups',
    ],
    whenNotToUse: [
      'Single instance dev (overkill)',
      'When consistent locality required without hash (use shard key)',
    ],
  },
  failureModes: [
    'Health check too shallow — instance UP but app broken.',
    'All traffic to one AZ if cross-zone LB misconfigured.',
    'Sticky cookie + instance drain → user session loss.',
    'SYN flood without SYN cookies/protection.',
    'Uneven load with long-lived connections on one server.',
  ],
  interview: {
    expectations: [
      'L4 vs L7 load balancing',
      'Common algorithms and when to use',
      'Health checks and session stickiness',
    ],
    commonQuestions: [
      'How load balancer works?',
      'Round robin vs least connections?',
      'L4 vs L7 LB?',
      'What is sticky session?',
    ],
    followUps: [
      'Load balance stateful vs stateless apps?',
      'How handle instance failure mid-request?',
    ],
    misconceptions: [
      'Load balancer eliminates need for shared session store always',
      'Round robin always fair (ignores connection duration)',
      'DNS LB replaces application LB for fine control',
    ],
    traps: ['Recommending sticky sessions without mentioning Redis session store alternative'],
    strongSignals: [
      'Health check design with deep checks',
      'Stateless + Redis over sticky when possible',
      'Connection draining on deploy',
    ],
  },
  keyTakeaways: [
    'Distributes traffic across healthy backends.',
    'L4 TCP vs L7 HTTP routing.',
    'Health checks remove failed instances.',
    'Prefer stateless servers; externalize sessions.',
    'Algorithms: RR, least conn, consistent hash.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why use a load balancer?',
      answerHint: 'Scale horizontally, fault tolerance, distribute traffic across servers.',
    },
    {
      level: 'intermediate',
      question: 'Layer 4 vs Layer 7 load balancing?',
      answerHint: 'L4 TCP connection level; L7 HTTP aware path/header routing.',
    },
    {
      level: 'advanced',
      question: 'Sticky sessions vs centralized session store?',
      answerHint: 'Sticky routes user to same node; Redis session store allows any node — better for elasticity.',
    },
  ],
  flashcards: [
    { front: 'Least connections', back: 'Route to server with fewest active connections' },
    { front: 'L7 load balancer', back: 'HTTP-aware routing e.g. ALB' },
    { front: 'Connection draining', back: 'Finish in-flight before removing instance from pool' },
  ],
  quickRevision: [
    'L4 vs L7',
    'Round robin least conn',
    'Health checks',
    'Sticky vs Redis session',
    'ALB NLB nginx',
    'Connection draining',
    'Stateless backends preferred',
  ],
}

export const content = loadBalancersContent
