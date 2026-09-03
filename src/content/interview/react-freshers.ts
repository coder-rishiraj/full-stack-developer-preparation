import type { ReactInterviewItem } from './types'

export const REACT_INTERVIEW_FRESHERS: ReactInterviewItem[] = [
  {
    id: 'what-is-react',
    question: 'What is React?',
    relatedTopicIds: ['b4-component-model', 'b4-virtual-dom'],
    answer: [
      {
        type: 'paragraph',
        text: 'React is an open-source JavaScript library for building user interfaces from composable components. It is not a full MVC framework: it owns the view layer and lets you choose routing, data fetching, and global state. Jordan Walke created it at Facebook; it shipped on News Feed in 2011 and Instagram in 2012.',
      },
      {
        type: 'list',
        items: [
          'Component model: UI is functions (or classes) that return a description of the next screen.',
          'Declarative updates: you describe state; React updates the DOM.',
          'Unidirectional data flow: data goes down as props; events go up as callbacks.',
          'Can render on the client, the server (SSR), or as React Server Components.',
        ],
      },
    ],
  },
  {
    id: 'advantages',
    question: 'What are the advantages of using React?',
    relatedTopicIds: ['b4-component-model', 'b4-reconciliation'],
    answer: [
      {
        type: 'list',
        items: [
          'Reusable components keep UI consistent and speed up delivery.',
          'The reconciler applies targeted DOM updates instead of rewriting the whole tree.',
          'JSX plus JavaScript makes UI logic colocated with markup.',
          'Huge ecosystem (React Router, TanStack Query, Next.js) without locking you into one “batteries included” framework.',
          'Server rendering and streaming improve first paint and SEO when you need them.',
          'The mental model (state in → UI out) is easier to teach than two-way binding.',
        ],
      },
    ],
  },
  {
    id: 'limitations',
    question: 'What are the limitations of React?',
    relatedTopicIds: ['b4-state-management-tradeoffs', 'b4-nextjs'],
    answer: [
      {
        type: 'list',
        items: [
          'It is a library: routing, i18n, forms, and data fetching are extra decisions.',
          'JSX and the render model feel awkward until you internalize “UI is a function of state”.',
          'Easy to create unnecessary re-renders if state sits too high or props are unstable.',
          'Class APIs, old Context, and string refs still appear in legacy codebases.',
          'SEO and first load are weak if you ship a large client-only bundle with no SSR/SSG.',
        ],
      },
    ],
  },
  {
    id: 'usestate',
    question: 'What is useState() in React?',
    relatedTopicIds: ['b4-usestate', 'b4-state'],
    answer: [
      {
        type: 'paragraph',
        text: 'useState is the hook that gives a function component local reactive memory. It returns a snapshot value for this render and a setter that schedules the next render. The setter identity is stable; the value is not.',
      },
      {
        type: 'code',
        language: 'tsx',
        caption: 'Lazy init and a functional update',
        code: `const [count, setCount] = useState(0);
const [items, setItems] = useState(() => loadFromStorage());

function increment() {
  setCount((c) => c + 1); // depends on previous snapshot
}`,
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Interview trap',
        text: 'setState does not mutate the current render’s variable. Calling setCount(count + 1) three times in one event still uses the same count unless you use the functional updater. Object.is equality can skip a re-render if you pass the same reference.',
      },
    ],
  },
  {
    id: 'keys',
    question: 'What are keys in React?',
    relatedTopicIds: ['b4-keys', 'b4-reconciliation'],
    answer: [
      {
        type: 'paragraph',
        text: 'A key is a stable identity React uses when reconciling lists. It tells the reconciler which child is the same item across renders so state, focus, and DOM nodes can be reused instead of remounted.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `ids.map((id) => (
  <li key={id}>{id}</li>
))`,
      },
      {
        type: 'list',
        items: [
          'Keys must be unique among siblings, not globally unique.',
          'Prefer a business id from the server over the array index.',
          'Index keys break when you insert, delete, or reorder — state sticks to the wrong row.',
          'Changing a key remounts that subtree on purpose (reset a form, restart an animation).',
        ],
      },
    ],
  },
  {
    id: 'jsx',
    question: 'What is JSX?',
    relatedTopicIds: ['b4-component-model'],
    answer: [
      {
        type: 'paragraph',
        text: 'JSX is syntactic sugar that compiles to React element creation (historically React.createElement, now typically the automatic JSX runtime). You write markup-looking syntax in JavaScript; the compiler produces objects describing type, props, and children.',
      },
      {
        type: 'code',
        language: 'tsx',
        caption: 'Same UI without JSX vs with JSX',
        code: `const text = React.createElement('p', null, 'This is a text');
const container = React.createElement('div', null, text);

const containerJsx = (
  <div>
    <p>This is a text</p>
  </div>
);`,
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'You can skip JSX',
        text: 'JSX is optional. Teams use it because nested createElement calls are harder to read. class becomes className, and expressions go in curly braces.',
      },
    ],
  },
  {
    id: 'functional-vs-class',
    question: 'What are the differences between functional and class components?',
    relatedTopicIds: ['b4-component-model', 'b4-usestate', 'b4-useeffect'],
    answer: [
      {
        type: 'paragraph',
        text: 'Before Hooks (React 16.8), function components could not hold state or effects. Today they are the default. Class components still exist for error boundaries and some legacy libraries.',
      },
      {
        type: 'table',
        headers: ['', 'Function component', 'Class component'],
        rows: [
          ['Declaration', 'function or arrow', 'class extends Component'],
          ['Props', 'argument (often destructured)', 'this.props'],
          ['State', 'useState / useReducer', 'this.state + this.setState'],
          ['Effects', 'useEffect / useLayoutEffect', 'lifecycle methods'],
          ['this / bind', 'not needed', 'often bind handlers or use arrows'],
        ],
      },
      {
        type: 'code',
        language: 'tsx',
        caption: 'Same counter, two styles',
        code: `function Classroom() {
  const [students, setStudents] = useState(0);
  return (
    <button onClick={() => setStudents((n) => n + 1)}>
      {students}
    </button>
  );
}

class ClassroomClass extends React.Component {
  state = { students: 0 };
  add = () => this.setState((s) => ({ students: s.students + 1 }));
  render() {
    return <button onClick={this.add}>{this.state.students}</button>;
  }
}`,
      },
    ],
  },
  {
    id: 'virtual-dom',
    question: 'What is the virtual DOM? How does React use it to render UI?',
    relatedTopicIds: ['b4-virtual-dom', 'b4-reconciliation', 'b4-modern-rendering'],
    answer: [
      {
        type: 'paragraph',
        text: 'The “virtual DOM” is the tree of React elements (plain objects) produced by render. React compares the previous tree with the next one (reconciliation) and commits a minimal set of DOM operations. Real DOM reads/writes are expensive; comparing JS objects is cheaper.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'State or props change → React re-runs the component function.',
          'Render produces a new element tree.',
          'Diff vs previous tree using type + key heuristics (O(n), not a full O(n³) tree edit).',
          'Commit phase mutates only the DOM nodes that actually changed, then runs effects.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Do not oversell it',
        text: 'Interviewers dislike “React keeps two virtual DOMs and is always faster.” Keys, state placement, and avoiding extra renders matter more than the slogan. Concurrent React and Server Components also change what “render” means — the fiber tree is the real in-memory model, not a second HTML copy.',
      },
    ],
  },
  {
    id: 'controlled-uncontrolled',
    question: 'What are the differences between controlled and uncontrolled components?',
    relatedTopicIds: ['b4-controlled', 'b4-uncontrolled', 'b4-useref'],
    answer: [
      {
        type: 'paragraph',
        text: 'Both patterns collect input. Controlled means React state is the source of truth (value + onChange). Uncontrolled means the DOM owns the value; you read it via a ref when you need it (often on submit).',
      },
      {
        type: 'table',
        headers: ['Need', 'Uncontrolled', 'Controlled'],
        rows: [
          ['Read value on submit', 'Yes (ref)', 'Yes'],
          ['Validate as the user types', 'Awkward', 'Natural'],
          ['Disable submit until valid', 'Awkward', 'Natural'],
          ['Mask / format input', 'Harder', 'Natural'],
          ['Integrate a non-React widget', 'Often easier', 'Needs adapters'],
        ],
      },
      {
        type: 'code',
        language: 'tsx',
        caption: 'Controlled vs uncontrolled input',
        code: `function Controlled() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

function Uncontrolled() {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      alert(ref.current?.value);
    }}>
      <input ref={ref} defaultValue="" />
      <button type="submit">Save</button>
    </form>
  );
}`,
      },
    ],
  },
  {
    id: 'props',
    question: 'What are props in React?',
    relatedTopicIds: ['b4-props', 'b4-composition'],
    answer: [
      {
        type: 'paragraph',
        text: 'Props (properties) are the inputs to a component — a single object passed from parent to child. They look like HTML attributes in JSX (`<Card title="Hi" />`) and are read-only inside the child. To “change props,” the parent re-renders with new values.',
      },
      {
        type: 'list',
        items: [
          'Pass data down: labels, IDs, callbacks, render slots (children).',
          'children is just another prop for nested JSX.',
          'Mutating props is a bug; lift state or pass a setter callback instead.',
        ],
      },
    ],
  },
  {
    id: 'state-and-props',
    question: 'Explain React state and props.',
    relatedTopicIds: ['b4-props', 'b4-state', 'b4-state-placement'],
    answer: [
      {
        type: 'table',
        headers: ['Props', 'State'],
        rows: [
          ['Passed in from outside', 'Owned by this component'],
          ['Read-only here', 'Updated with a setter'],
          ['Make a component configurable', 'Make a component interactive over time'],
          ['Changing them is the parent’s job', 'Updates schedule a re-render'],
        ],
      },
      {
        type: 'paragraph',
        text: 'A child can receive state as props. That does not make the child the owner — it still cannot assign to props. If two siblings need the same data, lift state to the closest shared parent and pass it down.',
      },
    ],
  },
  {
    id: 'side-effects',
    question: 'Explain types of side effects in a React component.',
    relatedTopicIds: ['b4-useeffect', 'b4-when-not-effects'],
    answer: [
      {
        type: 'paragraph',
        text: 'A side effect is anything besides computing the next UI: network, subscriptions, timers, document.title, imperative DOM APIs. In function components you usually put them in useEffect (or useLayoutEffect when you must measure before paint).',
      },
      {
        type: 'list',
        items: [
          'Effects without cleanup: fetch-and-set, logging, writing to document.title. Still cancel in-flight work if the component unmounts or the request is stale.',
          'Effects with cleanup: subscriptions, WebSockets, setInterval, adding window listeners. Return a function from useEffect so React runs it before the next effect and on unmount — otherwise you leak.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Not every sync belongs in useEffect',
        text: 'User-event logic (submit a form) can live in the event handler. Derived values belong in render. Effects are for synchronizing with something outside React.',
      },
    ],
  },
  {
    id: 'prop-drilling',
    question: 'What is prop drilling in React?',
    relatedTopicIds: ['b4-usecontext', 'b4-composition', 'b4-state-placement'],
    answer: [
      {
        type: 'paragraph',
        text: 'Prop drilling is threading the same data through intermediate components that do not use it, only so a deep child can read it. Those middle components become harder to reuse and refactor because they “know” about unrelated props.',
      },
      {
        type: 'list',
        items: [
          'Fix with composition: pass children/slots so the parent that owns the data renders the leaf directly.',
          'Fix with Context for rarely changing, widely needed values (theme, auth user).',
          'Fix with a store (Zustand, Redux, TanStack Query) when many distant screens share client or server state.',
        ],
      },
    ],
  },
  {
    id: 'error-boundaries',
    question: 'What are error boundaries?',
    relatedTopicIds: ['b4-error-boundaries'],
    answer: [
      {
        type: 'paragraph',
        text: 'Error boundaries catch JavaScript errors in the render phase, constructors, and lifecycle methods of their child tree, then show a fallback UI instead of unmounting the whole app. They were added in React 16.',
      },
      {
        type: 'list',
        items: [
          'Implement with static getDerivedStateFromError (set fallback state) and/or componentDidCatch (log).',
          'They do not catch errors in event handlers, async code, SSR, or themselves — wrap those separately.',
          'There is still no Hook equivalent in React core; use a class or a library that wraps one.',
        ],
      },
      {
        type: 'code',
        language: 'tsx',
        caption: 'Minimal boundary',
        code: `class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    logError(error, info);
  }
  render() {
    if (this.state.hasError) return <h4>Something went wrong</h4>;
    return this.props.children;
  }
}

