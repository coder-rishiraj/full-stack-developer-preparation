import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Server requirements in system design interviews translate product needs into concrete infrastructure numbers — CPU cores, RAM, instance count, network bandwidth, disk IOPS — derived from QPS, payload size, concurrency, and headroom. Bridges capacity estimates to hardware selection.',
  whyExists:
    'Saying "10k RPS" without server count is incomplete. Interviewers expect back-of-envelope: peak RPS per core, memory per connection, replication factor, and N+1 redundancy. Wrong sizing wastes cost or causes outages.',
  mentalModel:
    'Recipe scaling. If one oven bakes 50 cookies/hour and wedding needs 500/hour peak → 10 ovens + 2 spare. Map RPS/core, add 30-50% headroom, round up for AZ failure losing one zone.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Input', 'Derives'],
      rows: [
        ['Peak RPS', 'App servers = peak / RPS_per_instance'],
        ['Payload KB × RPS', 'Network Mbps egress/ingress'],
        ['Concurrent users × memory/user', 'RAM for session state'],
        ['DB write RPS', 'IOPS + connection pool size'],
        ['Storage GB/day × retention', 'Disk + backup capacity'],
        ['Availability target', 'Multi-AZ min 3 nodes per tier odd quorum'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Sizing funnel',
      diagram: `flowchart TB
  DAU[DAU + usage] --> QPS[Peak QPS]
  QPS --> App[App server count]
  QPS --> Cache[Redis memory]
  QPS --> DB[DB IOPS replicas]
  App --> Net[Bandwidth Mbps]`,
    },
    {
      type: 'list',
      items: [
        'RPS per core rule of thumb: 500-2000 for Java Spring API varies widely — state assumptions.',
        'Headroom 30-50% for spikes and deploy rolling.',
        'Multi-AZ: if need 6 servers steady, 9 across 3 AZ tolerates one AZ loss.',
        'Connection pool: DB max_connections / num_app_instances.',
        'State explicitly: "Assume 1KB response, 70% cache hit".',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'text',
      caption: 'API tier sizing example',
      code: `Peak RPS = 20,000
Per instance capacity = 2,000 RPS (8 vCPU Spring, measured or assumed)
Base instances = 20,000 / 2,000 = 10
Headroom 40% → 14 instances
3 AZ → round to 15 (5 per AZ)
Lose 1 AZ: 10 remain ≥ 20k? 10×2000=20k OK at edge with CDN absorbing reads`,
    },
    {
      type: 'paragraph',
      text: 'WebSocket chat 100k concurrent connections: 10k connections/instance JVM tuned → 10 instances minimum + 3 spare. RAM: 10k × 50KB session ≈ 500MB + heap overhead → 4GB heap per instance. Egress: avg 200 bytes/msg × 5 msg/s/user × 100k = high — separate messaging tier calculation.',
    },
  ],
  tradeoffs: {
    advantages: ['Concrete deployable plan', 'Cost visibility', 'Validates bottlenecks early'],
    disadvantages: ['Assumption sensitivity', 'Workload dependent constants', 'Over-precision false confidence'],
    alternatives: ['Load test validate only', 'Auto-scale without upfront math — still need limits'],
    whenToUse: ['Every system design capacity section', 'Infrastructure budgeting'],
    whenNotToUse: ['Early exploration before QPS known — qualify ranges'],
  },
  failureModes: [
    'Used average not peak RPS',
    'Ignored fan-out internal multiplier',
    'Single AZ sizing — AZ failure overload',
    'DB connections pool exhaustion math skipped',
    'Forgot background batch CPU steal',
  ],
  production: {
    scalability: ['Auto-scale above calculated baseline', 'Load test to validate RPS/instance'],
    cost: ['Right-size from metrics not peak+10×', 'Reserved instances for baseline'],
    reliability: ['N+1 or N+2 redundancy per AZ math'],
    observability: ['Compare actual vs estimated RPS/cpu in post-launch review'],
  },
  interview: {
    expectations: ['QPS to server count math', 'Headroom and AZ loss', 'State assumptions', 'DB pool and IOPS mention'],
    commonQuestions: ['How many servers for 50k RPS?', 'Size DB for write load?'],
    followUps: ['What if 2× traffic in 6 months?', 'CDN reduces what tier?'],
    misconceptions: ['One size fits all RPS/core', 'Infinite horizontal scale free'],
    traps: ['Server count without showing calculation'],
    strongSignals: ['Explicit formula', 'Headroom %', 'Multi-AZ loss scenario', 'Cache hit reduces DB tier'],
  },
  keyTakeaways: [
    'Derive server count from peak RPS / capacity per node.',
    'Add 30-50% headroom and multi-AZ redundancy.',
    'State all assumptions clearly in interview.',
    'Size network, RAM, disk from payload and retention.',
    'Validate estimates with load test in real projects.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why server sizing in system design?', answerHint: 'Translate QPS and constraints into instance count, RAM, bandwidth — prove design deployable.' },
    { level: 'intermediate', question: '20k peak RPS 2k per server — how many?', answerHint: '10 base + headroom 40% ≈ 14-15; spread across AZs; verify one AZ loss still meets peak.' },
    { level: 'advanced', question: 'Sizing DB connections?', answerHint: 'pool_per_app × app_instances ≤ DB max_connections minus admin margin; read replicas for read RPS.' },
  ],
  flashcards: [
    { front: 'Headroom', back: 'Extra capacity 30-50% above calculated peak' },
    { front: 'RPS per instance', back: 'Throughput one server handles — measure or assume explicitly' },
    { front: 'AZ loss', back: 'Remaining AZs must carry peak after one zone down' },
    { front: 'Connection pool math', back: 'Instances × pool size must fit DB max connections' },
  ],
  quickRevision: ['Peak RPS / per-node', 'Headroom + AZ', 'State assumptions', 'Network + RAM + IOPS', 'Load test validate'],
}
