import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'AWS load balancers distribute traffic across targets: ALB (Application Layer 7 HTTP/HTTPS with path/host routing), NLB (Layer 4 TCP/UDP ultra-low latency), GLB (Gateway for third-party appliances). Health checks remove unhealthy targets; integrate with ECS, EC2 ASG, and EKS.',
  whyExists:
    'Single EC2 is SPOF. ALB terminates TLS, routes /api to one target group and /static to another, supports WebSocket, and enables zero-downtime rolling deploys by draining connections from old tasks.',
  mentalModel:
    'Front door of your app in AWS. Clients hit ALB DNS name; ALB picks healthy backend from target group using round robin or least outstanding requests. Unhealthy instances fail health check and stop receiving traffic.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Type', 'Layer', 'Use'],
      rows: [
        ['ALB', 'L7 HTTP', 'Microservices path routing, host rules, TLS'],
        ['NLB', 'L4 TCP/UDP', 'Millions RPS, static IP, preserve source IP'],
        ['CLB', 'Legacy L4/L7', 'Avoid for new designs'],
      ],
    },
    {
      type: 'list',
      items: [
        'Target group: EC2 instances, IP, or Lambda targets.',
        'Health check: GET /actuator/health → 200, interval and threshold.',
        'Listener rules: host header api.example.com → tg-api.',
        'Sticky sessions: LB cookie when session in-memory on instance.',
        'Connection draining (deregistration delay) on deploy.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'HTTPS listener 443 with ACM cert. Rule path /api/* → ECS service target group port 8080. Health check /actuator/health every 15s. ASG registers new instances automatically. Old task drained 30s before stop during deploy.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'ALB inserts X-Forwarded-For, X-Forwarded-Proto headers.',
        'Cross-zone load balancing optional on NLB (charges).',
        'ALB idle timeout default 60s — align with keep-alive.',
        'WAF attaches to ALB for OWASP rule sets.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['HA managed service', 'TLS termination', 'Path-based routing', 'Health-aware routing'],
    disadvantages: ['ALB cost per LCU', 'Sticky sessions complicate scale-out', 'Cross-AZ data charge'],
    alternatives: ['CloudFront + origin', 'Service mesh internal LB', 'NLB for TCP passthrough TLS'],
    whenToUse: ['Public HTTP APIs', 'ECS/EKS ingress', 'Multi-AZ web tier'],
    whenNotToUse: ['Internal gRPC only — consider NLB or mesh', 'Single dev instance'],
  },
  failureModes: [
    'Health check too strict — flapping targets',
    'Security group blocks ALB to target port',
    'Idle timeout kills long SSE unless tuned',
    'All targets unhealthy — 503 to users',
    'Wrong target type — IP vs instance registration',
  ],
  production: {
    reliability: ['Multi-AZ ALB automatic', 'Graceful drain on deploy', 'Multiple healthy targets min'],
    security: ['TLS 1.2+ ACM certs', 'WAF on public ALB', 'SG ALB → app only'],
    observability: ['ALB access logs to S3', 'CloudWatch HTTPCode_Target_5XX'],
    cost: ['LCU optimization — reuse connections, HTTP/2'],
  },
  interview: {
    expectations: ['ALB vs NLB', 'Health checks', 'Target group concept'],
    commonQuestions: ['ALB vs NLB when?', 'Zero-downtime deploy with ALB?'],
    followUps: ['Sticky sessions tradeoff?', 'WAF integration?'],
    misconceptions: ['ALB balances across regions', 'Health check optional'],
    traps: ['Health check hits endpoint needing auth without bypass path'],
    strongSignals: ['Drain period on deploy', 'Path-based routing', 'Actuator health'],
  },
  keyTakeaways: [
    'ALB L7 for HTTP routing and TLS; NLB L4 for TCP scale.',
    'Target groups + health checks route only to healthy backends.',
    'Connection draining enables rolling deploys.',
    'Place ALB in public subnets; targets often private.',
    'Monitor Target 5xx and unhealthy host count.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'ALB vs NLB?', answerHint: 'ALB HTTP path/host routing; NLB TCP ultra scale low latency.' },
    { level: 'intermediate', question: 'Rolling deploy without downtime?', answerHint: 'Register new targets; health pass; drain old; deregister.' },
    { level: 'advanced', question: 'ALB 502 vs 503?', answerHint: '502 bad gateway from target; 503 no healthy targets available.' },
  ],
  flashcards: [
    { front: 'Target group', back: 'Set of registered backends ALB forwards to' },
    { front: 'Connection draining', back: 'Finish in-flight requests before removing target' },
    { front: 'ALB health check', back: 'Periodic probe; fail removes target from rotation' },
  ],
  quickRevision: [
    'ALB L7 NLB L4',
    'Target group',
    'Health checks',
    'Drain on deploy',
    'ACM TLS',
  ],
}
