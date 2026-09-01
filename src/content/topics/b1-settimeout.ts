import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "setTimeout / clearTimeout",
  "whatIsIt": "setTimeout(fn, ms, ...args) schedules a task to run after at least ms milliseconds (clamped, nested timeouts have a minimum). It returns an id for clearTimeout. fn runs with host-defined this. Delay 0 still waits for the current stack, microtasks, and the timer phase. It does not pause code.",
  "whyExists": "The web needed deferred work and animations-before-rAF. Timers are the original ‘later’ API.",
  "mentalModel": "A kitchen timer that queues fn onto the task list when it rings — if the loop is busy, it rings late.",
  "how": [
    "Store the id and clearTimeout on unmount.",
    "Pass extra args instead of closing over if it helps.",
    "Do not use timeout as a sleep in a busy loop.",
    "Wrap in Promises for await sleep(ms)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "clearTimeout after the callback already ran is a no-op — the work happened.",
    "variant": "warning"
  },
  "example": "const id = setTimeout((x) => console.log('later', x), 20, 7);\nconsole.log('now', id);\nconst sleep = (ms) => new Promise((r) => setTimeout(r, ms));\nawait sleep(10);\nconsole.log('slept');\nclearTimeout(id);\n",
  "exampleCaption": "setTimeout id, extra arg, promise sleep, clear",
  "internals": [
    "HTML timer nesting: after 5 nested timeouts, minimum delay is 4ms in browsers historically.",
    "The callback is a task, not a microtask.",
    "Node Timeout objects vs numeric ids in browsers."
  ],
  "takeaways": [
    "Store the id and clearTimeout on unmount.",
    "Pass extra args instead of closing over if it helps.",
    "clearTimeout after the callback already ran is a no-op — the work happened.",
    "HTML timer nesting: after 5 nested timeouts, minimum delay is 4ms in browsers historically."
  ],
  "revision": [
    "setTimeout / clearTimeout: A kitchen timer that queues fn onto the task list when it rings — if the loop is busy, it rings late.",
    "Store the id and clearTimeout on unmount.",
    "Pass extra args instead of closing over if it helps.",
    "Do not use timeout as a sleep in a busy loop.",
    "Trap: clearTimeout after the callback already ran is a no-op — the work happened."
  ],
  "flashcards": [
    [
      "setTimeout / clearTimeout",
      "setTimeout(fn, ms, ...args) schedules a task to run after at least ms milliseconds (clamped, nested timeouts have a minimum)."
    ],
    [
      "Mental model",
      "A kitchen timer that queues fn onto the task list when it rings — if the loop is busy, it rings late."
    ],
    [
      "Common trap",
      "clearTimeout after the callback already ran is a no-op — the work happened."
    ],
    [
      "Store the id and clearTimeout on unmount.",
      "Pass extra args instead of closing over if it helps."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is setTimeout / clearTimeout and where does a beginner first see it?",
      "answerHint": "setTimeout(fn, ms, ...args) schedules a task to run after at least ms milliseconds (clamped, nested timeouts have a minimum). It returns an id for clearTimeout. fn runs with host-defined this. Delay 0 still waits for the current stack, microtasks, and the timer phase. It does not pause code."
    },
    {
      "level": "intermediate",
      "question": "Walk through how setTimeout / clearTimeout works and name the main pitfall.",
      "answerHint": "Store the id and clearTimeout on unmount. Pass extra args instead of closing over if it helps. Do not use timeout as a sleep in a busy loop. Wrap in Promises for await sleep(ms). Pitfall: clearTimeout after the callback already ran is a no-op — the work happened."
    },
    {
      "level": "advanced",
      "question": "How would you explain setTimeout / clearTimeout at an interview, including engine/spec details?",
      "answerHint": "HTML timer nesting: after 5 nested timeouts, minimum delay is 4ms in browsers historically. The callback is a task, not a microtask. Node Timeout objects vs numeric ids in browsers."
    }
  ],
  "pitfalls": [
    "clearTimeout after the callback already ran is a no-op — the work happened.",
    "Wrap in Promises for await sleep(ms)."
  ],
  "interview": {
    "expectations": [
      "Explain setTimeout / clearTimeout without mixing it up with a nearby B1.27 — Timers & Scheduling topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HTML timer nesting: after 5 nested timeouts, minimum delay is 4ms in browsers historically."
    ],
    "commonQuestions": [
      "What is setTimeout / clearTimeout?",
      "Why does JavaScript settimeout / cleartimeout behave this way?",
      "What is the classic setTimeout / clearTimeout interview trap?"
    ],
    "traps": [
      "clearTimeout after the callback already ran is a no-op — the work happened."
    ],
    "misconceptions": [
      "The web needed deferred work and animations-before-rAF. Timers are the original ‘later’ API."
    ],
    "strongSignals": [
      "Separates setTimeout / clearTimeout from lookalike APIs and can draw the mental model."
    ]
  }
})
