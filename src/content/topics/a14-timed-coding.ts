import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Timed coding is solving interview problems under fixed time—typically 35-45 minutes total including clarify, code, and test. Pace management ensures you deliver a working baseline before optimizing.',
  whyExists:
    'Real loops and onsite formats are time-boxed. Practicing under timer builds prioritization: clarify briefly, implement correct solution, optimize only if time remains.',
  mentalModel:
    'Sprint planning: 5 min clarify, 20 min working code, 10 min test/optimize, 5 min buffer—adjust per difficulty.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Easy target: 15-20 min working including test.',
        'Medium: 25-35 min; brute story then optimal.',
        'Hard: partial progress OK; communicate tradeoffs.',
        'Cut optimization if 10 min left and no working code.',
        'Practice with timer on NeetCode/CSES problems.',
      ],
    },
    {
      type: 'table',
      headers: ['Phase', 'Time budget (45 min)'],
      rows: [
        ['Clarify + plan', '5 min'],
        ['Implement', '25 min'],
        ['Manual test + fix', '10 min'],
        ['Optimize / follow-up', '5 min'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Medium problem: 5 min clarify, 25 min code, 10 min manual test—adjust if brute needed first.',
    },
  ],
  tradeoffs: {
    advantages: ['Builds real interview stamina', 'Forces prioritization', 'Reveals slow patterns to drill'],
    disadvantages: ['Stress without feedback', 'Timer anxiety early on'],
    alternatives: ['Untimed learn then timed review', 'Mock interviews with human'],
    whenToUse: ['Daily practice blocks', '2 weeks before onsite'],
    whenNotToUse: ['First exposure to new pattern—learn untimed first'],
  },
  failureModes: [
    'No working code at buzzer.',
    'Over-optimize with broken base.',
    'Skip testing under time pressure.',
  ],
  interview: {
    expectations: ['Working code prioritized', 'Time awareness signals', 'Communicate if switching to brute'],
    commonQuestions: ['Self-paced timed sets', 'Evaluate pacing'],
    followUps: ['What if 5 min left?', 'Skip hard follow-up?'],
    misconceptions: ['Speed equals memorization only', 'Timed practice only day before'],
    traps: ['Restart problem new approach at 30 min', 'Ignore interviewer time hint'],
    strongSignals: ['Checks clock aloud', 'Delivers correct then improves'],
  },
  keyTakeaways: [
    'Working correct beats incomplete optimal.',
    'Budget time: clarify, code, test, optimize.',
    'Practice timed sets on medium problems.',
    'At 10 min left, test not refactor.',
    'Hard problems: partial + clear communication OK.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '45 min medium problem time split?', answerHint: '~5 clarify, ~25 code, ~10 test, ~5 optimize.' },
    { level: 'intermediate', question: '10 minutes left no working code?', answerHint: 'Simplest correct approach even brute; test; verbalize optimization path.' },
    { level: 'advanced', question: 'How build timed stamina?', answerHint: 'Regular timed mediums; review mistakes untimed; mock interviews monthly.' },
  ],
  flashcards: [
    { front: 'Timed coding priority', back: 'Correct working solution before optimization.' },
    { front: 'Medium problem time target', back: 'Roughly 25-35 minutes total.' },
  ],
  quickRevision: [
    'Time-box phases',
    'Working code first',
    'Practice with timer',
    'Test before optimize',
    '10 min left → test',
    'Hard = partial OK',
    'Learn untimed then timed',
  ],
}
