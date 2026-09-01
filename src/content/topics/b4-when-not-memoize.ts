import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '"When not to memoize" is the principle that React.memo, useMemo, and useCallback should not be applied by default — only after profiling shows measurable benefit, because memoization adds comparison overhead, dependency complexity, and stale-cache bugs when inputs are already unstable.',
  whyExists:
    'Cargo-cult memoization litters codebases with dep arrays and hides architectural issues (state too high, context bloat). React docs and team emphasize compiler direction and colocation over blanket memo — interviews test judgment not reflexive optimization.',
  mentalModel:
    'Default: no memo. Profile slow interaction. If child re-renders expensive with stable-enough props → React.memo + maybe useCallback. If compute expensive → useMemo. If props always new → fix architecture first. React Compiler may auto-memo later — manual where needed now.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'React.memo: skip if props shallow-equal — costs compare every parent render.',
        'useMemo: cache value — costs compare deps + memory.',
        'useCallback: cache fn — pointless if child not memoized.',
        'Unstable props (inline {}) every render → memo never hits.',
        'Colocate state / split tree often removes need entirely.',
      ],
    },
    {
      type: 'table',
      headers: ['Situation', 'Action'],
      rows: [
        ['Cheap child <1ms', 'Do not memo'],
        ['Parent re-render, child cheap', 'Colocate state first'],
        ['Inline object props always new', 'Fix parent not memo child'],
        ['Expensive sort 10k items', 'useMemo after profile'],
        ['Memo child + unstable callback', 'useCallback OR colocate'],
        ['Context updates all rows', 'Split context not memo 10k rows'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Premature memo smell',
      text: 'useCallback on every handler with no React.memo children — noise. useMemo on string template — waste.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Memo pointless — props always change',
      code: `// Parent passes new style object every render — Row memo useless
<Row item={item} style={{ color: 'red' }} />

// Fix: constant outside or CSS class — then memo helps if row expensive`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'React 19 Compiler analyzes and inserts memo automatically in some apps.',
        'Profiler baseDuration vs actualDuration shows memo skip benefit.',
        'Custom compare in React.memo rare — often masking unstable props.',
        'Virtualization beats memo for long lists.',
        'useTransition alternative for deferring heavy UI without memo.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Simpler code without spurious memo',
      'Forces architectural fixes (colocation)',
      'Avoids stale memo cache bugs',
    ],
    disadvantages: [
      'May miss legit hot paths without profiling discipline',
    ],
    alternatives: [
      'State colocation',
      'Component splitting',
      'useTransition',
      'List virtualization',
    ],
    whenToUse: [
      'Code review guidance',
      'Interview tradeoff discussions',
      'Refactoring over-memoized code',
    ],
    whenNotToUse: [
      'Dismissing memo when Profiler proves need',
    ],
  },
  failureModes: [
    'Memo every component — unreadable deps.',
    'useMemo with wrong deps — stale UI.',
    'Memo without fixing unstable props — zero bailout.',
    'Optimizing Strict Mode double renders.',
    'Memo instead of virtualizing 50k rows.',
  ],
  production: {
    performance: ['Profile → colocate → virtualize → memo last'],
    maintainability: ['Remove memo when refactor makes unnecessary'],
    observability: ['React Profiler commit times drive decisions'],
  },
  interview: {
    expectations: [
      'Memo not default',
      'Measure first',
      'Architectural fixes preferred',
    ],
    commonQuestions: [
      'When NOT use React.memo?',
      'useCallback always good?',
      'How decide to memoize?',
    ],
    followUps: [
      'React Compiler impact?',
      'Memo vs virtualization?',
    ],
    misconceptions: [
      'Senior devs memo everything',
      'useCallback makes handlers faster to run',
      'useMemo prevents re-renders',
    ],
    traps: ['Recommending blanket memo for performance question'],
    strongSignals: [
      'Profile first',
      'Colocate beats memo',
      'Stable props prerequisite',
      'Virtualize lists',
    ],
  },
  keyTakeaways: [
    'Do not memoize by default — profile first.',
    'Fix state placement and unstable props before memo.',
    'useCallback useless without memoized consumer.',
    'Cheap components — memo overhead not worth it.',
    'Virtualization for long lists beats row memo alone.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Should you React.memo every component?',
      answerHint: 'No — only when profiling shows expensive re-renders with stable props.',
    },
    {
      level: 'intermediate',
      question: 'Why useCallback without React.memo child is pointless?',
      answerHint: 'Child re-renders anyway; stable ref only matters if child skips render on prop equality.',
    },
    {
      level: 'advanced',
      question: 'Order of performance optimizations you’d try?',
      answerHint: 'Profile → network/bundle → colocate state → virtualize → transition → memo selectively.',
    },
  ],
  flashcards: [
    { front: 'When not memo', back: 'Cheap components; unstable props; before profiling' },
    { front: 'First perf fix', back: 'Colocate state — not memo' },
    { front: 'useCallback pointless when', back: 'Child not memoized or deps always change' },
  ],
  quickRevision: [
    'No default memo',
    'Profile first',
    'Colocate > memo',
    'Stable props needed',
    'Virtualize big lists',
    'Compiler may auto-memo',
  ],
}
