import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A controlled component is a form element whose value is owned by React state — the DOM input reflects state via value/checked props and reports changes through onChange, making React the single source of truth for the field value.',
  whyExists:
    'Uncontrolled inputs hold state in the DOM, complicating validation, conditional UI, and resetting forms. Controlled pattern enables instant validation, derived values, disabling submit until valid, and predictable testing from state alone.',
  mentalModel:
    'value={state} + onChange={e => setState(e.target.value)}. React drives what appears in the input; user typing flows through handler back to state then re-render. Empty string required for text inputs — undefined makes React warn about switching uncontrolled/controlled.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Initialize state with default value ("" for text, false for checkbox).',
        'Bind value/checked to state; onChange updates state immutably.',
        'Submit reads state object — no FormData required unless hybrid.',
        'Parent can reset by setState(initial) — DOM follows automatically.',
        'Select, textarea, checkbox, radio all support controlled mode.',
      ],
    },
    {
      type: 'table',
      headers: ['Element', 'Controlled props'],
      rows: [
        ['input text', 'value + onChange'],
        ['checkbox', 'checked + onChange'],
        ['radio group', 'checked on selected + shared name'],
        ['select', 'value + onChange'],
        ['textarea', 'value + onChange'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Controlled vs uncontrolled',
      text: 'Uncontrolled: defaultValue + ref.read DOM on submit. Controlled: live state. React Hook Form often uncontrolled internally with refs for perf.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Controlled text input with validation',
      code: `function EmailField() {
  const [email, setEmail] = useState('');
  const valid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);

  return (
    <>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={!valid && email.length > 0}
      />
      <button disabled={!valid}>Submit</button>
    </>
  );
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Lifting controlled state to parent',
      code: `function LoginForm({ onSubmit }: { onSubmit: (c: Credentials) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ email, password }); }}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </form>
  );
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Each keystroke → setState → re-render — fine for most forms; RHF reduces for large forms.',
        'value={undefined} then value="x" triggers controlled/uncontrolled warning.',
        'File inputs cannot be fully controlled (value read-only) — use uncontrolled ref.',
        'Custom controlled components: value + onChange prop contract like native inputs.',
        'Debouncing usually at handler or derived submit — not by making uncontrolled silently.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Instant validation and conditional UI',
      'Easy reset and programmatic set',
      'Testable from state without DOM',
    ],
    disadvantages: [
      'Re-render per keystroke on large trees',
      'More boilerplate than uncontrolled',
      'Must handle empty string defaults carefully',
    ],
    alternatives: [
      'Uncontrolled + ref for simple forms',
      'React Hook Form controlled/uncontrolled hybrid',
      'Form libraries (Formik)',
    ],
    whenToUse: [
      'Live validation, masked inputs, dependent fields',
      'Wizard with back navigation preserving values in state',
    ],
    whenNotToUse: [
      'File upload value control',
      'Huge form where perf measured as issue — consider RHF',
    ],
  },
  failureModes: [
    'Missing value prop — uncontrolled/controlled flip warnings.',
    'Mutating state object fields without new reference — no re-render.',
    'onChange forgotten — read-only input appears frozen.',
    'Checkbox using value instead of checked.',
    'Select with number value but option values string — mismatch.',
  ],
  production: {
    performance: ['Isolate input state in leaf component; debounce expensive validation'],
    reliability: ['Controlled defaults always defined; reset keys on form remount'],
    maintainability: ['Extract reusable controlled Input wrapper with label/errors'],
  },
  interview: {
    expectations: [
      'value + onChange pattern',
      'Controlled vs uncontrolled tradeoffs',
      'Single source of truth in React state',
    ],
    commonQuestions: [
      'What is a controlled component?',
      'Controlled vs uncontrolled?',
      'Why warning about uncontrolled to controlled?',
    ],
    followUps: [
      'File input controlled?',
      'React Hook Form approach?',
    ],
    misconceptions: [
      'All inputs must be controlled always',
      'defaultValue works with controlled value simultaneously',
      'onChange optional if using value',
    ],
    traps: ['Saying controlled means better performance'],
    strongSignals: [
      'React state owns value',
      'Empty string default for text',
      'File input exception',
    ],
  },
  keyTakeaways: [
    'Controlled: value/checked from state, updates via onChange.',
    'React is single source of truth for field value.',
    'Enables live validation and programmatic reset.',
    'Always define value ("" not undefined) for text inputs.',
    'Uncontrolled/ref or RHF when perf or file inputs need it.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What makes an input controlled?',
      answerHint: 'value/checked bound to React state; onChange updates that state.',
    },
    {
      level: 'intermediate',
      question: 'Controlled vs uncontrolled — when pick each?',
      answerHint: 'Controlled for live validation/sync state; uncontrolled simpler or RHF perf for large forms.',
    },
    {
      level: 'advanced',
      question: 'Why can’t file inputs be fully controlled?',
      answerHint: 'Security — browser doesn’t allow setting input.files from JS; read-only value.',
    },
  ],
  flashcards: [
    { front: 'Controlled input', back: 'value + onChange tied to React state' },
    { front: 'Default for text value', back: 'Empty string — not undefined' },
    { front: 'Checkbox controlled prop', back: 'checked not value' },
  ],
  quickRevision: [
    'value/checked from state',
    'onChange updates state',
    'Single source of truth',
    '"" default for text',
    'File input — uncontrolled',
    'vs uncontrolled: ref/defaultValue',
  ],
}
