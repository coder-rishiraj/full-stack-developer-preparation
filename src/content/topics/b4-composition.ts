import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Composition in React builds complex UIs by nesting components and passing children or render props — favoring flexible assembly of behavior and layout over deep inheritance hierarchies or monolithic prop APIs.',
  whyExists:
    'Inheritance couples subclasses to base implementations and explodes prop drilling through config objects. Composition lets consumers inject markup, swap implementations, and reuse logic via hooks without fragile class trees.',
  mentalModel:
    'Think LEGO: small pieces snap together. children slot arbitrary content; render props expose state to caller; compound components share implicit context. Prefer “has-a” over “is-a”.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'children prop: wrap arbitrary JSX inside container components.',
        'Render props: prop is function (state) => JSX for inversion of control.',
        'Compound components: Tabs + Tabs.List + Tabs.Panel share context.',
        'Hooks extract shared logic; components remain thin shells.',
        'Controlling vs uncontrolled split via composition of input + state owner.',
      ],
    },
    {
      type: 'table',
      headers: ['Pattern', 'When'],
      rows: [
        ['children', 'Layout shells, Card, Modal body'],
        ['Render prop', 'List virtualization needing row renderer'],
        ['Compound components', 'Tabs, Select, Accordion APIs'],
        ['Custom hooks', 'Shared fetch/form logic without UI coupling'],
        ['HOC (legacy)', 'Cross-cutting before hooks — prefer hooks now'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Avoid prop explosion',
      text: 'Instead of headerFooterLeftRightIconTitleVariant props, compose: <Card><Card.Header /><Card.Body /></Card>.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'children composition',
      code: `function Dialog({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div role="dialog">
      <button onClick={onClose}>×</button>
      {children}
    </div>
  );
}

<Dialog onClose={close}>
  <h2>Confirm</h2>
  <p>Delete this item?</p>
</Dialog>`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Compound component with context',
      code: `const TabsContext = createContext<{ active: string; setActive: (id: string) => void } | null>(null);

function Tabs({ children, defaultId }: { children: React.ReactNode; defaultId: string }) {
  const [active, setActive] = useState(defaultId);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}
Tabs.Tab = function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!;
  return <button aria-selected={ctx.active === id} onClick={() => ctx.setActive(id)}>{children}</button>;
};`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'React.Children utilities rarely needed — prefer explicit children.',
        'Slot patterns (Radix, shadcn) combine composition + accessibility.',
        'forwardRef passes refs through composition layers to DOM.',
        'Server Components compose across server/client boundary with import rules.',
        'Context is composition glue — avoid deep provider nesting without need.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Flexible APIs without boolean prop matrices',
      'Reuse layout and behavior independently',
      'Easier testing of pieces in isolation',
    ],
    disadvantages: [
      'Compound APIs need documentation',
      'Deep trees if over-componentized',
      'Context re-renders all consumers on value change',
    ],
    alternatives: [
      'Configuration props for simple variants only',
      'HOCs (older pattern)',
      'Renderless components + hooks',
    ],
    whenToUse: [
      'Design systems, modals, layouts, data tables',
      'When consumers need custom inner content',
    ],
    whenNotToUse: [
      'Single fixed layout with no variation',
      'Replacing one prop with ten wrapper components',
    ],
  },
  failureModes: [
    'Provider value object recreated each render → all consumers re-render.',
    'Compound component used outside Provider — null context crash.',
    'children as array without key when mapping dynamic lists inside.',
    'Over-using render props where simple children suffices.',
  ],
  production: {
    performance: ['Memoize context value with useMemo when stable deps'],
    maintainability: ['Document compound component usage; Storybook examples'],
  },
  interview: {
    expectations: [
      'Composition vs inheritance in React',
      'children and render props',
      'Compound component pattern',
    ],
    commonQuestions: [
      'How do you share logic between components?',
      'Composition vs HOC?',
      'What are compound components?',
    ],
    followUps: [
      'When use context vs composition?',
      'Custom hooks vs render props?',
    ],
    misconceptions: [
      'Inheritance is idiomatic in React (prefer composition)',
      'children must be single element (can be array, fragment, null)',
    ],
    traps: ['Recommending HOC as first choice over hooks'],
    strongSignals: [
      'Hooks for logic, composition for structure',
      'children slot pattern',
      'Avoid prop drilling via composition not global store by default',
    ],
  },
  keyTakeaways: [
    'Build UIs by composing components, not extending classes.',
    'children passes arbitrary JSX into containers.',
    'Custom hooks share logic; compound components share structure API.',
    'Prefer small composable pieces over mega-config props.',
    'Context connects compound subcomponents implicitly.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is composition in React?',
      answerHint: 'Nest components and pass children/slots to build complex UI from simple parts.',
    },
    {
      level: 'intermediate',
      question: 'Composition vs inheritance for React?',
      answerHint: 'React team favors composition; inheritance fragile for UI reuse — use hooks + children.',
    },
    {
      level: 'advanced',
      question: 'Compound component pattern example?',
      answerHint: 'Tabs with TabList/Tab/Panel sharing context — flexible API without prop explosion.',
    },
  ],
  flashcards: [
    { front: 'Composition', back: 'Nest components; children slot pattern' },
    { front: 'Render prop', back: 'Function prop returns JSX from component state' },
    { front: 'vs inheritance', back: 'React prefers compose/hooks over class extends' },
  ],
  quickRevision: [
    'Compose don’t inherit',
    'children for slots',
    'Hooks for shared logic',
    'Compound + context',
    'Avoid prop explosion',
    'HOCs legacy — hooks preferred',
  ],
}