<ErrorBoundary>
  <Counter />
</ErrorBoundary>`,
      },
    ],
  },
  {
    id: 'what-are-hooks',
    question: 'What are React Hooks?',
    relatedTopicIds: ['b4-usestate', 'b4-useeffect', 'b4-custom-hooks'],
    answer: [
      {
        type: 'paragraph',
        text: 'Hooks are functions that let function components “hook into” React features: state, context, refs, and lifecycle-like effects. They shipped in React 16.8 so you do not need a class just to hold state.',
      },
    ],
  },
  {
    id: 'explain-hooks',
    question: 'Explain React Hooks.',
    relatedTopicIds: ['b4-usestate', 'b4-useeffect'],
    answer: [
      {
        type: 'paragraph',
        text: 'Each Hook call is tied to a fiber by call order. useState stores a value on that slot; useEffect stores an effect list. Because identity is “Nth Hook call,” you must call Hooks in the same order every render — no Hooks inside loops or conditions.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `function Person() {
  const [name, setName] = useState('');
  useEffect(() => {
    document.title = name || 'Profile';
  }, [name]);
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}`,
      },
    ],
  },
  {
    id: 'hook-rules',
    question: 'What rules must you follow when using React Hooks?',
    relatedTopicIds: ['b4-usestate', 'b4-custom-hooks'],
    answer: [
      {
        type: 'list',
        ordered: true,
        items: [
          'Only call Hooks at the top level of a React function — not in loops, nested functions, or conditions.',
          'Only call Hooks from React function components or other custom Hooks (functions named useSomething).',
        ],
      },
      {
        type: 'paragraph',
        text: 'The linter plugin eslint-plugin-react-hooks encodes these rules. Breaking them desynchronizes the Hook list from the fiber and produces “rendered more hooks than during the previous render.”',
      },
    ],
  },
  {
    id: 'useeffect',
    question: 'What is the use of the useEffect Hook?',
    relatedTopicIds: ['b4-useeffect', 'b4-effect-dependencies', 'b4-when-not-effects'],
    answer: [
      {
        type: 'paragraph',
        text: 'useEffect(callback, deps) runs the callback after React has updated the DOM. Use it to synchronize React with an external system. The optional dependency array controls when the effect re-runs; omit it and it runs after every paint (rarely what you want).',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `function WelcomeGreetings({ name }: { name: string }) {
  const msg = \`Hi, \${name}!\`;
  useEffect(() => {
    document.title = \`Welcome \${name}\`;
  }, [name]);
  return <div>{msg}</div>;
}`,
      },
      {
        type: 'list',
        items: [
          '[] — mount (and Strict Mode’s extra dev cycle); cleanup on unmount.',
          '[name] — when name changes, previous cleanup runs, then the new effect.',
          'Return a cleanup function for timers, listeners, and aborted fetches.',
        ],
      },
    ],
  },
  {
    id: 'hooks-refs',
    question: 'Why do React Hooks use refs?',
    relatedTopicIds: ['b4-useref'],
    answer: [
      {
        type: 'paragraph',
        text: 'useRef holds a mutable box that survives renders without causing a re-render when .current changes. Class components had React.createRef / callback refs; function components use the same idea via a Hook.',
      },
      {
        type: 'list',
        items: [
          'Reach a DOM node: focus, scrollIntoView, media play/pause, text selection.',
          'Talk to imperative third-party libraries that expect a node.',
          'Keep a mutable value (latest callback, interval id) without re-rendering.',
        ],
      },
    ],
  },
  {
    id: 'custom-hooks',
    question: 'What are Custom Hooks?',
    relatedTopicIds: ['b4-custom-hooks'],
    answer: [
      {
        type: 'paragraph',
        text: 'A custom Hook is a function whose name starts with use and that may call other Hooks. It lets you reuse stateful logic (fetch, form fields, media query) without wrapping the tree in HOCs or render-props.',
      },
      {
        type: 'list',
        items: [
          'Each component that calls the Hook gets its own state — sharing a Hook is not sharing one piece of state.',
          'They do not work inside class components.',
          'They replace many HOCs for cross-cutting behavior while keeping a flatter tree.',
        ],
      },
    ],
  },
]
