import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '`this` is a runtime binding set by how a function is invoked (call site), not where it is written. It refers to the object that “owns” the current execution — or undefined/window in sloppy mode, or a bound value with call/apply/bind.',
  whyExists:
    'Methods need a way to refer to the receiver object. Prototype-based OOP, event handlers, and library APIs rely on `this` so one function body can operate on different objects depending on invocation.',
  mentalModel:
    'Ask “who called me?” — not “where was I defined?” For arrow functions, ask “what was `this` where I was written?” Arrow functions inherit lexical `this` and ignore call-site rules.',
  howItWorks: [
    {
      type: 'list',
      ordered: false,
      items: [
        'Default binding: standalone fn call — strict: undefined; sloppy: global (window).',
        'Implicit: obj.method() — this = obj (unless method extracted).',
        'Explicit: call/apply/bind — this = first arg.',
        'new binding: this = newly created object.',
        'Arrow: lexical this from enclosing scope; no own this.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Lost context',
      text: 'const fn = obj.method; fn() loses implicit binding. Fix with bind, wrapper arrow, or call with explicit this.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  Call[Call site]
  Call --> Default[Default: undefined/global]
  Call --> Implicit[Implicit: receiver object]
  Call --> Explicit[call/apply/bind]
  Call --> New[new → fresh object]
  Call --> Arrow[Arrow: lexical this]
  Implicit --> Lost{Extracted method?}
  Lost -->|yes| Default`,
    caption: 'this resolution depends on invocation, not definition',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Four binding rules',
      code: `'use strict';
function show() { console.log(this); }

show();                    // undefined (default)
const o = { name: 'A', show };
o.show();                  // { name: 'A', show }
show.call({ id: 1 });      // { id: 1 }
new show();                // show {} instance

const arrow = () => console.log(this);
arrow.call({ x: 1 });      // still outer this — ignores call`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Classic interview: extracted method',
      code: `const user = {
  name: 'Rishi',
  greet() { return this.name; },
};
const g = user.greet;
g(); // undefined (strict) — lost binding
user.greet(); // 'Rishi'`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '[[ThisValue]] set when entering function execution context.',
        'Arrow functions close over lexical this — no [[ThisBinding]] of their own.',
        'Class methods (non-static) use same implicit binding; static methods use class as this.',
        'bind returns a new function with fixed this (and optional partial args).',
      ],
    },
  ],
  templates: [
    {
      language: 'typescript',
      caption: 'Stable handler with bind or arrow in class',
      code: `class Store {
  items: string[] = [];
  // Option A: field arrow — lexical this = instance
  add = (item: string) => {
    this.items.push(item);
  };
  // Option B: constructor bind
  constructor() {
    this.remove = this.remove.bind(this);
  }
  remove(item: string) {
    this.items = this.items.filter((x) => x !== item);
  }
}`,
    },
    {
      language: 'javascript',
      caption: 'Explicit this for callbacks',
      code: `[1, 2, 3].forEach(function (n) {
  console.log(this.label, n);
}, { label: 'num' }); // this = { label: 'num' }`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Flexible method sharing across objects',
      'Native event/DOM patterns in browsers',
      'bind/call for partial application',
    ],
    disadvantages: [
      'Easy to lose context when passing callbacks',
      'Confusing mix of arrow vs regular in classes',
      'Differs from Java/C# instance methods mentally',
    ],
    alternatives: ['Arrow fields in classes', 'Explicit receiver param', 'OOP with classes + private fields'],
    whenToUse: ['Object methods, DOM listeners (with bind), library hooks expecting this'],
    whenNotToUse: ['Prefer arrows in React functional components — no this needed'],
  },
  failureModes: [
    'Passing obj.method as callback without bind.',
    'Using arrow as object method expecting dynamic this.',
    'Nested regular functions inside method shadowing this (pre-arrow fix).',
    'Assuming this inside setTimeout callback refers to outer method object.',
  ],
  production: {
    reliability: ['Consistent pattern in codebases: arrow fields OR bind in constructor'],
    maintainability: ['TypeScript noImplicitThis catches some mistakes'],
  },
  interview: {
    expectations: [
      'List binding rules: default, implicit, explicit, new, arrow',
      'Predict output of extracted method call',
      'Explain why arrow ignores call/apply/bind for this',
    ],
    commonQuestions: ['What is this?', 'Fix lost this in callback', 'Arrow vs regular function this'],
    followUps: ['How does this work in classes?', 'Strict mode effect on default binding?'],
    misconceptions: ['this always refers to the function object', 'Arrow functions have dynamic this'],
    traps: ['obj.method() vs (obj.method)() — grouping can change call site'],
    strongSignals: ['Mentions call site, lexical this for arrows, bind fix'],
  },
  keyTakeaways: [
    'this is determined by how a function is called.',
    'obj.method() binds this to obj; extracted method loses it.',
    'call/apply/bind set this explicitly.',
    'new sets this to new instance.',
    'Arrow functions inherit this lexically — no rebind.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What determines the value of this?',
      answerHint: 'Call site / invocation mode, not definition site (except arrows).',
    },
    {
      level: 'intermediate',
      question: 'Why does const fn = obj.log; fn() log undefined?',
      answerHint: 'Implicit binding lost; default binding in strict mode.',
    },
    {
      level: 'advanced',
      question: 'Can you change this inside an arrow function with bind?',
      answerHint: 'No — arrows ignore bind/call/apply for this; lexical only.',
    },
  ],
  flashcards: [
    { front: 'Default binding (strict)', back: 'undefined' },
    { front: 'obj.m()', back: 'this = obj' },
    { front: 'Arrow function this', back: 'Lexical from enclosing scope' },
  ],
  quickRevision: [
    'this = call site, not definition',
    'Default / implicit / explicit / new / arrow',
    'Extracted method loses implicit this',
    'bind fixes callbacks',
    'Arrow: lexical this, no bind',
    'Strict: standalone fn → undefined',
  ],
}
