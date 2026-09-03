import type { ReactInterviewItem } from './types'

export const REACT_INTERVIEW_EXPERIENCED: ReactInterviewItem[] = [
  {
    id: 'switching-component',
    question: 'How do you create a switching component that displays different pages?',
    relatedTopicIds: ['b4-component-model', 'b4-nextjs'],
    answer: [
      {
        type: 'paragraph',
        text: 'Map a discriminant (route name, tab id) to a component, then render that component. Prefer React Router / Next.js file routes in real apps; a lookup object is a fine interview sketch for tabs or simple shells.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `const PAGES = {
  home: HomePage,
  about: AboutPage,
  facilities: FacilitiesPage,
  contact: ContactPage,
} as const;

type PageId = keyof typeof PAGES;

function Page({ page, ...props }: { page: PageId } & Record<string, unknown>) {
  const Handler = PAGES[page] ?? HelpPage;
  return <Handler {...props} />;
}`,
      },
    ],
  },
  {
    id: 'resize-rerender',
    question: 'How do you re-render the view when the browser is resized?',
    relatedTopicIds: ['b4-useeffect', 'b4-usestate'],
    answer: [
      {
        type: 'paragraph',
        text: 'Subscribe to window resize, store width/height in state, and unsubscribe on cleanup. Debounce or use matchMedia if you only care about breakpoints. Prefer CSS for layout; JS resize listeners are for measurements you cannot express in CSS.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `function WindowSize() {
  const [size, setSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <span>{size.width} × {size.height}</span>;
}`,
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Legacy API',
        text: 'componentWillMount is unsafe and removed from new React. Put subscriptions in useEffect or componentDidMount, never in the constructor or a deprecated willMount hook.',
      },
    ],
  },
  {
    id: 'sibling-router-data',
    question: 'How do you pass data between sibling components using React Router?',
    relatedTopicIds: ['b4-props', 'b4-usecontext'],
    answer: [
      {
        type: 'paragraph',
        text: 'Siblings should not secretly share a mutable singleton. With routing, put the value in the URL (path param, search param) or lift it to a parent layout. Older React Router v5 used history.push and match.params; v6 uses useNavigate, useParams, and useSearchParams.',
      },
      {
        type: 'code',
        language: 'tsx',
        caption: 'React Router v6 sketch',
        code: `function Home() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/about/DemoButton')}>To About</button>
  );
}

function About() {
  const { aboutId } = useParams();
  if (!aboutId) return <div>No data yet</div>;
  return <div>From Home: {aboutId}</div>;
}

// Route: path="/about/:aboutId"`,
      },
      {
        type: 'list',
        items: [
          'URL state survives refresh and is shareable — good for filters and ids.',
          'Sensitive or bulky objects should not go in the URL; use a parent, Context, or a cache.',
          'Outlet context can pass layout data to nested routes without polluting the URL.',
        ],
      },
    ],
  },
  {
    id: 'redirect-after-login',
    question: 'How do you perform an automatic redirect after login?',
    relatedTopicIds: ['b4-nextjs'],
    answer: [
      {
        type: 'paragraph',
        text: 'When auth state becomes “logged in,” navigate to the destination. React Router v6 uses <Navigate replace /> or useNavigate(). Save the original location so you can return after login.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  if (user) return <Navigate to={from} replace />;
  return <LoginForm onSuccess={setUser} />;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}`,
      },
    ],
  },
  {
    id: 'hooks-static-typing',
    question: 'Do React Hooks work with static typing?',
    relatedTopicIds: ['b4-usestate', 'b4-usereducer'],
    answer: [
      {
        type: 'paragraph',
        text: 'Yes. TypeScript infers most Hook types. You annotate when inference is too wide (empty arrays, reducers, generic custom Hooks).',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `const [user, setUser] = useState<User | null>(null);

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'setEmail':
      return { ...state, email: action.email };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, { email: '' });`,
      },
    ],
  },
  {
    id: 'strict-mode',
    question: 'Explain Strict Mode in React.',
    relatedTopicIds: ['b4-rendering-lifecycle', 'b4-useeffect'],
    answer: [
      {
        type: 'paragraph',
        text: 'React.StrictMode is a development-only wrapper that extra-checks for unsafe patterns. It does not render extra DOM and it does not run in production.',
      },
      {
        type: 'list',
        items: [
          'Warns on deprecated string refs, findDOMNode, and unsafe class lifecycles.',
          'Double-invokes render, constructors, and effect setup/cleanup in development to surface impure code and missing cleanup.',
          'Helps you prepare for concurrent rendering: effects must be resilient to mount → unmount → remount.',
        ],
      },
      {
        type: 'code',
        language: 'tsx',
        code: `createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,
      },
    ],
  },
  {
    id: 'prevent-rerenders',
    question: 'How do you prevent re-renders in React?',
    relatedTopicIds: ['b4-unnecessary-renders', 'b4-memoization-perf', 'b4-when-not-memoize'],
    answer: [
      {
        type: 'paragraph',
        text: 'A parent render re-renders children by default. Prevent work only after you measure: React Profiler first, memo second.',
      },
      {
        type: 'list',
        items: [
          'Move state down so unrelated siblings do not update.',
          'React.memo (function) or PureComponent / shouldComponentUpdate (class) skip render when props are shallow-equal.',
          'Stabilize callback and object props with useCallback / useMemo so memoized children actually skip.',
          'Do not return false from shouldComponentUpdate on a component that still needs to update — that is a bug, not an optimization.',
        ],
      },
    ],
  },
  {
    id: 'styling',
    question: 'What are the different ways to style a React component?',
    relatedTopicIds: ['b4-component-model'],
    answer: [
      {
        type: 'list',
        items: [
          'Inline style={{ color: "navy" }} — JS object, camelCase, good for computed values, weak for hover/media.',
          'CSS files + className.',
          'CSS Modules (*.module.css) — locally scoped class names.',
          'CSS-in-JS (Emotion, styled-components, vanilla-extract).',
          'Utility frameworks (Tailwind) as className strings.',
          'Sass/Less preprocessors if the team already uses them.',
        ],
      },
    ],
  },
  {
    id: 'optimize-performance',
    question: 'Name techniques to optimize React app performance.',
    relatedTopicIds: [
      'b4-memoization-perf',
      'b4-code-splitting',
      'b4-lazy-loading',
      'b4-virtualization',
      'b4-bundle-optimization',
      'b4-profiler',
    ],
    answer: [
      {
        type: 'list',
        items: [
          'useMemo for expensive derived data; skip it for cheap calculations.',
          'React.memo + stable props for heavy pure children.',
          'State colocation and splitting Context so high-frequency values do not blast the tree.',
          'Code splitting with React.lazy / dynamic import / framework route splitting.',
          'List virtualization (react-window) when thousands of rows are on screen.',
          'Treat server cache separately (TanStack Query) so you do not refetch on every mount.',
          'Fix network waterfalls; stream SSR / Server Components where the stack supports them.',
        ],
      },
    ],
  },
  {
    id: 'pass-data-components',
    question: 'How do you pass data between React components?',
    relatedTopicIds: ['b4-props', 'b4-composition', 'b4-usecontext'],
    answer: [
      {
        type: 'paragraph',
        text: 'Parent → child: props. Child → parent: callback props. Sibling → sibling: lift state. Distant → Context or an external store.',
      },
      {
        type: 'code',
        language: 'tsx',
        caption: 'Lifted counter',
        code: `function Parent() {
  const [counter, setCounter] = useState(0);
  return (
    <>
      <p>{counter}</p>
      <Child value={counter} onIncrement={() => setCounter((c) => c + 1)} />
    </>
  );
}

function Child({ value, onIncrement }: { value: number; onIncrement: () => void }) {
  return <button onClick={onIncrement}>Inc ({value})</button>;
}`,
      },
    ],
  },
  {
    id: 'hoc',
    question: 'What are Higher-Order Components?',
    relatedTopicIds: ['b4-composition', 'b4-custom-hooks'],
    answer: [
      {
        type: 'paragraph',
        text: 'An HOC is a function that takes a component and returns a new component, injecting shared behavior (data subscription, auth gate). The pattern predates Hooks; custom Hooks are usually simpler now, but HOCs still appear in codebases and interview questions.',
      },
      {
        type: 'code',
        language: 'tsx',
        caption: 'Share a subscription without copying lifecycle code',
        code: `function withData<P extends { data: unknown }>(
  Wrapped: React.ComponentType<P>,
  select: () => P['data'],
) {
  return function WithData(props: Omit<P, 'data'>) {
    const [data, setData] = useState(select);
    useEffect(() => {
      const onChange = () => setData(select());
      GlobalDataSource.subscribe(onChange);
      return () => GlobalDataSource.unsubscribe(onChange);
    }, []);
    return <Wrapped {...(props as P)} data={data} />;
  };
}`,
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'HOC hygiene',
        text: 'Forward refs, copy a displayName, and do not mutate the wrapped component. Nested HOCs create “wrapper hell,” which is why Hooks won for most new code.',
      },
    ],
  },
  {
    id: 'lifecycle-phases',
    question: 'What are the phases of the component lifecycle?',
    relatedTopicIds: ['b4-rendering-lifecycle'],
    answer: [
      {
        type: 'list',
        items: [
          'Mount: instance is created, first render, DOM inserted, componentDidMount / useEffect([]).',
          'Update: new props or state, maybe skip with shouldComponentUpdate / memo, re-render, DOM patch, componentDidUpdate / useEffect(deps).',
          'Unmount: componentWillUnmount / effect cleanup, then DOM removed.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Concurrent React adds an extra idea: render can be interrupted and restarted. Keep render pure; put subscriptions in effects.',
      },
    ],
  },
  {
    id: 'lifecycle-methods',
    question: 'What are the lifecycle methods of React?',
    relatedTopicIds: ['b4-rendering-lifecycle', 'b4-error-boundaries'],
    answer: [
      {
        type: 'list',
        items: [
          'constructor — initial state (avoid side effects).',
          'getDerivedStateFromProps — rare; prefer fully controlled or a key remount.',
          'render — required; must be pure.',
          'componentDidMount — subscriptions, measure DOM, fetch (or useEffect).',
          'shouldComponentUpdate — bail out of render.',
          'getSnapshotBeforeUpdate — read DOM before mutation (scroll position).',
          'componentDidUpdate — post-commit; compare prev props to avoid loops.',
          'componentWillUnmount — cleanup.',
          'getDerivedStateFromError / componentDidCatch — error boundaries only.',
        ],
      },
    ],
  },
  {
    id: 'hooks-example',
    question: 'How would you sketch a simple React Hooks program?',
    relatedTopicIds: ['b4-usestate', 'b4-custom-hooks'],
    answer: [
      {
        type: 'paragraph',
        text: 'Scaffold with Vite or your team’s template (create-react-app is deprecated). Extract UI into function components, then add useState for input and a derived filtered list in render — no effect required for filtering.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `export function SearchItem({ items }: { items: { name: string; price: number }[] }) {
  const [query, setQuery] = useState('');
  const visible = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
      <table>
        <tbody>
          {visible.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 'hook-types',
    question: 'Explain types of Hooks in React.',
    relatedTopicIds: [
      'b4-usestate',
      'b4-useeffect',
      'b4-usecontext',
      'b4-usereducer',
      'b4-usememo',
      'b4-usecallback',
      'b4-useref',
    ],
    answer: [
      {
        type: 'list',
        items: [
          'Basic: useState, useEffect, useContext.',
          'Additional: useReducer, useMemo, useCallback, useRef, useLayoutEffect, useImperativeHandle, useDebugValue, useId, useSyncExternalStore, useTransition, useDeferredValue, useActionState (newer apps).',
          'Custom: any useX that composes the above.',
        ],
      },
    ],
  },
  {
    id: 'hooks-vs-classes',
    question: 'Differentiate React Hooks vs classes.',
    relatedTopicIds: ['b4-usestate', 'b4-component-model'],
    answer: [
      {
        type: 'table',
        headers: ['Hooks', 'Classes'],
        rows: [
          ['Function components', 'ES6 class + render()'],
          ['No constructor required', 'constructor / field initializers'],
          ['No this for state', 'this.state / this.setState'],
          ['Logic reuse via custom Hooks', 'Reuse via HOCs / mixins (legacy)'],
          ['Effects grouped by concern', 'Lifecycles grouped by time'],
        ],
      },
    ],
  },
  {
    id: 'hooks-vs-classes-perf',
    question: 'How does performance of Hooks compare with classes?',
    relatedTopicIds: ['b4-unnecessary-renders', 'b4-custom-hooks'],
    answer: [
      {
        type: 'paragraph',
        text: 'Hooks avoid class instance setup and event-handler binding. Custom Hooks flatten trees that used to be nested HOCs and render-props, so React walks fewer components. They do not magically prevent re-renders — a function component still re-renders when its state or parent does.',
      },
    ],
  },
  {
    id: 'hooks-cover-classes',
    question: 'Do Hooks cover all class functionalities?',
    relatedTopicIds: ['b4-error-boundaries', 'b4-rendering-lifecycle'],
    answer: [
      {
        type: 'paragraph',
        text: 'Almost. The remaining class-only APIs in React itself are error-boundary methods (getDerivedStateFromError, componentDidCatch) and getSnapshotBeforeUpdate. Third-party code that still requires a class is increasingly rare.',
      },
    ],
  },
  {
    id: 'react-router',
    question: 'What is React Router?',
    relatedTopicIds: ['b4-nextjs', 'b4-code-splitting'],
    answer: [
      {
        type: 'paragraph',
        text: 'React Router is the usual client-side routing library for React SPAs. It keeps the URL in sync with the component tree without a full page reload, using the History API.',
      },
      {
        type: 'list',
        items: [
          'BrowserRouter — HTML5 history (pushState / popstate).',
          'Routes / Route — match path to a UI branch (v6).',
          'Link / NavLink — client navigation without <a> full reload.',
          'Outlet — nested layouts.',
          'Frameworks like Next.js App Router replace much of this with file-based routing and Server Components.',
        ],
      },
    ],
  },
  {
    id: 'hooks-vs-redux',
    question: 'Can React Hooks replace Redux?',
    relatedTopicIds: ['b4-state-management-tradeoffs', 'b4-usecontext', 'b4-usereducer', 'b4-server-vs-client-state'],
    answer: [
      {
        type: 'paragraph',
        text: 'useReducer + Context can replace Redux for small client trees. Redux (or Zustand, Jotai) still wins when you need middleware, time-travel, independent subscriptions, or a large shared client store. Server state is usually a better fit for TanStack Query than for Redux.',
      },
    ],
  },
  {
    id: 'conditional-rendering',
    question: 'Explain conditional rendering in React.',
    relatedTopicIds: ['b4-component-model', 'b4-keys'],
    answer: [
      {
        type: 'list',
        items: [
          'if / else or early return for whole screens.',
          'ternary for two branches in JSX.',
          '&& for “render this or nothing” — watch out for 0 which is valid React output.',
          'Element variables for cleaner JSX.',
          'Switching component type remounts; keep a stable type and a key when you need a reset.',
        ],
      },
    ],
  },
]
