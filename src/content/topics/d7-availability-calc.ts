import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Availability calculations translate SLO targets into allowed downtime and error budgets. Availability = successful requests / total requests (or uptime / total time). "Three nines" = 99.9% ≈ 8.76 hours downtime per year. Composite availability multiplies independent component availabilities.',
  whyExists:
    'Stakeholders say "highly available" without numbers. SLO math sets concrete targets, error budgets prioritize reliability work, and architecture reviews expose serial dependency chains that destroy composite availability.',
  mentalModel:
    'Uptime percentage is allowance of failure. 99.9% sounds high but is 43 minutes/month. Chain of three 99.9% services in series ≈ 99.7% end-to-end — weakest link and serial paths dominate.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Nines', 'Availability', 'Downtime/year', 'Downtime/month'],
      rows: [
        ['2 nines', '99%', '3.65 days', '~7.2 hours'],
        ['3 nines', '99.9%', '8.76 hours', '~43 min'],
        ['4 nines', '99.99%', '52.6 min', '~4.3 min'],
        ['5 nines', '99.999%', '5.26 min', '~26 sec'],
      ],
    },
    {
      type: 'list',
      items: [
        'Serial availability: A_total ≈ A1 × A2 × A3.',
        'Parallel redundancy: A_total = 1 - (1-A1)(1-A2) for active-active.',
        'Error budget month = (1 - SLO) × total requests.',
        'Composite SLA: commit only what architecture can prove.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Product promises 99.95% API availability. Monthly budget: 0.05% of 100M requests = 50k failed requests allowed. At current 0.02% burn, team can ship risky release; at 0.06% freeze deploys until recovery.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Request-based SLI more precise than time-based ping for partial failures.',
        'Maintenance windows excluded if defined in SLA — document clearly.',
        'Multi-region active-active improves parallel availability math.',
        'Dependency SLA caps your maximum — cannot exceed upstream.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Quantified reliability', 'Error budget governance', 'Architecture tradeoff clarity'],
    disadvantages: ['Math oversimplified ignores correlated failures', 'Nines arms race expensive', 'Partial outage hard in time-based SLA'],
    alternatives: ['Qualitative "best effort" — no accountability'],
    whenToUse: ['SLO definition', 'Vendor SLA comparison', 'Design review HA claims'],
    whenNotToUse: ['Early prototype — pick simpler target consciously'],
  },
  failureModes: [
    'Promise 4 nines on serial single-AZ stack',
    'Ignore dependency SLA in customer SLA',
    'Time-based SLA ignores half broken (50% errors)',
    'Error budget ignored — team ships during outage recovery',
    'Correlated AZ failure breaks independence assumption',
  ],
  production: {
    reliability: ['Document serial vs parallel paths in SLO doc', 'Error budget policy'],
    observability: ['Track budget remaining dashboard', 'Monthly SLO report'],
    cost: ['Each nine often 10x cost — justify business need'],
  },
  interview: {
    expectations: ['99.9% downtime math', 'Serial vs parallel availability', 'Error budget'],
    commonQuestions: ['How many nines for checkout?', 'Calculate composite availability?'],
    followUps: ['Request vs time SLI?', 'Cost of 4 nines?'],
    misconceptions: ['Five nines free with cloud', 'Multiply nines by adding services'],
    traps: ['SLA exceeds dependency guarantees'],
    strongSignals: ['43 min/month for 3 nines', 'Series multiplication', 'Error budget freeze policy'],
  },
  keyTakeaways: [
    '99.9% = 0.1% failure budget ≈ 43 min/month.',
    'Serial deps multiply downtime probabilities.',
    'Parallel redundancy improves combined availability.',
    'Request-based SLI catches partial failures.',
    'Error budget governs release velocity vs reliability.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '99.9% availability per month allowance?', answerHint: '~43 minutes or 0.1% failed requests.' },
    { level: 'intermediate', question: 'Two 99.9% serial services combined?', answerHint: '~99.8% — multiply: 0.999 × 0.999.' },
    { level: 'advanced', question: 'Request SLI vs uptime ping?', answerHint: 'Request SLI detects partial functional failure; ping only binary reachability.' },
  ],
  flashcards: [
    { front: 'Three nines', back: '99.9% availability — 0.1% error budget' },
    { front: 'Serial availability', back: 'Multiply individual availabilities A1×A2×A3' },
    { front: 'Error budget', back: 'Allowed failures before SLO breach in window' },
  ],
  quickRevision: [
    '99.9 ≈ 43min/mo',
    'Serial multiply',
    'Parallel redundant',
    'Request SLI',
    'Error budget',
  ],
}
