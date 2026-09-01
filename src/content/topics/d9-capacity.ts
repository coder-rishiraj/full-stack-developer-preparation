import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Capacity estimation in system design interviews is structured back-of-envelope math — DAU to QPS, storage growth, bandwidth, cache size, and server counts — stated with explicit assumptions. Shows you can connect product scale to infrastructure before deep architecture.',
  whyExists:
    'Interviewers need evidence you think quantitatively, not only draw boxes. Five minutes of math validates whether your design fits 1M or 1B users and exposes bottlenecks early. Skipping capacity signals junior level.',
  mentalModel:
    'Fermi problem: break into knowable pieces, multiply, round aggressively. Write assumptions on the whiteboard — "100M DAU, 10 clicks/day, 5 KB response" — then derive QPS, storage, bandwidth. Wrong order of magnitude caught early.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Dimension', 'Formula sketch', 'Round to'],
      rows: [
        ['QPS', 'DAU × actions/day / 86400 × peak', 'Nearest 1k'],
        ['Storage', 'objects × size × users × years × 3 repl', 'TB/PB'],
        ['Bandwidth', 'peak QPS × response bytes', 'Gbps'],
        ['Cache', 'hot keys × object size', 'GB Redis'],
        ['Servers', 'peak QPS / RPS per node', 'Add 2× headroom'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Capacity estimation flow',
      diagram: `flowchart TB
  Assum[State assumptions] --> QPS[Estimate QPS]
  QPS --> BW[Bandwidth]
  Assum --> Store[Storage/year]
  QPS --> Cache[Cache working set]
  QPS --> Srv[Server count]`,
    },
    {
      type: 'list',
      items: [
        'First 5 minutes after requirements — before deep dives',
        'State peak factor 3–5× explicitly',
        'Separate read vs write paths in math',
        'Sanity check: does number feel huge? adjust assumptions',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Pastebin: 10M DAU, 1 paste/user/day avg 10 KB, 5 views/paste × 2 KB read → writes ~120/s avg, reads ~600/s avg, peak 5× → 600 write RPS, 3k read RPS. Storage 10M × 10 KB/day ≈ 100 GB/day ≈ 36 TB/year. Cache top 20% pastes → Redis ~7 TB working set or CDN for reads instead.',
    },
  ],
  tradeoffs: {
    advantages: ['Validates design feasibility', 'Prioritizes bottlenecks', 'Interview differentiator'],
    disadvantages: ['Time consuming if over-detailed', 'Wrong assumptions still derail'],
    alternatives: ['Qualitative "lots of scale" — weak in interviews'],
    whenToUse: ['Every HLD after requirements', 'Before choosing DB vs cache'],
    whenNotToUse: ['Pure methodology questions without numbers'],
  },
  failureModes: [
    'Math without stated assumptions',
    'Average QPS without peak factor',
    'Forgot replication or index overhead',
    'One number for entire system — no read/write split',
    'Spent 20 minutes — no time for architecture',
  ],
  production: {
    scalability: ['Estimates become autoscale and shard triggers in prod'],
    cost: ['Capacity plan drives budget requests'],
    observability: ['Compare estimates to prod metrics post-launch'],
  },
  interview: {
    expectations: ['DAU→QPS', 'Storage/year', 'State assumptions'],
    commonQuestions: ['Estimate Twitter storage?', 'Servers for 50k RPS?'],
    followUps: ['What if 10× growth?', 'Bottleneck from your math?'],
    misconceptions: ['Exact precision needed — orders of magnitude suffice'],
    traps: ['Skip capacity entirely'],
    strongSignals: ['Written assumptions', 'Peak factor', 'Identifies bottleneck from math'],
  },
  keyTakeaways: [
    'State assumptions first — DAU, actions, sizes.',
    'QPS, storage, bandwidth, cache — four pillars.',
    'Peak factor 3–5× on average QPS.',
    'Round aggressively; orders of magnitude matter.',
    '5 minutes max — then architecture.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '1M requests/day — avg QPS?', answerHint: '1M/86400 ≈ 12 RPS average.' },
    { level: 'intermediate', question: 'Capacity section order in interview?', answerHint: 'After requirements, before HLD — QPS, storage, bandwidth, identify bottleneck.' },
    { level: 'advanced', question: 'Estimate shows DB write bound — architecture change?', answerHint: 'Shard writes, queue async indexing, cache reads, separate hot path — tie fix to math.' },
  ],
  flashcards: [
    { front: 'Avg QPS from DAU', back: 'DAU × actions/day / 86400' },
    { front: 'Peak factor', back: 'Multiply avg QPS by 3–10 for spike capacity' },
    { front: 'Storage/year', back: 'daily_new_bytes × 365 × replication factor' },
    { front: 'Interview capacity timing', back: '~5 min after requirements before deep architecture' },
  ],
  quickRevision: [
    'State assumptions',
    'QPS storage BW',
    'Peak 3–5×',
    'Round orders',
    '5 min max',
  ],
}
