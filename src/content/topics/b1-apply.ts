import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '`Function.prototype.apply(thisArg, argsArray)` invokes a function immediately with an explicit `this` and arguments supplied as an array (or array-like). It is the array-argument twin of `call`.',
  whyExists:
    'Before rest parameters and spread syntax, apply was the standard way to pass a dynamic argument list stored in an array — e.g. Math.max on unknown-length arrays, variadic delegation, and legacy patterns with `arguments`.',
  mentalModel:
    'apply is call with the argument list packaged in one array: `fn.apply(obj, [1,2,3])` runs like `fn.call(obj, 1, 2, 3)`. Same instant execution, same this binding rules.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Second argument must be array-like (length + indexed elements) or null/undefined (no args).',
        'Invokes synchronously; returns function result.',
        'thisArg binding identical to call (strict vs sloppy).',
        'Typed arrays and arguments object work as array-like.',
        'Modern idiom: fn.call(thisArg, ...argsArray) or fn(...argsArray) when this is irrelevant.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Spread replaced most apply uses',
      text: 'Math.max(...nums) replaced Math.max.apply(null, nums). apply remains in interviews and older codebases.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Classic Math.max.apply',
      code: `const nums = [3, 7, 2, 9];
Math.max.apply(null, nums); // 9
Math.max(...nums);          // 9 — modern

function invoke(fn, args) {
  return fn.apply(null, args);
}
invoke(console.log, ['hello']); // hello`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Delegating with dynamic args',
      code: `class Logger {
  log(level, ...messages) {
    console[level].apply(console, messages);
  }
}
// Under the hood: borrow console method with this=console`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'ApplyOperation copies array-like to argument list — engines optimize common cases.',
        'null/undefined thisArg: sloppy → global; strict → null/undefined.',
        'Reflect.apply(fn, thisArg, args) — functional equivalent.',
        'Bound functions receive fixed this; apply cannot override bound this.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Natural fit when args already in array',
      'Historical max/min and push.apply patterns',
      'Same explicit this control as call',
    ],
    disadvantages: [
      'Less readable than spread for many devs',
      'Array-like requirement trips on plain objects',
      'Large arg arrays can hit stack limits (engine-dependent)',
    ],
    alternatives: ['fn.call(this, ...arr)', 'Reflect.apply', 'Spread for Math.max etc.'],
    whenToUse: ['Legacy interop, dynamic arg arrays, teaching this binding trio'],
    whenNotToUse: ['New code where spread is clearer; unbounded arrays to variadic (stack risk)'],
  },
  failureModes: [
    'Passing non-array-like second arg → TypeError.',
    'apply with huge arrays to functions — possible stack overflow.',
    'Forgetting console method needs this=console (apply fixes that).',
  ],
  production: {
    performance: ['Prefer spread; engines optimize both similarly today'],
    maintainability: ['Standardize on spread + call in new code for readability'],
    reliability: ['Validate array-like before apply in dynamic dispatchers'],
  },
  interview: {
    expectations: [
      'apply vs call difference is arg shape',
      'Math.max.apply example',
      'Know spread replacement',
    ],
    commonQuestions: ['apply vs call?', 'Find max in array without loop?', 'Implement apply?'],
    followUps: ['Stack limits with apply?', 'Reflect.apply use cases?'],
    misconceptions: ['apply is async', 'apply permanently binds this like bind'],
    traps: ['Confusing apply with bind'],
    strongSignals: ['Array args, immediate invoke, spread migration story'],
  },
  keyTakeaways: [
    'apply = call with args as array-like.',
    'Invokes immediately; does not return a new function.',
    'Math.max.apply(null, arr) → Math.max(...arr).',
    'Same this rules as call; arrows ignore thisArg.',
    'Reflect.apply is the reflective twin.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How does apply differ from call?',
      answerHint: 'Same this; apply takes array-like args, call takes arg list.',
    },
    {
      level: 'intermediate',
      question: 'How find max number in array using apply?',
      answerHint: 'Math.max.apply(null, nums) or Math.max(...nums).',
    },
    {
      level: 'advanced',
      question: 'Why might apply with a very large array be dangerous?',
      answerHint: 'Passing many args at once can exceed engine argument stack limits.',
    },
  ],
  flashcards: [
    { front: 'fn.apply(thisArg, argsArray)', back: 'Invoke now; args from array-like' },
    { front: 'Modern replace apply', back: 'fn.call(this, ...arr) or fn(...arr)' },
    { front: 'apply vs bind', back: 'apply runs now; bind returns deferred function' },
  ],
  quickRevision: [
    'apply: this + array-like args',
    'Immediate execution',
    'null this → global (sloppy) / null (strict)',
    'Spread replaces most apply',
    'Reflect.apply equivalent',
    'Huge arrays: stack risk',
  ],
}
