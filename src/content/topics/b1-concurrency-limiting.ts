import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Concurrency Limiting",
  "whatIsIt": "A concurrency limiter runs at most N async jobs at once; extras wait. Implement with a queue plus a running count, or a pool of workers. Promise.all on thousands of fetches can exhaust sockets/memory. p-limit style: wrap fn so each call returns a promise that waits for a slot.",
  "whyExists": "Browsers and servers have connection limits. Unbounded all() is a self-DoS.",
  "mentalModel": "A nightclub with N wristbands. When one guest leaves, the next in line gets a band.",
  "how": [
    "Choose N (e.g. 4–8 for HTTP in browsers).",
    "Queue FIFO unless you have priorities.",
    "Error in one job should not leak slots (finally release).",
    "allSettled + limiter for batches."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Forgetting finally { active-- } leaks every slot after the first error.",
    "variant": "warning"
  },
  "example": "function limit(n) {\n  let active = 0;\n  const q = [];\n  const run = () => {\n    while (active < n && q.length) {\n      active += 1;\n      const { fn, resolve, reject } = q.shift();\n      Promise.resolve().then(fn).then(resolve, reject).finally(() => { active -= 1; run(); });\n    }\n  };\n  return (fn) => new Promise((resolve, reject) => { q.push({ fn, resolve, reject }); run(); });\n}\nconst l = limit(2);\nconst job = (v) => () => Promise.resolve(v);\nconsole.log(await Promise.all([1, 2, 3, 4].map((v) => l(job(v)))));\n",
  "exampleCaption": "Tiny pool of 2 wrapping four jobs",
  "internals": [
    "This is user-space scheduling on the single thread + async I/O.",
    "It does not create OS threads.",
    "Fairness is your queue’s policy."
  ],
  "takeaways": [
    "Choose N (e.g. 4–8 for HTTP in browsers).",
    "Queue FIFO unless you have priorities.",
    "Forgetting finally { active-- } leaks every slot after the first error.",
    "This is user-space scheduling on the single thread + async I/O."
  ],
  "revision": [
    "Concurrency Limiting: A nightclub with N wristbands. When one guest leaves, the next in line gets a band.",
    "Choose N (e.g. 4–8 for HTTP in browsers).",
    "Queue FIFO unless you have priorities.",
    "Error in one job should not leak slots (finally release).",
    "Trap: Forgetting finally { active-- } leaks every slot after the first error."
  ],
  "flashcards": [
    [
      "Concurrency Limiting",
      "A concurrency limiter runs at most N async jobs at once; extras wait."
    ],
    [
      "Mental model",
      "A nightclub with N wristbands. When one guest leaves, the next in line gets a band."
    ],
    [
      "Common trap",
      "Forgetting finally { active-- } leaks every slot after the first error."
    ],
    [
      "Choose N (e.g. 4–8 for HTTP in browsers).",
      "Queue FIFO unless you have priorities."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Concurrency Limiting and where does a beginner first see it?",
      "answerHint": "A concurrency limiter runs at most N async jobs at once; extras wait. Implement with a queue plus a running count, or a pool of workers. Promise.all on thousands of fetches can exhaust sockets/memory. p-limit style: wrap fn so each call returns a promise that waits for a slot."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Concurrency Limiting works and name the main pitfall.",
      "answerHint": "Choose N (e.g. 4–8 for HTTP in browsers). Queue FIFO unless you have priorities. Error in one job should not leak slots (finally release). allSettled + limiter for batches. Pitfall: Forgetting finally { active-- } leaks every slot after the first error."
    },
    {
      "level": "advanced",
      "question": "How would you explain Concurrency Limiting at an interview, including engine/spec details?",
      "answerHint": "This is user-space scheduling on the single thread + async I/O. It does not create OS threads. Fairness is your queue’s policy."
    }
  ],
  "pitfalls": [
    "Forgetting finally { active-- } leaks every slot after the first error.",
    "allSettled + limiter for batches."
  ],
  "interview": {
    "expectations": [
      "Explain Concurrency Limiting without mixing it up with a nearby B1.31 — Async Cancellation & Coordination topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "This is user-space scheduling on the single thread + async I/O."
    ],
    "commonQuestions": [
      "What is Concurrency Limiting?",
      "Why does JavaScript concurrency limiting behave this way?",
      "What is the classic Concurrency Limiting interview trap?"
    ],
    "traps": [
      "Forgetting finally { active-- } leaks every slot after the first error."
    ],
    "misconceptions": [
      "Browsers and servers have connection limits. Unbounded all() is a self-DoS."
    ],
    "strongSignals": [
      "Separates Concurrency Limiting from lookalike APIs and can draw the mental model."
    ]
  }
})
