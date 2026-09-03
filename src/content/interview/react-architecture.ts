import type { ReactInterviewItem } from './types'

export const REACT_INTERVIEW_ARCHITECTURE: ReactInterviewItem[] = [
  {
    id: 'reconciliation',
    question: 'What is reconciliation? How does React’s diffing algorithm work?',
    relatedTopicIds: ['b4-reconciliation', 'b4-virtual-dom', 'b4-keys'],
    answer: [
      {
        type: 'paragraph',
        text: 'Reconciliation is how React turns a new element tree into DOM updates. A general tree-diff is O(n³); React uses an O(n) heuristic: different element types mean different subtrees, and keys identify list children.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Re-render produces a new React element tree.',
          'Compare with the previous fiber tree.',
          'Compute mutations (insert, update, move, delete).',
          'Commit those mutations to the real DOM.',
        ],
      },
      {
        type: 'list',
        items: [
          'Different type at the root (div → section, A → B): unmount the old tree, mount a new one — state is lost.',
          'Same type: update changed attributes, then recurse into children.',
          'Lists: match by key. Without stable keys React falls back to index matching, which mis-assigns state on reorder.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Short interview answer',
        text: 'Reconciliation compares previous and next trees and applies the smallest DOM updates it can. The heuristic is linear because React assumes type changes replace subtrees and keys uniquely identify list items.',
      },
    ],
  },
  {
    id: 'forward-ref',
    question: 'What is forwardRef, and when do you need it?',
    relatedTopicIds: ['b4-useref', 'b4-composition'],
    answer: [
      {
        type: 'paragraph',
        text: 'ref is not a normal prop. Historically, function components ignored ref unless wrapped in React.forwardRef, which passed ref as a second argument so the child could attach it to a DOM node or an imperative handle.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  function Input(props, ref) {
    return <input ref={ref} {...props} />;
  },
);

const inputRef = useRef<HTMLInputElement>(null);
<Input ref={inputRef} />;
inputRef.current?.focus();`,
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'React 19',
        text: 'In React 19, function components can accept ref as a regular prop, so many new components skip forwardRef. Still know forwardRef for older codebases, HOCs, and interviews.',
      },
    ],
  },
  {
    id: 'ssr-csr',
    question: 'What is server-side rendering (SSR)? How does it differ from client-side rendering?',
    relatedTopicIds: ['b4-ssr', 'b4-csr', 'b4-ssg', 'b4-server-components', 'b4-modern-rendering'],
    answer: [
      {
        type: 'paragraph',
        text: 'SSR generates HTML on the server per request. The browser paints content immediately, then hydration attaches event listeners so the page becomes a React app. CSR ships a shell and builds the DOM in the browser after JavaScript downloads.',
      },
      {
        type: 'table',
        headers: ['SSR', 'CSR'],
        rows: [
          ['First HTML includes content', 'First HTML is often empty/shell'],
          ['Better first paint and SEO', 'Weaker SEO if crawlers do not run JS'],
          ['Needs a Node (or edge) runtime', 'Can be a static CDN + API'],
          ['Hydration must match server HTML', 'No hydration mismatch'],
        ],
      },
      {
        type: 'list',
        items: [
          'Hydration: React attaches to server HTML; mismatch warnings mean the client rendered something different.',
          'SSG: HTML at build time — fast, less request-time dynamic data.',
          'Streaming SSR: send HTML in chunks for a better TTFB.',
          'React Server Components: run on the server, shrink the client bundle, fetch without extra client waterfalls.',
        ],
      },
    ],
  },
  {
    id: 'global-state',
    question: 'How do you manage global state? Compare Context, Redux, and modern alternatives.',
    relatedTopicIds: [
      'b4-usecontext',
      'b4-state-management-tradeoffs',
      'b4-server-vs-client-state',
      'b4-usereducer',
    ],
    answer: [
      {
        type: 'list',
        items: [
          'Start local: useState / useReducer next to the UI that owns it.',
          'Context: theme, locale, current user. Avoid putting high-frequency values in one giant provider — every consumer re-renders.',
          'Redux Toolkit: large interdependent client state, middleware, DevTools. Skip it when most state is server cache.',
          'Zustand / Jotai / Recoil-style stores: less boilerplate, selector-based updates.',
          'TanStack Query / SWR: server state (caching, retries, invalidation) — not a Redux clone.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'How to answer “what would you use?”',
        text: 'Say you default to local state, Context for stable shared values, a lightweight store if many distant clients write the same data, and a server-state library for API data. Name one production choice and why — not a laundry list.',
      },
    ],
  },
  {
    id: 'perf-practical',
    question: 'What are common React performance optimization techniques? (practical)',
    relatedTopicIds: [
      'b4-profiler',
      'b4-unnecessary-renders',
      'b4-usememo',
      'b4-usecallback',
      'b4-code-splitting',
      'b4-virtualization',
      'b4-state-placement',
    ],
    answer: [
      {
        type: 'list',
        ordered: true,
        items: [
          'Profile first (React DevTools Profiler) — optimize the hot components.',
          'React.memo children that receive stable props.',
          'useCallback / useMemo only to keep those props stable or to skip expensive work.',
          'Code-split routes and heavy widgets with lazy + Suspense.',
          'Colocate state; lifting too high is a re-render multiplier.',
          'Virtualize long lists.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Premature memo',
        text: 'Wrapping everything in memo/useMemo adds noise and can still break if you pass inline objects. Interviewers want restraint plus a profiler story.',
      },
    ],
  },
]

export const REACT_INTERVIEW_MODERN: ReactInterviewItem[] = [
  {
    id: 'context-api',
    question: 'What is the Context API? When should you use it instead of prop drilling?',
    relatedTopicIds: ['b4-usecontext', 'b4-composition'],
    answer: [
      {
        type: 'paragraph',
        text: 'Context lets you pass a value through the tree without threading props. createContext, wrap a Provider, consume with useContext (or Context.Consumer).',
      },
      {
        type: 'list',
        items: [
          'Good for: auth user, theme, locale, a DI-style service that rarely changes.',
          'Bad for: every keystroke in a form, animation frames, mouse position — all consumers re-render.',
          'Optimize by splitting contexts and memoizing the Provider value.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Context vs Redux: Context is built-in and simple. Redux (or Zustand) gives finer subscriptions and tooling. Do not reach for Redux just to avoid three layers of props — composition often wins first.',
      },
    ],
  },
  {
    id: 'memo-vs-usememo',
    question: 'What is React.memo? How is it different from useMemo and useCallback?',
    relatedTopicIds: ['b4-memoization-perf', 'b4-usememo', 'b4-usecallback', 'b4-when-not-memoize'],
    answer: [
      {
        type: 'paragraph',
        text: 'React.memo wraps a component and skips re-render when props are shallow-equal. useMemo memoizes a value inside a component. useCallback is useMemo for functions.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `const Child = React.memo(function Child({ user }: { user: { name: string } }) {
  return <p>{user.name}</p>;
});

function Parent() {
  const user = useMemo(() => ({ name: 'Kamala' }), []);
  const onClick = useCallback(() => console.log('clicked'), []);
  return <Child user={user} onClick={onClick} />;
}`,
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Why memo still re-renders',
        text: 'Inline objects/functions fail shallow compare. Context updates also re-render consumers even if they are memoized. Fix the props or split context — do not stack more memo.',
      },
    ],
  },
  {
    id: 'usereducer',
    question: 'What is useReducer, and when would you use it over useState?',
    relatedTopicIds: ['b4-usereducer', 'b4-usestate'],
    answer: [
      {
        type: 'paragraph',
        text: 'useReducer stores state and a dispatch function. You describe events; the reducer returns the next state. Prefer it when updates are related, next state depends on previous in non-trivial ways, or you want to test transitions as a pure function.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `function reducer(state: { count: number }, action: { type: 'increment' }) {
  if (action.type === 'increment') return { count: state.count + 1 };
  return state;
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });`,
      },
    ],
  },
  {
    id: 'suspense-lazy',
    question: 'What are React Suspense and React.lazy? How do they enable code splitting?',
    relatedTopicIds: ['b4-suspense', 'b4-lazy-loading', 'b4-code-splitting'],
    answer: [
      {
        type: 'paragraph',
        text: 'React.lazy(() => import("./Profile")) loads a component on demand. While the import is pending, the nearest Suspense boundary shows fallback. That splits the JS bundle so the first load does not include every page.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `const Profile = React.lazy(() => import('./Profile'));

<Suspense fallback={<p>Loading…</p>}>
  <Profile />
</Suspense>`,
      },
      {
        type: 'paragraph',
        text: 'You can wrap a route, a modal, or several lazy children. In newer stacks Suspense also coordinates data (and Server Components) — say “code splitting is the classic use; data Suspense depends on the framework.”',
      },
    ],
  },
  {
    id: 'portals',
    question: 'What are React Portals, and when would you use them?',
    relatedTopicIds: ['b4-composition'],
    answer: [
      {
        type: 'paragraph',
        text: 'createPortal(child, domNode) renders children into a DOM node outside the parent (for example #modal-root) while keeping them in the React tree for context and events.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `createPortal(<Modal />, document.getElementById('modal-root')!);`,
      },
      {
        type: 'list',
        items: [
          'Use for modals, toasts, tooltips, dropdowns that must escape overflow: hidden or stacking contexts.',
          'Events still bubble in the React tree, not the DOM parent — click-outside logic should account for that.',
        ],
      },
    ],
  },
  {
    id: 'fragment',
    question: 'What is React.Fragment and why is it useful?',
    relatedTopicIds: ['b4-component-model'],
    answer: [
      {
        type: 'paragraph',
        text: 'A component must return one root. Fragment groups children without emitting a DOM node, so you do not break flex/grid or invalid HTML (for example extra divs inside a table).',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `return (
  <>
    <h1>Hello</h1>
    <p>World</p>
  </>
);

// keyed fragment in a list:
<React.Fragment key={id}>{children}</React.Fragment>`,
      },
      {
        type: 'paragraph',
        text: 'The short syntax <> cannot take a key; use <React.Fragment key={...}> in lists.',
      },
    ],
  },
  {
    id: 'useeffect-vs-uselayout',
    question: 'What is the difference between useEffect and useLayoutEffect?',
    relatedTopicIds: ['b4-useeffect', 'b4-rendering-lifecycle'],
    answer: [
      {
        type: 'paragraph',
        text: 'Both run after React commits DOM updates. useLayoutEffect runs synchronously before the browser paints. useEffect runs after paint, so it does not block first paint.',
      },
      {
        type: 'list',
        items: [
          'useEffect: fetch, subscriptions, logging, most document.title updates.',
          'useLayoutEffect: measure layout and write styles before the user sees a frame (avoid flicker).',
          'Heavy work in useLayoutEffect delays paint and feels janky — keep it tiny.',
        ],
      },
    ],
  },
]
