import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Uncontrolled components let the DOM own form input state — React sets initial defaultValue/defaultChecked and reads current values via refs on submit, rather than controlling every keystroke through value + onChange state updates.',
  whyExists:
    'Not every input needs live React state. Uncontrolled reduces re-renders on large forms, integrates with native FormData, and matches browser autofill behavior. Libraries like React Hook Form use refs internally for performance while keeping validation ergonomics.',
  mentalModel:
    'defaultValue not value. ref.current.value on submit. React does not re-render on each keystroke. Switching to value prop later requires controlled migration. File inputs are always effectively uncontrolled.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Use defaultValue / defaultChecked for initial DOM state.',
        'Create ref with useRef attached to input element.',
        'Read ref.current.value in submit handler or button click.',
        'Reset via ref or form.reset() — not setState.',
        'Hybrid: controlled for some fields, uncontrolled for others in same form.',
      ],
    },
    {
      type: 'table',
      headers: ['Aspect', 'Uncontrolled', 'Controlled'],
      rows: [
        ['Value source', 'DOM', 'React state'],
        ['Updates', 'Native input events', 'setState each change'],
        ['Live validation', 'Harder — need listeners', 'Easy from state'],
        ['Reset', 'form.reset() / remount key', 'setState(initial)'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'React Hook Form',
      text: 'Registers uncontrolled inputs with refs + validation on submit/blur — popular middle ground avoiding per-keystroke app re-renders.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Uncontrolled form with ref',
      code: `function SignupForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value ?? '';
    onSubmit(new FormData(e.currentTarget as HTMLFormElement));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} name="email" defaultValue="" type="email" />
      <button type="submit">Join</button>
    </form>
  );
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Switching defaultValue → value mid-lifecycle triggers controlled/uncontrolled warning.',
        'Autofill updates DOM without React knowing — uncontrolled handles naturally.',
        'Imperative handle forwardRef for custom uncontrolled inputs.',
        'File input value is read-only — must use uncontrolled ref.files.',
        'SSR: defaultValue renders initial HTML; hydration matches.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Fewer re-renders on large forms',
      'Simple submit-only forms',
      'Native FormData integration',
    ],
    disadvantages: [
      'No live derived UI from input without listeners',
      'Harder instant validation UX',
      'Imperative ref access less declarative',
    ],
    alternatives: [
      'Controlled for rich interactive forms',
      'React Hook Form register pattern',
      'Form libraries (Formik) often controlled',
    ],
    whenToUse: [
      'Simple forms validated only on submit',
      'File uploads',
      'Performance-sensitive large forms',
    ],
    whenNotToUse: [
      'Disable submit until valid — need controlled or RHF watch',
      'Format/mask on every keystroke',
    ],
  },
  failureModes: [
    'Mixing value and defaultValue — React warning and bugs.',
    'Reading ref before mount — null.',
    'Expecting React state to reflect autofill in controlled input without onChange.',
    'Forgotten name attribute — FormData incomplete.',
    'Uncontrolled input in fully controlled form mental model confusion.',
  ],
  production: {
    performance: ['RHF uncontrolled for forms with dozens of fields'],
    reliability: ['Validate on submit server-side regardless of client pattern'],
    maintainability: ['Pick one pattern per form; document hybrid exceptions'],
  },
  interview: {
    expectations: [
      'Uncontrolled vs controlled difference',
      'defaultValue vs value',
      'When prefer uncontrolled',
    ],
    commonQuestions: [
      'What is uncontrolled component?',
      'How read uncontrolled input value?',
      'Can file input be controlled?',
    ],
    followUps: [
      'React Hook Form approach?',
      'Autofill issues with controlled?',
    ],
    misconceptions: [
      'Uncontrolled means non-React',
      'Always use controlled in React',
      'defaultValue updates when prop changes',
    ],
    traps: ['Saying file input can use value state binding'],
    strongSignals: [
      'DOM owns state; ref on submit',
      'defaultValue not value',
      'RHF as hybrid pattern',
    ],
  },
  keyTakeaways: [
    'Uncontrolled: DOM holds input state; use defaultValue + ref.',
    'Read values imperatively on submit.',
    'Fewer re-renders; good for simple/large forms.',
    'File inputs effectively uncontrolled only.',
    'Do not mix value and defaultValue.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Controlled vs uncontrolled input?',
      answerHint: 'Controlled: React state drives value. Uncontrolled: DOM default + ref read.',
    },
    {
      level: 'intermediate',
      question: 'When prefer uncontrolled?',
      answerHint: 'Simple submit-only forms, file inputs, perf on large forms via RHF.',
    },
    {
      level: 'advanced',
      question: 'Why controlled inputs struggle with browser autofill?',
      answerHint: 'Autofill updates DOM without onChange; React state stale until interaction.',
    },
  ],
  flashcards: [
    { front: 'Uncontrolled input', back: 'defaultValue + ref; DOM owns live value' },
    { front: 'Read uncontrolled value', back: 'ref.current.value on submit' },
    { front: 'File input', back: 'Cannot control value — use ref.files' },
  ],
  quickRevision: [
    'defaultValue not value',
    'ref on submit',
    'Less re-renders',
    'FormData friendly',
    'File = uncontrolled',
    'RHF uses refs',
  ],
}
