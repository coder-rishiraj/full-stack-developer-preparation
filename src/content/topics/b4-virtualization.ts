import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'List virtualization (windowing) renders only visible rows plus a small overscan buffer in long lists — recycling DOM nodes as the user scrolls so ten thousand items do not create ten thousand DOM elements, keeping scroll and interaction performant.',
  whyExists:
    'Rendering 10k table rows crashes or janks browsers regardless of React.memo. Virtualization caps DOM node count to viewport size, enabling infinite feeds, large data grids, and log viewers in production.',
  mentalModel:
    'Total scroll height faked with spacer div. Visible slice computed from scrollTop. Only render items[start..end]. Libraries: react-window, @tanstack/react-virtual. Fixed row height simplifies math; variable height needs measurement cache.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Container with overflow scroll tracks scrollTop.',
        'Compute first/last visible index from row height and viewport height.',
        'Render only visible rows positioned absolutely or via transform.',
        'Top/bottom padding spacers represent off-screen item height sum.',
        'Overscan renders few extra rows above/below to reduce blank flash.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Virtual scroll viewport',
      diagram: `block-beta
  columns 1
  block:Top spacer["Off-screen items (height only)"]
  block:Viewport["Visible rows 20-35 rendered"]
  block:Bottom spacer["Off-screen items (height only)"]`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'When to virtualize',
      text: 'Lists > ~100-500 complex rows with perf issues. Not needed for 20 static items. Combine with pagination as product alternative.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'react-window FixedSizeList',
      code: `import { FixedSizeList as List } from 'react-window';

function VirtualList({ items }: { items: string[] }) {
  return (
    <List height={400} itemCount={items.length} itemSize={35} width="100%">
      {({ index, style }) => <div style={style}>{items[index]}</div>}
    </List>
  );
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'VariableSizeList caches measured heights per index.',
        'Horizontal virtualization same pattern for wide timelines.',
        'Grid virtualization combines row and column windowing.',
        'React keys on rows still use stable item ids inside virtualizer.',
        'SSR: render initial window or skeleton; hydrate scroll position carefully.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Constant DOM size regardless of list length',
      'Smooth scroll on huge datasets',
      'Lower memory and layout cost',
    ],
    disadvantages: [
      'Complexity: focus, keyboard nav, find-in-page',
      'Variable height rows harder',
      'Nested scroll containers tricky',
    ],
    alternatives: [
      'Pagination / infinite scroll loading chunks',
      'Canvas rendering for extreme density',
    ],
    whenToUse: [
      'Tables/lists with thousands of rows',
      'Chat logs, feeds, admin data grids',
    ],
    whenNotToUse: [
      'Short static lists',
      'SEO-critical full HTML list without SSR strategy',
    ],
  },
  failureModes: [
    'Virtualizing without fixed height container — zero visible rows.',
    'Wrong itemSize — scroll drift and misaligned rows.',
    'Accessibility: screen reader expects full list — use aria patterns.',
    'Memoizing rows but not virtualizing — still 10k components in memory if rendered.',
    'Search highlight across non-rendered rows requires separate index.',
  ],
  production: {
    performance: ['Overscan 3-5 rows; measure variable heights lazily'],
    reliability: ['Scroll restoration on navigation back'],
    maintainability: ['TanStack Virtual headless for custom markup'],
  },
  interview: {
    expectations: [
      'Why virtualize vs memo alone',
      'Fixed vs variable height',
      'Library awareness (react-window, tanstack)',
    ],
    commonQuestions: [
      'What is list virtualization?',
      '10k rows slow — fix?',
      'Virtualization vs pagination?',
    ],
    followUps: ['A11y challenges?', 'Variable row height approach?'],
    misconceptions: [
      'React.memo alone fixes 10k row list',
      'Virtualization removes need for keys',
      'Virtual lists work without scroll container height',
    ],
    traps: ['Only suggesting pagination when interviewer wants virtualization'],
    strongSignals: [
      'Render viewport window only',
      'Spacer height for scroll size',
      'DOM count constant',
    ],
  },
  keyTakeaways: [
    'Virtualization renders visible rows only plus overscan.',
    'Essential for thousands of list items performance.',
    'react-window / TanStack Virtual common solutions.',
    'Fixed height simple; variable needs measurement.',
    'Memo alone cannot fix massive list DOM cost.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why virtualize a long list?',
      answerHint: 'Limit DOM nodes to viewport — avoid rendering thousands of rows.',
    },
    {
      level: 'intermediate',
      question: 'Virtualization vs React.memo on each row?',
      answerHint: 'Memo reduces re-render work; virtualization reduces DOM count — need both often.',
    },
    {
      level: 'advanced',
      question: 'Variable height rows challenge?',
      answerHint: 'Measure and cache heights; recalc offsets on change; use VariableSizeList.',
    },
  ],
  flashcards: [
    { front: 'Virtualization', back: 'Render only visible window of large list' },
    { front: 'Overscan', back: 'Extra rows above/below viewport to reduce flicker' },
    { front: 'vs memo', back: 'Virtualization cuts DOM; memo cuts re-render work' },
  ],
  quickRevision: [
    'Viewport rows only',
    'Spacer for scroll height',
    'Fixed vs variable height',
    'react-window / TanStack',
    'Not for tiny lists',
    'A11y needs care',
  ],
}
