import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'State placement is the architectural decision of where to store a piece of state in the component tree — colocating with consumers that need it, lifting only to the lowest common ancestor, or extracting to URL/context/store when distant siblings or persistence require it.',
  whyExists:
    'Misplaced state causes wide re-render fan-out, prop drilling, duplicated sources of truth, and hard-to-trace bugs. Correct placement minimizes render scope while keeping data flow understandable.',
  mentalModel:
    'Find who reads and who writes. Put state as low as possible while still reaching all readers. If only one branch needs it, don’t lift to root. Derived state stays computed not stored. Server data lives in query cache not random ancestor useState.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Identify state consumers — leaf components vs distant siblings.',
        'Colocate: keep in leaf if no sibling/parent needs it.',
        'Lift one level at a time to lowest shared parent.',
        'Split components so state sits in smaller subtree (wrapper pattern).',
        'Promote to URL/context/store only when tree distance or persistence demands.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Lift decision',
      diagram: `flowchart TD
  Q[Who needs this state?] --> A[One leaf only]
  A --> C[Colocate in leaf]
  Q --> B[Two siblings]
  B --> D[Lift to parent]
  Q --> E[Distant branches]
  E --> F[Context / store / URL]`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Wrapper colocation',
      text: 'Extract <SearchResults query={q} /> wrapper holding query state above results list but below page shell — limits re-render blast radius.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Colocate vs lift',
      code: `// Bad: page holds hover state for one card — whole page re-renders
function Page() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return items.map(i => <Card key={i.id} hovered={hoveredId === i.id} onHover={setHoveredId} />);
}

// Better: hover state inside Card
function Card({ item }: { item: Item }) {
  const [hovered, setHovered] = useState(false);
  return <div onMouseEnter={() => setHovered(true)}>...</div>;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Re-render propagates down — state high in tree affects large subtrees.',
        'Composition: pass JSX slots so parent doesn’t hold child UI state.',
        'Controlled vs uncontrolled placement affects who owns form state.',
        'Feature folders often colocate state in feature root not app root.',
        'React Query colocates server state at fetch site with queryKey scoping.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Minimal re-render scope',
      'Clear ownership per feature',
      'Easier testing of isolated state',
    ],
    disadvantages: [
      'Too low — prop drilling if requirements change',
      'Too high — performance and coupling pain',
      'Refactoring placement touches many files',
    ],
    alternatives: [
      'Component composition to avoid premature lift',
      'Custom hook extracting logic while state stays colocated',
    ],
    whenToUse: [
      'Designing forms, filters, wizards, dashboards',
      'Perf tuning unnecessary parent re-renders',
    ],
    whenNotToUse: [
      'Lift everything to Redux preemptively',
    ],
  },
  failureModes: [
    'App root holds all modal and hover state.',
    'Duplicate filter state in URL and useState out of sync.',
    'Lift state for one sibling forces unrelated branches to re-render.',
    'Store derived values (filteredList) instead of computing from filter + data.',
    'Fetch at root when only leaf needs data — over-fetch and rerender.',
  ],
  production: {
    performance: ['Profile then colocate or split providers'],
    maintainability: ['Feature-scoped state modules'],
    reliability: ['Single source of truth per fact — one placement only'],
  },
  interview: {
    expectations: [
      'Colocate by default, lift when needed',
      'Wrapper pattern for limiting scope',
      'Relation to unnecessary re-renders',
    ],
    commonQuestions: [
      'How decide where to put state?',
      'What is colocation?',
      'When lift state up?',
    ],
    followUps: [
      'Prop drilling alternatives without global store?',
      'URL vs useState for filters?',
    ],
    misconceptions: [
      'Always lift as high as possible for flexibility',
      'Global store fixes all placement issues',
      'Child always needs parent to own its UI state',
    ],
    traps: ['Suggesting Redux instead of colocation/wrapper fix'],
    strongSignals: [
      'Lowest common ancestor rule',
      'Colocate until proven insufficient',
      'Split trees to shrink render scope',
    ],
  },
  keyTakeaways: [
    'Place state as close as possible to where it is used.',
    'Lift only to lowest common ancestor of all consumers.',
    'Wrapper components isolate state and re-renders.',
    'Don’t store what you can derive during render.',
    'Server state placement follows fetch/cache boundaries.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does colocating state mean?',
      answerHint: 'Keep state in the component (or small subtree) that uses it.',
    },
    {
      level: 'intermediate',
      question: 'Two siblings need same filter — where state?',
      answerHint: 'Lift to their shared parent; not higher unless more consumers appear.',
    },
    {
      level: 'advanced',
      question: 'How reduce re-renders without global store?',
      answerHint: 'Move state down, split context, memo children, wrapper colocation.',
    },
  ],
  flashcards: [
    { front: 'State placement rule', back: 'As low as possible; lift to LCA when shared' },
    { front: 'Colocation benefit', back: 'Smaller re-render subtree' },
    { front: 'Wrapper pattern', back: 'Subcomponent owns state wrapping heavy children' },
  ],
  quickRevision: [
    'Colocate first',
    'Lift to LCA',
    'Don’t store derived',
    'Wrapper limits rerenders',
    'URL for shareable',
    'Query cache for server',
  ],
}
