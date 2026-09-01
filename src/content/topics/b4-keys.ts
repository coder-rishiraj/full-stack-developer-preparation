import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Keys are special string/number props React uses during reconciliation to match elements in a list across renders — they tell React which item identity persisted, moved, or was added/removed so DOM state and component state attach to the correct instance.',
  whyExists:
    'Without stable keys, reordering or filtering a list causes React to reuse the wrong component instances — input focus, animation state, and internal state leak between rows. Keys optimize diffing from O(n²) identity matching toward efficient reuse.',
  mentalModel:
    'Keys are identity, not style. Use stable unique id from data (user.id), never array index when list can reorder/filter. key on outermost element in map. Changing key remounts component — useful for reset-on-prop-change.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'React builds a map of key → fiber child during reconciliation.',
        'Same key + same type → update in place (preserve state/DOM where possible).',
        'New key → mount new instance; missing key → unmount old.',
        'key and ref are not passed as props to component.',
        'Fragments can take keys: <React.Fragment key={id}>.',
      ],
    },
    {
      type: 'table',
      headers: ['Key choice', 'Result'],
      rows: [
        ['Stable id from server', 'Correct state on reorder'],
        ['Array index', 'Wrong state if items inserted/deleted/reordered'],
        ['Random Math.random()', 'Remount every render — perf disaster'],
        ['key={userId} on wrapper', 'Resets child when userId changes'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Index as key',
      text: 'Acceptable only for static lists that never reorder (read-only icons). Any drag-drop, filter, or prepend → use entity id.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Correct list keys',
      code: `{todos.map(todo => (
  <TodoItem key={todo.id} todo={todo} />
))}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Reset form when userId changes via key',
      code: `function ProfileEditor({ userId }: { userId: string }) {
  return <UserForm key={userId} userId={userId} />;
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Index key bug demonstration',
      code: `// Reorder [A,B,C] → delete A → B keeps A's input state wrongly
{items.map((item, i) => <input key={i} defaultValue={item.label} />)}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Reconciliation compares children by key + element type (same div vs li matters).',
        'Keys only need be unique among siblings, not globally.',
        'key change forces unmount/remount — all useState/useEffect reset.',
        'Concurrent rendering preserves key matching semantics across interruptions.',
        'React DevTools "Highlight updates" shows remounts from bad keys.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Correct state preservation on list mutations',
      'Efficient DOM reuse on reorder',
      'key prop trick for controlled remount/reset',
    ],
    disadvantages: [
      'Wrong keys cause subtle state bugs',
      'Over-remounting with unstable keys hurts perf',
      'Requires stable ids in data model',
    ],
    alternatives: [
      'Single keyed container remount instead of per-row wrong keys',
      'Controlled reset via useEffect when id changes (prefer key)',
    ],
    whenToUse: [
      'Any dynamic list from map()',
      'Resetting subtree when route/param changes',
    ],
    whenNotToUse: [
      'Static two-item layout without map',
      'Index keys on mutable ordered lists',
    ],
  },
  failureModes: [
    'Index keys on sortable table — wrong row data after sort.',
    'Math.random() keys — inputs lose focus every render.',
    'Duplicate keys among siblings — undefined reconciliation behavior.',
    'Key on inner element instead of mapped root — still works but confusing.',
    'Using key where should use id prop — conflating identity with data.',
  ],
  production: {
    performance: ['Stable keys avoid unnecessary unmount/remount cycles'],
    reliability: ['Enforce unique ids at API layer for list entities'],
    maintainability: ['Lint: no-array-index-key in eslint-plugin-react'],
  },
  interview: {
    expectations: [
      'Purpose of keys in reconciliation',
      'Why index keys fail on reorder',
      'key as remount reset pattern',
    ],
    commonQuestions: [
      'Why not use index as key?',
      'What happens when key changes?',
      'Are keys passed to component props?',
    ],
    followUps: [
      'How keys interact with React.memo?',
      'Fragment keys use case?',
    ],
    misconceptions: [
      'Keys are for CSS animation only',
      'Keys must be globally unique in app',
      'key and id HTML attribute are the same thing',
    ],
    traps: ['Saying index is always fine for small lists'],
    strongSignals: [
      'Stable entity id from data',
      'key change = remount',
      'Not passed as props',
    ],
  },
  keyTakeaways: [
    'Keys identify list items across renders for reconciliation.',
    'Use stable unique ids, not index when list mutates.',
    'Changing key remounts component — reset pattern.',
    'Keys are not forwarded as props.',
    'Duplicate sibling keys break reconciliation.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why does React need keys in lists?',
      answerHint: 'Match elements across renders for correct reuse and state preservation.',
    },
    {
      level: 'intermediate',
      question: 'When is array index acceptable as key?',
      answerHint: 'Static, never reordered/filtered lists only — usually avoid in interviews.',
    },
    {
      level: 'advanced',
      question: 'How use key to reset component state when userId changes?',
      answerHint: 'key={userId} on child forces unmount/remount with fresh state.',
    },
  ],
  flashcards: [
    { front: 'Purpose of key', back: 'Stable identity for reconciliation in sibling lists' },
    { front: 'Index as key problem', back: 'Reorder/delete causes wrong state reuse' },
    { front: 'Key change effect', back: 'Unmount old instance, mount new — state reset' },
  ],
  quickRevision: [
    'Stable id from data',
    'Not array index if mutable',
    'Unique among siblings',
    'Not passed as props',
    'key change = remount',
    'Fragment can have key',
  ],
}
