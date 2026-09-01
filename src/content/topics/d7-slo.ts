import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A Service Level Objective (SLO) is an internal reliability target for an SLI — e.g. 99.9% of checkout requests succeed within 5s over 30 days. SLOs define error budgets: allowed unreliability before engineering must prioritize fixes over features.',
  whyExists:
    'Without targets, teams debate whether 99.5% is "good enough" ad hoc. SLOs quantify acceptable failure, enable data-driven release decisions, and connect product velocity to user impact via error budget policy.',
  mentalModel:
    'Monthly allowance of mistakes. 99.9% SLO = 0.1% error budget. Spend budget on risky launches carefully; when budget burns fast, freeze features and fix reliability. SLO stricter than customer SLA gives safety margin.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Meaning', 'Action'],
      rows: [
        ['SLO target', 'Desired SLI level e.g. 99.95%', 'Set per critical user journey'],
        ['Error budget', '100% − SLO = allowed bad events', 'Track burn rate'],
        ['Burn rate alert', 'Budget consumed faster than sustainable', 'Page on-call early'],
        ['Budget exhausted', 'SLO at risk for window', 'Freeze releases, fix reliability'],
        ['Multi-window', '1h + 6h + 3d burn policies', 'Catch fast and slow burns'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Error budget policy',
      diagram: `flowchart TB
  SLO[SLO 99.9%] --> Budget[0.1% error budget]
  Budget --> OK[Budget healthy → ship features]
  Budget --> Burn[Fast burn → alert]
  Burn --> Freeze[Budget low → reliability sprint]`,
    },
    {
      type: 'list',
      items: [
        'Pick few critical SLOs — not every endpoint',
        'Rolling 30-day window common for availability',
        'Error budget policy: who decides freeze, exceptions for security',
        'Review SLO quarterly — too easy (100% always) or impossible (always red)',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Search SLO: 99.5% of queries return results in < 500ms p99 over 28 days. Error budget 0.5%. Fast burn alert: consume 2% of monthly budget in 1 hour → page. Team shipped ranking experiment; latency burn spiked → rolled back via flag before SLA breach.',
    },
  ],
  tradeoffs: {
    advantages: ['Objective release gate', 'Aligns eng and product on risk', 'Prioritizes user-visible reliability'],
    disadvantages: ['SLO theater if targets unenforced', 'Wrong SLO misallocates effort', 'Cultural resistance to freeze'],
    alternatives: ['Hero culture firefighting without budgets'],
    whenToUse: ['Mature production services', 'Teams shipping frequently'],
    whenNotToUse: ['Pre-launch with no baseline — set after initial data'],
  },
  failureModes: [
    'SLO too loose — never triggers action',
    'SLO too tight — team ignores as noise',
    'Many SLOs — alert fatigue',
    'No error budget policy — SLO is dashboard decoration',
    'SLO on infra metric not user journey',
  ],
  production: {
    reliability: ['Multi-burn-rate alerts', 'Error budget reports in sprint planning'],
    observability: ['SLO dashboards per journey', 'Budget remaining gauge'],
    maintainability: ['SLO catalog in repo', 'Postmortem links to budget burn'],
    scalability: ['SLO applies after scale events — revisit targets'],
    cost: ['Reliability investment when budget tight vs credit cost'],
  },
  interview: {
    expectations: ['SLO vs SLA vs SLI', 'Error budget', 'Burn rate alerting'],
    commonQuestions: ['Define SLO for payment?', 'Error budget exhausted — what now?'],
    followUps: ['Multi-window alerts?', 'Too many SLOs problem?'],
    misconceptions: ['100% SLO is goal', 'SLO equals monitoring alert threshold only'],
    traps: ['SLO with no enforcement policy'],
    strongSignals: ['Error budget freeze policy', 'Burn rate pages', 'Few user-journey SLOs'],
  },
  keyTakeaways: [
    'SLO = internal target level for an SLI.',
    'Error budget = allowed unreliability (100% − SLO).',
    'Fast/slow burn alerts catch budget consumption early.',
    'Budget exhausted → prioritize reliability over features.',
    'Keep SLO stricter than external SLA for buffer.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Error budget for 99.9% SLO?', answerHint: '0.1% of valid events can fail in the measurement window.' },
    { level: 'intermediate', question: 'Burn rate alert purpose?', answerHint: 'Detect budget consumed too fast before window ends — early warning to fix or rollback.' },
    { level: 'advanced', question: 'Product wants launch despite SLO risk?', answerHint: 'Explicit error budget spend decision, rollback plan, feature flag, post-launch SLO review — policy not heroics.' },
  ],
  flashcards: [
    { front: 'SLO', back: 'Internal target level for an SLI' },
    { front: 'Error budget', back: '100% minus SLO — allowed bad events in window' },
    { front: 'Burn rate', back: 'Speed of error budget consumption' },
    { front: 'SLO freeze policy', back: 'Stop risky releases when budget exhausted' },
  ],
  quickRevision: [
    'SLO target',
    'Error budget',
    'Burn alerts',
    'Freeze policy',
    'Few critical journeys',
  ],
}
