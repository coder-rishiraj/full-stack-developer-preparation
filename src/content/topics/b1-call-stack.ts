import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The call stack is the LIFO structure tracking active function execution contexts. Each function call pushes a new frame; return pops it. Only the top frame runs — synchronous JS executes one frame at a time on a single thread.',
  whyExists:
    'Nested function calls need ordered return addresses, local variables, and scope. The stack gives fast push/pop for call/return discipline without manual bookkeeping.',
  mentalModel:
    'A stack of plates: the top plate is “who is running now.” Calling a function puts a plate on top; returning removes it. When the stack is empty, the event loop can run queued async callbacks.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Global/script code creates initial execution context → push.',
        'Function call: create context (locals, this, outer env) → push.',
        'Run bytecode until return or throw.',
        'return: pop frame; resume caller at return address.',
        'Uncaught throw: unwind stack (pop) until catch or crash.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Stack overflow',
      text: 'Infinite or very deep recursion exceeds stack limit → RangeError: Maximum call stack size exceeded.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Global[Global frame]
  A[fnA frame]
  B[fnB frame]
  Global --> A --> B
  B -->|return pop| A
  A -->|return pop| Global
  Global -->|empty| EL[Event loop picks async work]`,
    caption: 'LIFO: deepest callee on top',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Trace push/pop mentally',
      code: `function c() { console.log('c'); }
function b() { c(); console.log('b'); }
function a() { b(); console.log('a'); }
a();
// Output: c, b, a — unwinds after c returns`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Stack overflow',
      code: `function recurse() {
  return recurse();
}
recurse(); // RangeError: Maximum call stack size exceeded`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Each frame: LexicalEnvironment, VariableEnvironment, this, return slot.',
        'Heap holds objects; stack holds primitives and references (pointers).',
        'Tail-call optimization is not guaranteed in JS engines for interview purposes.',
        'Async functions suspend without blocking stack — state saved in Promise machinery.',
        'DevTools Call Stack panel shows current synchronous chain.',
      ],
    },
  ],
  implementation: [
    {
      language: 'javascript',
      caption: 'Replace deep recursion with iterative stack (DFS pattern)',
      code: `function dfsIterative(root) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    visit(node);
    for (const child of node.children ?? []) stack.push(child);
  }
}`,
    },
    {
      language: 'typescript',
      caption: 'Trampoline-style batching to avoid stack overflow',
      code: `async function processHuge(n: number) {
  for (let i = 0; i < n; i++) {
    work(i);
    if (i % 1000 === 0) await Promise.resolve(); // yield — clear stack pressure
  }
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Fast call/return with automatic cleanup',
      'Clear synchronous execution order',
      'Natural for nested expressions and calls',
    ],
    disadvantages: [
      'Limited depth — recursion can overflow',
      'Long-running sync on stack blocks everything',
      'No true parallel JS on one stack',
    ],
    alternatives: ['Explicit heap stack for deep traversal', 'Trampoline / async iteration', 'Web Workers'],
    whenToUse: ['Normal synchronous control flow'],
    whenNotToUse: ['Very deep recursion without iteration/trampoline'],
  },
  failureModes: [
    'Stack overflow from unbounded recursion.',
    'Blocking the call stack freezes UI, timers, and Promise reactions.',
    'Misreading stack trace top as “root cause” — often symptom deeper.',
    'Assuming async/await uses a second OS thread stack.',
  ],
  production: {
    performance: ['Break long sync tasks; use requestIdleCallback or chunking'],
    observability: ['Performance panel Long Tasks; stack samples in APM'],
    reliability: ['Guard recursion depth; iterative algorithms for trees/graphs'],
  },
  interview: {
    expectations: [
      'Define LIFO call stack',
      'Relate empty stack to event loop progress',
      'Explain stack overflow cause',
    ],
    commonQuestions: ['What happens on function return?', 'Why does infinite recursion crash?', 'Stack vs heap?'],
    followUps: ['Where do closures live if frame popped?', 'How does await affect the stack?'],
    misconceptions: ['Each Promise gets its own thread stack', 'Async code runs off the call stack entirely during await'],
    traps: ['Confusing call stack with scope chain', 'Thinking setTimeout runs on another stack'],
    strongSignals: ['Single-threaded sync execution, pop on return, empty stack enables microtasks'],
  },
  keyTakeaways: [
    'Call stack = active synchronous execution frames (LIFO).',
    'One frame runs at a time on the main JS thread.',
    'Return pops; throw unwinds until catch.',
    'Deep recursion → stack overflow.',
    'Empty stack lets event loop drain microtasks/macrotasks.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What structure tracks running functions in JS?',
      answerHint: 'Call stack — LIFO frames per invocation.',
    },
    {
      level: 'intermediate',
      question: 'Why does heavy synchronous code block timers?',
      answerHint: 'Stack never empties — event loop cannot run macrotasks.',
    },
    {
      level: 'advanced',
      question: 'Where do closure variables live after outer function returns?',
      answerHint: 'Heap — environment retained while inner fn references it; stack frame is gone.',
    },
  ],
  flashcards: [
    { front: 'Call stack order', back: 'LIFO — last called returns first' },
    { front: 'Stack overflow', back: 'Too many nested calls — RangeError' },
    { front: 'Stack vs heap', back: 'Stack: frames/refs; heap: objects' },
  ],
  quickRevision: [
    'LIFO call frames',
    'One sync frame at a time',
    'return pop; throw unwind',
    'Recursion depth limited',
    'Block stack → block event loop',
    'Closures on heap after pop',
  ],
}
