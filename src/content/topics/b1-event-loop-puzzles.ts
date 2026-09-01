import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Event-Loop Interview Puzzles",
  "whatIsIt": "Puzzles mix console.log, then, catch, setTimeout, queueMicrotask, and nested promises. Method: run all sync first, collect microtasks in FIFO, run them (they may enqueue more microtasks), then one macrotask, repeat. async functions jump to microtasks at each await. Draw two queues.",
  "whyExists": "Interviews test whether you internalized jobs vs tasks, not whether you memorized one viral tweet.",
  "mentalModel": "Two columns: Now | Micro | Macro. Simulate, don’t guess.",
  "how": [
    "Underline every then/await/timeout.",
    "Sync logs first.",
    "FIFO within each queue.",
    "New microtasks from a microtask run before the next timer."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Putting a timeout inside a then: that timeout is still a macrotask, not a microtask.",
    "variant": "warning"
  },
  "example": "console.log('1');\nsetTimeout(() => console.log('5'), 0);\nPromise.resolve().then(() => {\n  console.log('3');\n  setTimeout(() => console.log('6'), 0);\n});\nqueueMicrotask(() => console.log('4'));\nconsole.log('2');\n",
  "exampleCaption": "Classic 1 2 3 4 5 6 ordering",
  "internals": [
    "Promise then jobs enqueue when the promise fulfills, not when then is called if already settled — still a job.",
    "Already-resolved then still async (microtask), never sync.",
    "HTML rendering not shown in Node puzzles."
  ],
  "takeaways": [
    "Underline every then/await/timeout.",
    "Sync logs first.",
    "Putting a timeout inside a then: that timeout is still a macrotask, not a microtask.",
    "Promise then jobs enqueue when the promise fulfills, not when then is called if already settled — still a job."
  ],
  "revision": [
    "Event-Loop Interview Puzzles: Two columns: Now | Micro | Macro. Simulate, don’t guess.",
    "Underline every then/await/timeout.",
    "Sync logs first.",
    "FIFO within each queue.",
    "Trap: Putting a timeout inside a then: that timeout is still a macrotask, not a microtask."
  ],
  "flashcards": [
    [
      "Event-Loop Interview Puzzles",
      "Puzzles mix console.log, then, catch, setTimeout, queueMicrotask, and nested promises."
    ],
    [
      "Mental model",
      "Two columns: Now | Micro | Macro. Simulate, don’t guess."
    ],
    [
      "Common trap",
      "Putting a timeout inside a then: that timeout is still a macrotask, not a microtask."
    ],
    [
      "Underline every then/await/timeout.",
      "Sync logs first."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Event-Loop Interview Puzzles and where does a beginner first see it?",
      "answerHint": "Puzzles mix console.log, then, catch, setTimeout, queueMicrotask, and nested promises. Method: run all sync first, collect microtasks in FIFO, run them (they may enqueue more microtasks), then one macrotask, repeat. async functions jump to microtasks at each await. Draw two queues."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Event-Loop Interview Puzzles works and name the main pitfall.",
      "answerHint": "Underline every then/await/timeout. Sync logs first. FIFO within each queue. New microtasks from a microtask run before the next timer. Pitfall: Putting a timeout inside a then: that timeout is still a macrotask, not a microtask."
    },
    {
      "level": "advanced",
      "question": "How would you explain Event-Loop Interview Puzzles at an interview, including engine/spec details?",
      "answerHint": "Promise then jobs enqueue when the promise fulfills, not when then is called if already settled — still a job. Already-resolved then still async (microtask), never sync. HTML rendering not shown in Node puzzles."
    }
  ],
  "pitfalls": [
    "Putting a timeout inside a then: that timeout is still a macrotask, not a microtask.",
    "New microtasks from a microtask run before the next timer."
  ],
  "interview": {
    "expectations": [
      "Explain Event-Loop Interview Puzzles without mixing it up with a nearby B1.26 — Event Loop topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Promise then jobs enqueue when the promise fulfills, not when then is called if already settled — still a job."
    ],
    "commonQuestions": [
      "What is Event-Loop Interview Puzzles?",
      "Why does JavaScript event-loop interview puzzles behave this way?",
      "What is the classic Event-Loop Interview Puzzles interview trap?"
    ],
    "traps": [
      "Putting a timeout inside a then: that timeout is still a macrotask, not a microtask."
    ],
    "misconceptions": [
      "Interviews test whether you internalized jobs vs tasks, not whether you memorized one viral tweet."
    ],
    "strongSignals": [
      "Separates Event-Loop Interview Puzzles from lookalike APIs and can draw the mental model."
    ]
  }
})
