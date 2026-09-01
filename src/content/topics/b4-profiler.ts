import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The React Profiler is a DevTools and programmatic API (Profiler component, React DevTools Profiler tab) that measures component render times, commit frequency, and why components rendered — the primary tool for identifying unnecessary re-renders and slow subtrees before applying memoization or architectural fixes.',
  whyExists:
    'Performance problems in React are invisible in console.log. Profiler provides flamegraphs of render duration and "why did this render" context (props/state/context/hooks changed) so engineers fix root causes instead of blindly adding React.memo everywhere.',
  mentalModel:
    'Record interaction → inspect commits → find slow or frequent components → check why rendered → fix (colocate state, memo, virtualize, defer). Profiler adds overhead — use in dev. Production: useInteractionObserver, web vitals, and sampled RUM not full Profiler.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'React DevTools Profiler tab: record, perform action, stop — see commit list.',
        'Flame chart: width = time spent; yellow/red = slow renders.',
        'Ranked chart: components sorted by render time per commit.',
        'Profiler React component wraps subtree with id and onRender callback for CI benchmarks.',
        ' "Why did this render?" (DevTools) shows changed props/state/hooks.',
      ],
    },
    {
      type: 'table',
      headers: ['Signal', 'Likely fix'],
      rows: [
        ['Parent re-renders whole list', 'Colocate state or React.memo rows'],
        ['Context provider value new object', 'Split context or memoize value'],
        ['Expensive render every keystroke', 'useTransition or defer child'],
        ['Mount cost huge', 'Lazy load or reduce initial tree'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Workflow',
      text: '1) Reproduce slowness 2) Profile one interaction 3) Fix biggest bar 4) Re-profile — repeat. One commit at a time.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Programmatic Profiler',
      code: `<Profiler id="Checkout" onRender={onRenderCallback}>
  <CheckoutFlow />
</Profiler>

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
) {
  if (actualDuration > 16) {
    console.warn(\`\${id} \${phase} took \${actualDuration}ms\`);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'actualDuration: time in this commit; baseDuration: estimated without memo.',
        'Profiler only measures React render phase in wrapped subtree — not browser layout/paint.',
        'Production builds support Profiler but overhead discourages always-on.',
        'Strict Mode double render shows higher counts in dev — compare relative not absolute.',
        'Third-party: why-did-you-render, React Scan for enhanced render reasons.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Visual identification of hot components',
      'Render reason debugging',
      'Before/after verification of optimizations',
    ],
    disadvantages: [
      'Dev-only overhead skews timings slightly',
      'Does not profile layout/paint/network',
      'Large trees produce noisy flamegraphs',
    ],
    alternatives: [
      'Performance panel Long Tasks',
      'React Scan / WDYR plugins',
      'User Timing API marks around interactions',
    ],
    whenToUse: [
      'Suspected unnecessary re-renders',
      'Validating memo/virtualization impact',
    ],
    whenNotToUse: [
      'First step before reproducing slowness',
      'Production continuous profiling at 100%',
    ],
  },
  failureModes: [
    'Optimizing dev Strict Mode double renders as production issue.',
    'Memoizing without profiling — no measurable win.',
    'Ignoring layout thrash — React fast but DOM slow.',
    'Profiling initial mount only — miss update path bugs.',
    'Chasing sub-1ms renders while network is bottleneck.',
  ],
  production: {
    performance: ['Fix network and bundle before micro-optimizing renders'],
    observability: ['Web Vitals LCP/INP; sampled interaction timing in RUM'],
    maintainability: ['Add Profiler wrapper in perf test harness not prod bundle'],
  },
  interview: {
    expectations: [
      'How use React DevTools Profiler',
      'Interpret flamegraph / ranked chart',
      'Profiler vs browser Performance tab',
    ],
    commonQuestions: [
      'How find unnecessary re-renders?',
      'What does React.memo show in Profiler?',
      'Profiler production safe?',
    ],
    followUps: [
      'INP and React renders?',
      'Colocate state vs memo from profile data?',
    ],
    misconceptions: [
      'Profiler shows full page performance including network',
      'Fast React render guarantees smooth UX',
      'Yellow in flamegraph always means fix with memo',
    ],
    traps: ['Suggesting console.time instead of structured profiling workflow'],
    strongSignals: [
      'Measure before optimize',
      'Check why rendered',
      'Colocate state often beats memo',
    ],
  },
  keyTakeaways: [
    'Profiler measures render commit time and frequency.',
    'Flame/ranked charts find slow components.',
    'Check why component rendered before memoizing.',
    'DevTools Profiler tab is primary UI tool.',
    'Combine with Network and Performance panels.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does React Profiler measure?',
      answerHint: 'Component render duration and commit phases in wrapped subtree.',
    },
    {
      level: 'intermediate',
      question: 'Workflow to fix slow list re-rendering on every keystroke?',
      answerHint: 'Profile keystroke commit, see list in flamegraph, colocate/defer/memo/virtualize based on cause.',
    },
    {
      level: 'advanced',
      question: 'Limitations of React Profiler?',
      answerHint: 'Render phase only; not layout/paint/network; overhead; dev-centric.',
    },
  ],
  flashcards: [
    { front: 'Profiler flame chart', back: 'Width = render time per component in commit' },
    { front: 'actualDuration', back: 'Time spent rendering in this commit' },
    { front: 'First perf step', back: 'Profile interaction before adding memo' },
  ],
  quickRevision: [
    'DevTools Profiler tab',
    'Record → interact → analyze',
    'Flame + ranked charts',
    'Why did this render?',
    'Measure before memo',
    'Not network/layout',
  ],
}
