import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Reconciliation is React’s diffing algorithm that compares the new element tree from render with the previous fiber tree to determine minimal DOM updates — deciding which nodes to create, update, reuse, move, or delete while preserving component state when type and key match.',
  whyExists:
    'Full DOM rebuild on every state change would destroy focus, scroll, and performance. Reconciliation maps declarative UI descriptions to efficient imperative DOM mutations by reusing instances where identity matches.',
  mentalModel:
    'Render produces element tree (lightweight descriptors). Reconciler walks children comparing type + key. Same type + key → update props/state on existing fiber. Different type → unmount old, mount new. Keys identify list items. Two-pass: render (pure) then commit (DOM writes).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Trigger: setState, context change, parent re-render schedules update.',
        'Render phase: call component functions, build new React elements (virtual tree).',
        'Diff children: single pass with key map for lists.',
        'Mark effects, DOM mutations needed on fibers.',
        'Commit phase: apply DOM updates, run layout effects, paint, passive effects.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Reconciliation decision',
      diagram: `flowchart TD
  A[New element vs old fiber] --> B{Same type?}
  B -->|No| C[Unmount old, mount new]
  B -->|Yes| D{Same key?}
  D -->|No| C
  D -->|Yes| E[Update props, reconcile children]`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Element type matters',
      text: 'Changing div to span unmounts entire subtree even with same key. Conditional rendering swapping ComponentA ↔ ComponentB resets state.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Type change remounts',
      code: `{loggedIn ? <Dashboard key="dash" /> : <Login key="login" />}
// Switching toggles unmount one, mount other — state reset`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'List reconciliation with keys',
      code: `// React matches by key across renders
<ul>
  {items.map(item => <li key={item.id}>{item.label}</li>)}
</ul>`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Fiber: linked node with child/sibling/return pointers enabling incremental work.',
        'Bailout: memo/pure components skip subtree if props unchanged.',
        'Concurrent: render work splittable; commit is synchronous for DOM consistency.',
        'Legacy stack reconciler replaced by fiber for interruptibility.',
        'Host components (div) vs composite (function) different fiber tags.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Minimal DOM operations',
      'Preserves state when identity matches',
      'Declarative UI without manual DOM diff',
    ],
    disadvantages: [
      'Heuristic diff — not minimal edit distance globally',
      'Wrong keys cause incorrect reuse',
      'Large tree still costs render even if DOM change small',
    ],
    alternatives: [
      'Direct DOM manipulation (escape hatch refs)',
      'Signals-based libraries with finer-grained updates',
    ],
    whenToUse: [
      'Understanding any React update behavior',
      'Debugging state preservation bugs',
    ],
    whenNotToUse: [
      'Assuming reconciliation equals virtual DOM diff only — fibers add scheduling',
    ],
  },
  failureModes: [
    'Index keys on reorderable list — wrong DOM node reuse.',
    'Conditional component type flip — unexpected state loss.',
    'Same key on different types — React warns, odd behavior.',
    'Assuming parent re-render always touches DOM — may bail out.',
    'Mutating DOM outside React confuses next reconciliation.',
  ],
  production: {
    performance: ['Stable keys; memo to skip subtree reconciliation work'],
    reliability: ['key={id} for dynamic lists from API'],
    maintainability: ['Predict remount boundaries when changing component types'],
  },
  interview: {
    expectations: [
      'Reconciliation vs virtual DOM terminology',
      'Role of keys and element type',
      'Render vs commit phases',
    ],
    commonQuestions: [
      'How React knows what DOM to update?',
      'What happens when key changes?',
      'Difference reconciliation and rendering?',
    ],
    followUps: [
      'Fiber architecture purpose?',
      'React diff O(n) heuristic?',
    ],
    misconceptions: [
      'React diffs real DOM directly each time',
      'Virtual DOM always faster than direct DOM',
      'Reconciliation runs on every parent render for all descendants always',
    ],
    traps: ['Describing full O(n³) diff — React uses heuristics O(n)'],
    strongSignals: [
      'Type + key determine reuse',
      'Render pure, commit mutates DOM',
      'Keys for list identity',
    ],
  },
  keyTakeaways: [
    'Reconciliation diffs element trees to plan DOM updates.',
    'Same type + key → update in place; else remount.',
    'Render phase pure; commit applies DOM changes.',
    'Keys critical for list identity across renders.',
    'Fiber enables incremental and concurrent reconciliation.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is React reconciliation?',
      answerHint: 'Algorithm comparing new element tree to fiber tree to compute minimal DOM updates.',
    },
    {
      level: 'intermediate',
      question: 'When does React unmount and remount vs update?',
      answerHint: 'Different element type or key → remount; same type+key → update props/state.',
    },
    {
      level: 'advanced',
      question: 'Render phase vs commit phase?',
      answerHint: 'Render builds work-in-progress tree (pure, may discard); commit applies DOM/effects synchronously.',
    },
  ],
  flashcards: [
    { front: 'Reconciliation', back: 'Diff element tree vs fibers → DOM mutation plan' },
    { front: 'Reuse condition', back: 'Same element type and same key' },
    { front: 'Render vs commit', back: 'Render compute; commit apply DOM + effects' },
  ],
  quickRevision: [
    'Diff new vs old tree',
    'Type + key = reuse',
    'Keys for lists',
    'Render then commit',
    'Fiber incremental work',
    'Wrong key = wrong state',
  ],
}
