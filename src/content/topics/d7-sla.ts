import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A Service Level Agreement (SLA) is a contractual commitment to customers defining measurable service quality — typically availability percentage, response time, support response — with remedies (credits, penalties) when targets are missed. SLAs are external promises backed by legal and financial terms.',
  whyExists:
    'Enterprise buyers need enforceable guarantees, not marketing uptime claims. SLAs align vendor accountability with customer expectations and drive internal investment in reliability, monitoring, and incident response to avoid credit payouts.',
  mentalModel:
    'Insurance policy with fine print. "99.9% uptime" sounds simple but defines measurement window, exclusions (scheduled maintenance), credit tiers, and what "up" means (which endpoints, which regions). Internal SLOs must be stricter than external SLA to absorb error budget buffer.',
  howItWorks: [
    {
      type: 'table',
      headers: ['SLA tier', 'Monthly uptime', 'Max downtime / month'],
      rows: [
        ['99%', '~7.2 hours', 'Basic tier'],
        ['99.9%', '~43 minutes', 'Standard enterprise'],
        ['99.95%', '~22 minutes', 'Premium'],
        ['99.99%', '~4.3 minutes', 'Mission-critical'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'SLA → SLO → SLI chain',
      diagram: `flowchart LR
  SLI[SLI measurement] --> SLO[Internal SLO stricter]
  SLO --> SLA[External SLA promise]
  SLA --> Credits[Credits if breached]`,
    },
    {
      type: 'list',
      items: [
        'Define scope: which products, regions, endpoints included',
        'Exclusions: planned maintenance windows, force majeure, customer-caused',
        'Credit schedule: e.g. 10% monthly fee per 0.1% below target',
        'Internal SLO target ≥ SLA + safety margin (error budget buffer)',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'SaaS API SLA: 99.9% monthly availability measured on core REST endpoints in production US/EU regions. Excludes scheduled maintenance (max 4h/month notice). If 99.5–99.9%, 10% credit; below 99.5%, 25% credit. Internal SLO set at 99.95% so team acts before customer-facing breach.',
    },
  ],
  tradeoffs: {
    advantages: ['Customer trust and sales enablement', 'Clear accountability', 'Drives reliability investment'],
    disadvantages: ['Financial exposure on breach', 'Legal complexity defining "up"', 'Pressure to game metrics'],
    alternatives: ['Best-effort terms of service', 'Internal SLOs only', 'Credits-only soft SLAs'],
    whenToUse: ['B2B SaaS', 'Cloud providers', 'Regulated industries'],
    whenNotToUse: ['Free tier with best-effort only — state explicitly'],
  },
  failureModes: [
    'SLA measured on wrong endpoint — misses real user pain',
    'No internal SLO buffer — SLA breach before team alerted',
    'Maintenance exclusion abused — too much downtime "planned"',
    'Multi-region SLA but only one region measured',
    'Credits cheaper than fixing root cause — moral hazard',
  ],
  production: {
    reliability: ['SLO buffer above SLA', 'Error budget policy gates releases'],
    observability: ['SLI dashboards with SLA line', 'Monthly SLA report automation'],
    maintainability: ['SLA definition versioned with product changes'],
    cost: ['Credit payouts vs infra investment tradeoff'],
    security: ['SLA scope excludes customer misconfiguration fairly'],
  },
  interview: {
    expectations: ['SLA vs SLO vs SLI', 'Uptime math', 'Credit tiers'],
    commonQuestions: ['99.9% downtime allowed per month?', 'How set internal target vs SLA?'],
    followUps: ['What excludes from SLA?', 'Multi-tenant SLA fairness?'],
    misconceptions: ['SLA equals SLO', 'Five nines easy to promise and deliver'],
    traps: ['Promise SLA without measuring SLI'],
    strongSignals: ['Internal SLO stricter', 'Clear exclusions', 'Error budget linkage'],
  },
  keyTakeaways: [
    'SLA = contractual customer promise with remedies.',
    'SLO internal target should be stricter than SLA for buffer.',
    'SLI = how you measure; define scope and exclusions carefully.',
    '99.9% ≈ 43 min downtime/month — know the math.',
    'Credits and legal terms make SLA real, not marketing.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'SLA vs SLO difference?', answerHint: 'SLA is external contract with credits; SLO is internal reliability target.' },
    { level: 'intermediate', question: 'Downtime budget for 99.9% monthly?', answerHint: 'About 43 minutes per month (30 × 24 × 60 × 0.001).' },
    { level: 'advanced', question: 'Design SLA for multi-region API?', answerHint: 'Define per-region vs global aggregate, excluded endpoints, maintenance windows, credit tiers, SLI on synthetic + real user probes.' },
  ],
  flashcards: [
    { front: 'SLA', back: 'External contractual service commitment with remedies' },
    { front: '99.9% monthly downtime', back: 'Approximately 43 minutes allowed' },
    { front: 'SLA buffer', back: 'Internal SLO stricter than external SLA' },
    { front: 'SLA exclusion', back: 'Planned maintenance, force majeure — defined in contract' },
  ],
  quickRevision: [
    'Contract + credits',
    'Stricter internal SLO',
    'Define scope',
    'Uptime math',
    'Error budget buffer',
  ],
}
