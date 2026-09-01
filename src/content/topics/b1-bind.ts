import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '`Function.prototype.bind(thisArg, ...partialArgs)` returns a new function with fixed `this` and optionally pre-filled arguments (partial application). The bound function can be called later; bind does not invoke immediately.',
  whyExists:
    'Callbacks and event handlers often lose the original `this` when passed as bare references (e.g. `button.onclick = obj.handleClick`). bind creates a stable wrapper that preserves context without wrapper arrows in every line of legacy code.',
  mentalModel:
    'bind manufactures a new function with sticky notes: “when called, always use thisArg as this, and prepend these partial args.” Like call, but deferred — and the result remembers forever (unless further bound).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Returns a new function; original unchanged.',
        'Bound function this is fixed (hard-bound) — call/apply cannot override.',
        'Partial args prepended; later call args append: bind(fn, a)(b, c) → fn(a, b, c).',
        'bind on arrow: returns bound wrapper but inner this still lexical (rare pattern).',
        'Constructor hint: bound functions ignore new (this stays bound) unless used with new on constructible targets — edge case.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'React class components',
      text: 'Classic pattern: `this.handleClick = this.handleClick.bind(this)` in constructor. Modern: class field arrow `handleClick = () => {}` captures instance this lexically.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Orig[Original fn]
  Bind[bind thisArg partialArgs]
  NewFn[Bound function]
  Call[Later invocation]
  Orig --> Bind --> NewFn
  NewFn --> Call
  Call -->|fixed this + merged args| Orig`,
    caption: 'bind produces a new function; invocation happens later',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Preserving this in callbacks',
      code: `const counter = {
  count: 0,
  inc() { this.count++; },
};
const broken = counter.inc;
broken(); // NaN or error — this is global/undefined

const fixed = counter.inc.bind(counter);
fixed();
console.log(counter.count); // 1`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Partial application',
      code: `function multiply(a, b) { return a * b; }
const double = multiply.bind(null, 2);
double(5);  // 10
double(7);  // 14

// bind(null, 2) — this unused for pure fn`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Bound function has [[BoundThis]] and [[BoundArgs]] internal slots.',
        'Prototype chain: bound function prototype may differ; instanceof checks can break on bound constructors.',
        'Soft bind libraries re-bind on each call for configurable this — not native.',
        'Function.length of bound fn reflects remaining arity after partial args.',
      ],
    },
  ],
  implementation: [
    {
      language: 'javascript',
      caption: 'Simplified bind polyfill sketch',
      code: `Function.prototype.myBind = function (thisArg, ...partial) {
  const fn = this;
  return function bound(...rest) {
    return fn.apply(thisArg, [...partial, ...rest]);
  };
};`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Stable this for callbacks without wrapper functions',
      'Partial application in one step',
      'Composable with other higher-order patterns',
    ],
    disadvantages: [
      'Extra function allocation per bind',
      'Hard to unbind; debugging stack shows bound layer',
      'Class field arrows often clearer in modern React',
    ],
    alternatives: ['Arrow functions in class fields', 'Wrapper `(e) => obj.method(e)`', 'WeakMap for context'],
    whenToUse: ['Legacy callbacks, partial application, module export with fixed this'],
    whenNotToUse: ['When arrow or explicit wrapper reads better; hot path millions of binds'],
  },
  failureModes: [
    'Double bind confusion — inner this already fixed.',
    'Binding in render every time — new function breaks React memo/ref equality.',
    'Forgetting bind on class method passed to child props.',
  ],
  production: {
    performance: ['Bind once in constructor/field init, not per render'],
    maintainability: ['Prefer class field arrows in React TS codebases'],
    reliability: ['Ensure event listener remove uses same bound reference'],
  },
  interview: {
    expectations: [
      'bind returns new fn, does not invoke',
      'Fix lost-this callback bug',
      'Partial application example',
    ],
    commonQuestions: ['call vs apply vs bind?', 'Why bind in React constructor?', 'Implement bind?'],
    followUps: ['Can you override bound this with call?', 'bind vs arrow for methods?'],
    misconceptions: ['bind executes the function', 'call and bind both defer'],
    traps: ['Creating new bind each render in React'],
    strongSignals: ['Hard-bound this, partial args, deferred invoke'],
  },
  keyTakeaways: [
    'bind returns new function with fixed this (+ optional partial args).',
    'Does not run immediately — unlike call/apply.',
    'Bound this cannot be changed by call/apply.',
    'React: bind once or use class field arrow.',
    'Partial application: multiply.bind(null, 2).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does Function.prototype.bind return?',
      answerHint: 'New function with fixed this; optional pre-set arguments.',
    },
    {
      level: 'intermediate',
      question: 'Why does `const fn = obj.method; fn()` fail?',
      answerHint: 'Method detached — this is not obj; fix with bind or arrow field.',
    },
    {
      level: 'advanced',
      question: 'Can call/apply change the this of a bound function?',
      answerHint: 'No — hard-bound; thisArg ignored for bound targets.',
    },
  ],
  flashcards: [
    { front: 'bind vs call', back: 'bind: returns fn; call: invokes now' },
    { front: 'Partial application via bind', back: 'fn.bind(null, a)(b) → fn(a, b)' },
    { front: 'Bound this override?', back: 'No — hard-bound' },
  ],
  quickRevision: [
    'bind → new function, deferred',
    'Fixed this + partial args',
    'call/apply cannot rebind',
    'Lost this: bind or arrow',
    'Don’t bind in render loop',
    'Partial: bind(null, preset)',
  ],
}
