import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Microtask Starvation",
  "whatIsIt": "If every microtask enqueues another microtask, the checkpoint never finishes, so timers, I/O, and rendering never run. That is starvation. A resolved Promise.then chain that keeps going is enough. Yield with setTimeout/rAF/scheduler.yield to let macrotasks in.",
  "whyExists": "Microtasks have higher priority. Unbounded VIP traffic blocks the restaurant floor.",
  "mentalModel": "The VIP line keeps growing from within. Normal customers (paint, click, timeout) never get served.",
  "how": [
    "Do not recurse only via Promise.resolve().then(again).",
    "Batch work; schedule the next batch as a task.",
    "Watch infinite async function loops without a real await on I/O.",
    "await Promise.resolve() still stays in microtasks."
  ],
  "callout": {
    "title": "Watch for",
    "text": "await Promise.resolve() in a while(true) loop starves the page just like then-recursion.",
    "variant": "warning"
  },
  "example": "let n = 0;\nfunction starve(limit) {\n  if (n++ > limit) return;\n  Promise.resolve().then(() => starve(limit));\n}\nstarve(5);\nsetTimeout(() => console.log('timeout after chain, n=', n), 0);\nconsole.log('scheduled');\n",
  "exampleCaption": "A bounded then-chain; unbounded would delay the timeout forever",
  "internals": [
    "The microtask checkpoint loops until the queue is empty.",
    "There is no fairness with the task queue inside that loop.",
    "scheduler.yield() (when available) is designed to break this."
  ],
  "takeaways": [
    "Do not recurse only via Promise.resolve().then(again).",
    "Batch work; schedule the next batch as a task.",
    "await Promise.resolve() in a while(true) loop starves the page just like then-recursion.",
    "The microtask checkpoint loops until the queue is empty."
  ],
  "revision": [
    "Microtask Starvation: The VIP line keeps growing from within. Normal customers (paint, click, timeout) never get served.",
    "Do not recurse only via Promise.resolve().then(again).",
    "Batch work; schedule the next batch as a task.",
    "Watch infinite async function loops without a real await on I/O.",
    "Trap: await Promise.resolve() in a while(true) loop starves the page just like then-recursion."
  ],
  "flashcards": [
    [
      "Microtask Starvation",
      "If every microtask enqueues another microtask, the checkpoint never finishes, so timers, I/O, and rendering never run."
    ],
    [
      "Mental model",
      "The VIP line keeps growing from within. Normal customers (paint, click, timeout) never get served."
    ],
    [
      "Common trap",
      "await Promise.resolve() in a while(true) loop starves the page just like then-recursion."
    ],
    [
      "Do not recurse only via Promise.resolve().then(again).",
      "Batch work; schedule the next batch as a task."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Microtask Starvation and where does a beginner first see it?",
      "answerHint": "If every microtask enqueues another microtask, the checkpoint never finishes, so timers, I/O, and rendering never run. That is starvation. A resolved Promise.then chain that keeps going is enough. Yield with setTimeout/rAF/scheduler.yield to let macrotasks in."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Microtask Starvation works and name the main pitfall.",
      "answerHint": "Do not recurse only via Promise.resolve().then(again). Batch work; schedule the next batch as a task. Watch infinite async function loops without a real await on I/O. await Promise.resolve() still stays in microtasks. Pitfall: await Promise.resolve() in a while(true) loop starves the page just like then-recursion."
    },
    {
      "level": "advanced",
      "question": "How would you explain Microtask Starvation at an interview, including engine/spec details?",
      "answerHint": "The microtask checkpoint loops until the queue is empty. There is no fairness with the task queue inside that loop. scheduler.yield() (when available) is designed to break this."
    }
  ],
  "pitfalls": [
    "await Promise.resolve() in a while(true) loop starves the page just like then-recursion.",
    "await Promise.resolve() still stays in microtasks."
  ],
  "interview": {
    "expectations": [
      "Explain Microtask Starvation without mixing it up with a nearby B1.26 — Event Loop topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The microtask checkpoint loops until the queue is empty."
    ],
    "commonQuestions": [
      "What is Microtask Starvation?",
      "Why does JavaScript microtask starvation behave this way?",
      "What is the classic Microtask Starvation interview trap?"
    ],
    "traps": [
      "await Promise.resolve() in a while(true) loop starves the page just like then-recursion."
    ],
    "misconceptions": [
      "Microtasks have higher priority. Unbounded VIP traffic blocks the restaurant floor."
    ],
    "strongSignals": [
      "Separates Microtask Starvation from lookalike APIs and can draw the mental model."
    ]
  }
})
