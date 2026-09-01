import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A closure is a function bundled with its lexical environment — the outer variables it can still read and write after the outer function has returned. In JS, every function is a closure over the scope chain captured at creation time.',
  whyExists:
    'Languages need functions to access variables from enclosing scopes without passing everything as parameters. Closures enable data hiding, factories, callbacks, and module patterns while keeping the call stack simple.',
  mentalModel:
    'When a function is defined, the engine records “where I was born” (outer scopes). When it runs later — even from a timer or event handler — it still looks up variables through that frozen chain, not where it was called.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Outer function runs; local bindings live in its execution context.',
        'Inner function is created; engine links it to the outer environment (scope chain).',
        'Outer returns; its frame pops off the call stack, but referenced bindings stay alive on the heap.',
        'Inner function later reads/writes those bindings via the closure.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'let vs var in loops',
      text: 'var in a for-loop shares one binding; classic setTimeout(i) prints 3,3,3. let creates a new binding per iteration, so closures capture distinct values.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Outer[Outer fn scope]
  Inner[Inner fn]
  Heap[Heap: live bindings]
  Outer -->|captures| Inner
  Inner -->|reads via chain| Heap
  Stack[Call stack] -->|may be empty| Inner`,
    caption: 'Inner function outlives outer frame via heap-held environment',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Factory with private state',
      code: `function makeCounter(start = 0) {
  let count = start; // not reachable from outside
  return {
    inc() { return ++count; },
    get() { return count; },
  };
}
const c = makeCounter(10);
c.inc(); // 11 — closure keeps count alive`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Classic loop trap (var)',
      code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3 — one shared i

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0);
}
// 0, 1, 2 — per-iteration binding`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Environment records hold bindings; [[Environment]] on function objects points to outer LexicalEnvironment.',
        'Garbage collection keeps outer bindings while any inner function still references them.',
        'Closures capture variables (bindings), not snapshot values — unless you copy at creation (IIFE, default param).',
        'Module scope and block scope (let/const) create additional closure boundaries.',
      ],
    },
  ],
  templates: [
    {
      language: 'typescript',
      caption: 'Memoization via closure',
      code: `function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}`,
    },
    {
      language: 'javascript',
      caption: 'Once-only initializer pattern',
      code: `function once(fn) {
  let called = false;
  let value;
  return (...args) => {
    if (!called) {
      value = fn(...args);
      called = true;
    }
    return value;
  };
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Encapsulation without classes',
      'Stable callbacks that remember context',
      'Functional patterns (currying, partial application)',
    ],
    disadvantages: [
      'Accidental memory retention if closures hold large objects',
      'Loop + var bugs confuse beginners',
      'Harder to debug long-lived hidden state',
    ],
    alternatives: ['Classes with private fields (#count)', 'Explicit context objects passed in'],
    whenToUse: ['Factories, event handlers, React hooks, module pattern'],
    whenNotToUse: ['When passing plain data is clearer; avoid retaining DOM nodes unnecessarily'],
  },
  failureModes: [
    'Stale closure in React useEffect missing deps — reads old state.',
    'Memory leak: closure in global registry holds entire component tree.',
    'Sharing mutable object across closures without copying.',
    'Assuming closure captures value at creation for var loop index.',
  ],
  production: {
    performance: ['Drop references when listeners unmount', 'Avoid closing over huge arrays in hot paths'],
    reliability: ['Document intentional hidden mutable state'],
    maintainability: ['Prefer explicit deps in hooks; use eslint-plugin-react-hooks'],
  },
  interview: {
    expectations: [
      'Define closure in one sentence with lexical environment',
      'Explain var loop + setTimeout output',
      'Describe how makeCounter keeps private count',
    ],
    commonQuestions: ['What is a closure?', 'Fix the loop/setTimeout bug', 'Can closures cause memory leaks?'],
    followUps: ['How do arrow functions differ for this?', 'Module scope vs closure?'],
    misconceptions: ['Closures copy values at creation time always'],
    traps: ['Confusing scope chain with call stack', 'Thinking only inner functions are closures'],
    strongSignals: ['Mentions bindings vs values, GC retention, let per-iteration'],
  },
  keyTakeaways: [
    'Functions remember their birth environment.',
    'Closures enable private state and stable callbacks.',
    'var in loops shares one binding; let creates per-iteration bindings.',
    'Closures retain references — can leak memory if abused.',
    'Every JS function is a closure over its lexical scope.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is a closure?',
      answerHint: 'Function plus access to outer lexical bindings after outer returns.',
    },
    {
      level: 'intermediate',
      question: 'Why does setTimeout in a var for-loop log the same number?',
      answerHint: 'One shared i; closures read live binding at callback time.',
    },
    {
      level: 'advanced',
      question: 'How can closures cause memory leaks in SPAs?',
      answerHint: 'Long-lived callbacks/registries hold graphs alive; detach listeners and null refs.',
    },
  ],
  flashcards: [
    { front: 'Closure definition', back: 'Fn + lexical environment it closes over' },
    { front: 'var loop + async callback', back: 'Shared binding → same final value' },
    { front: 'let loop + async callback', back: 'New binding per iteration' },
  ],
  quickRevision: [
    'Fn remembers lexical scope at creation',
    'Outer locals survive if inner still references',
    'var loop: one i; let loop: per-iteration',
    'Factories hide state via closure',
    'Stale closures in React — fix deps',
    'GC keeps env while closure lives',
  ],
}
