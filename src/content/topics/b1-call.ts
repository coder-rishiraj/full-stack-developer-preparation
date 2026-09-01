import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '`Function.prototype.call(thisArg, ...args)` invokes a function immediately with an explicit `this` value and arguments passed individually. It is one of three methods (call, apply, bind) for controlling `this` and borrowing methods.',
  whyExists:
    'In JavaScript, `this` is determined by call site, not definition. call lets you invoke any function with a chosen `this` — essential for borrowing array methods on array-likes, mixins, and classless patterns before arrow functions and classes dominated.',
  mentalModel:
    'Think of call as “run this function now, pretending you were called as a method on thisArg.” The spread args are the parentheses list: fn.call(obj, a, b) ≈ obj.fn(a, b) if fn were a method.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'call invokes synchronously — returns the function return value.',
        'thisArg: null/undefined in sloppy mode → global object; in strict mode stays null/undefined.',
        'Arguments after thisArg map to fn(arg1, arg2, ...).',
        'If fn is not callable, TypeError.',
        'Bound functions ignore further thisArg changes from call (hard-bound).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'call vs apply',
      text: 'Identical except apply takes args as an array: fn.apply(obj, [a, b]) ≡ fn.call(obj, a, b). Prefer call with spread in modern code: fn.call(obj, ...args).',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Borrowing Array.prototype.slice',
      code: `function listToArray() {
  return Array.prototype.slice.call(arguments);
}
listToArray(1, 2, 3); // [1, 2, 3]

// Modern equivalent
[...arguments]; // or Array.from(arguments)`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Explicit this in method borrowing',
      code: `const person = { name: 'Ada' };
function greet(greeting) {
  return \`\${greeting}, \${this.name}\`;
}
greet.call(person, 'Hello'); // "Hello, Ada"
greet.call(null, 'Hi');      // strict: "Hi, undefined"`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Spec: Call(fn, thisArg, args) — sets up execution context with chosen ThisBinding.',
        'Arrow functions have lexical this — call/apply/bind cannot rebind.',
        'Class methods and bound functions have fixed or auto-bound this in different ways.',
        'Proxy and Reflect.apply mirror call semantics for meta-programming.',
      ],
    },
  ],
  implementation: [
    {
      language: 'javascript',
      caption: 'Polyfill-style mental model',
      code: `Function.prototype.myCall = function (thisArg, ...args) {
  const fn = this;
  const obj = Object(thisArg); // null/undefined → object wrapper in sloppy polyfill
  const key = Symbol('fn');
  obj[key] = fn;
  try {
    return obj[key](...args);
  } finally {
    delete obj[key];
  }
};`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Immediate invocation with explicit this',
      'Method borrowing without copying functions',
      'Composable with spread for dynamic args',
    ],
    disadvantages: [
      'Verbose vs arrow functions for lexical this',
      'Lost if unbound callbacks passed around',
      'Polyfill patterns mutate temporary object',
    ],
    alternatives: ['Arrow functions', 'Class fields with arrow methods', 'bind for partial application'],
    whenToUse: ['Borrow methods, explicit this once, mixin invocation'],
    whenNotToUse: ['When arrow/class field already fixes this; prefer fn(...args) without this games'],
  },
  failureModes: [
    'Passing unbound method as callback — loses this (use bind or arrow field).',
    'Strict mode null this surprises vs sloppy global.',
    'Calling call on arrow — thisArg ignored silently.',
  ],
  production: {
    performance: ['call/apply negligible; avoid in tight loops if alternative exists'],
    maintainability: ['Prefer class fields / arrows over manual call in app code'],
    reliability: ['Always bind event handlers that need instance this'],
  },
  interview: {
    expectations: [
      'Explain call signature and immediate invoke',
      'Borrow slice on arguments',
      'call vs apply vs bind',
    ],
    commonQuestions: ['What does fn.call(obj, 1, 2) do?', 'Implement call polyfill?', 'Arrow + call?'],
    followUps: ['How is this set in strict mode?', 'Soft bind patterns?'],
    misconceptions: ['call changes function definition', 'apply and call differ in this binding'],
    traps: ['Confusing call with bind (bind returns new function)'],
    strongSignals: ['Immediate invoke, args list, strict thisArg, arrow lexical this'],
  },
  keyTakeaways: [
    'call invokes now with explicit this and arg list.',
    'apply same but args as array; spread + call replaces apply.',
    'bind returns a new function; call does not.',
    'Arrows ignore call/apply/bind thisArg.',
    'Method borrowing: Array.prototype.slice.call(arrayLike).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between call and bind?',
      answerHint: 'call invokes immediately; bind returns new function with fixed this/args.',
    },
    {
      level: 'intermediate',
      question: 'How do you use call to convert arguments to an array?',
      answerHint: 'Array.prototype.slice.call(arguments).',
    },
    {
      level: 'advanced',
      question: 'Why does call not change this on an arrow function?',
      answerHint: 'Arrow captures lexical this at creation; no own ThisBinding.',
    },
  ],
  flashcards: [
    { front: 'fn.call(thisArg, a, b)', back: 'Invoke fn now with this=thisArg, args a,b' },
    { front: 'call vs apply', back: 'apply: args array; call: args list (use spread)' },
    { front: 'Arrow + call', back: 'thisArg ignored — lexical this' },
  ],
  quickRevision: [
    'call = invoke + set this',
    'Args after thisArg individually',
    'Strict: null/undefined this stays',
    'bind returns function; call runs now',
    'Borrow methods via prototype.call',
    'Arrows: lexical this immutable',
  ],
}
