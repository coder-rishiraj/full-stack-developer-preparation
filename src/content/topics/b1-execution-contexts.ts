import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'An execution context is the environment in which JavaScript code runs — comprising variable environment (bindings), lexical environment (scope chain), `this` binding, and outer reference. Each function call and global script creates a new context pushed onto the call stack.',
  whyExists:
    'The engine must track which variables exist, what `this` means, and where to look up names for each running piece of code. Execution contexts isolate function invocations so local variables do not collide and closures capture the right outer environment.',
  mentalModel:
    'Every time code “enters” a running frame (global once, then each function call), the engine opens a fresh notebook: locals, parameters, this, and a link to outer notebooks for lookups. Pop the notebook when the function returns.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Creation phase: allocate environment record, hoist var/function declarations, set up scope chain and this.',
        'Execution phase: run statements, assign values, evaluate expressions.',
        'Global context: one per realm; `this` is window/global (or undefined in modules).',
        'Function context: this from call site (unless arrow); arguments object (non-arrow legacy).',
        'Context pop when function completes — but closure keeps environment alive on heap.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'EC vs scope',
      text: 'Scope is the static structure (lexical); execution context is the runtime instance of running code with its current bindings and this.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Global[Global EC]
  FnA[foo EC]
  FnB[bar EC]
  Stack[Call Stack]
  Heap[Heap: environments]
  Stack --> FnB
  Stack --> FnA
  Stack --> Global
  FnB -->|outer env| FnA
  FnA -->|outer env| Global
  FnA --> Heap
  FnB --> Heap`,
    caption: 'Call stack holds active contexts; outer links form scope chain',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Nested calls and this',
      code: `const obj = {
  name: 'ctx',
  greet() {
    console.log(this.name);
    function inner() {
      console.log(this); // strict: undefined; sloppy: global
    }
    inner();
  },
};
obj.greet(); // ctx, then undefined/global`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Closure retains environment after pop',
      code: `function outer(x) {
  return function inner(y) {
    return x + y; // outer EC bindings still on heap
  };
}
const add5 = outer(5);
add5(3); // 8 — outer context gone from stack but env alive`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Environment records: declarative (let/const), object (var in sloppy function), global.',
        'LexicalEnvironment vs VariableEnvironment split in spec; engines optimize.',
        'Arrow functions: no own this/arguments — use enclosing lexical this.',
        'Module context: top-level let/const in module scope; strict by default.',
        'Async/generator functions create additional internal state machines.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Clean isolation per invocation',
      'Enables closures and recursion',
      'Predictable this per call site (non-arrow)',
    ],
    disadvantages: [
      'Deep recursion exhausts stack (RangeError)',
      'this confusion in nested plain functions',
      'Heavy closure retention if environments large',
    ],
    alternatives: ['Trampolining for deep recursion', 'Arrow/ bind for stable this', 'Iterative rewrite'],
    whenToUse: ['Understanding hoisting, closures, this, stack overflow debugging'],
    whenNotToUse: ['Manual context simulation — engine handles it'],
  },
  failureModes: [
    'Stack overflow from unbounded recursion.',
    'Assuming inner function inherits method this.',
    'Memory leak: global EC never collects if references hold closures.',
  ],
  production: {
    performance: ['Limit recursion depth; tail calls not guaranteed optimized in JS engines'],
    reliability: ['Set stack size limits in Node for untrusted recursion'],
    observability: ['Stack traces map to execution contexts — source maps help async stacks'],
    cost: ['Many short-lived contexts are cheap; long-lived closure envs cost heap'],
  },
  interview: {
    expectations: [
      'Define execution context components',
      'Creation vs execution phase',
      'Relationship to call stack and closures',
    ],
    commonQuestions: ['What is execution context?', 'Global vs function context?', 'When is context created?'],
    followUps: ['Arrow function context?', 'Module vs script global?'],
    misconceptions: ['One context per function definition', 'Context same as scope object always'],
    traps: ['Confusing EC with execution stack frame implementation details'],
    strongSignals: ['Env record, this binding, outer reference, closure heap retention'],
  },
  keyTakeaways: [
    'Each run of global/function code gets an execution context.',
    'Components: bindings, scope chain link, this.',
    'Creation phase hoists; execution phase runs statements.',
    'Stack holds active contexts; closures keep env on heap.',
    'Arrow uses lexical this — no own function this binding.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What are the main parts of an execution context?',
      answerHint: 'Variable/lexical environment, scope chain outer, this binding.',
    },
    {
      level: 'intermediate',
      question: 'What happens to a function execution context when it returns?',
      answerHint: 'Popped from stack; environment may survive on heap if closure references it.',
    },
    {
      level: 'advanced',
      question: 'How does arrow function execution context differ?',
      answerHint: 'No own this/arguments/new.target; uses enclosing lexical this.',
    },
  ],
  flashcards: [
    { front: 'Execution context', back: 'Runtime env: bindings + scope + this' },
    { front: 'Creation phase', back: 'Hoist, allocate env, link outer' },
    { front: 'After return + closure', back: 'Stack pop; env may live on heap' },
  ],
  quickRevision: [
    'Global + per function call',
    'Creation then execution phase',
    'Env record + outer + this',
    'Call stack = active contexts',
    'Closure retains env on heap',
    'Arrow: lexical this',
  ],
}
