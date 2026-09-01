import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Minimum-Delay Misconception",
  "whatIsIt": "setTimeout(fn, 0) does not mean 0ms. Browsers clamp, especially nested timeouts (historically 4ms). The delay is a minimum until the timer is eligible, not a guarantee. A busy main thread makes it late. Node’s timers have their own phase and 1ms granularity stories.",
  "whyExists": "Spinning 0ms timers starved the page, so hosts imposed floors. Also OS timer resolution is finite.",
  "mentalModel": "‘0’ means ‘next chance after the clamp and after current work,’ not ‘preempt now.’",
  "how": [
    "Use queueMicrotask if you meant ‘after this stack, before paint/timers.’",
    "Use rAF for frames.",
    "Measure real delay if timing matters.",
    "Do not write tests that assume 0ms timeout runs before a then — it does not."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Benchmarking with setTimeout(0) as ‘immediate’ — it is not immediate vs promises.",
    "variant": "warning"
  },
  "example": "const t0 = Date.now();\nsetTimeout(() => console.log('delay', Date.now() - t0), 0);\nPromise.resolve().then(() => console.log('micro first', Date.now() - t0));\n",
  "exampleCaption": "Microtask still wins over timeout 0",
  "internals": [
    "HTML minimum delay and nesting-level rules.",
    "Timer eligibility vs task-queue picking.",
    "Date.now resolution can make small delays look 0 or 1ms."
  ],
  "takeaways": [
    "Use queueMicrotask if you meant ‘after this stack, before paint/timers.’",
    "Use rAF for frames.",
    "Benchmarking with setTimeout(0) as ‘immediate’ — it is not immediate vs promises.",
    "HTML minimum delay and nesting-level rules."
  ],
  "revision": [
    "Minimum-Delay Misconception: ‘0’ means ‘next chance after the clamp and after current work,’ not ‘preempt now.’",
    "Use queueMicrotask if you meant ‘after this stack, before paint/timers.’",
    "Use rAF for frames.",
    "Measure real delay if timing matters.",
    "Trap: Benchmarking with setTimeout(0) as ‘immediate’ — it is not immediate vs promises."
  ],
  "flashcards": [
    [
      "Minimum-Delay Misconception",
      "setTimeout(fn, 0) does not mean 0ms."
    ],
    [
      "Mental model",
      "‘0’ means ‘next chance after the clamp and after current work,’ not ‘preempt now.’"
    ],
    [
      "Common trap",
      "Benchmarking with setTimeout(0) as ‘immediate’ — it is not immediate vs promises."
    ],
    [
      "Use queueMicrotask if you meant ‘after this stack, before paint/timers.’",
      "Use rAF for frames."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Minimum-Delay Misconception and where does a beginner first see it?",
      "answerHint": "setTimeout(fn, 0) does not mean 0ms. Browsers clamp, especially nested timeouts (historically 4ms). The delay is a minimum until the timer is eligible, not a guarantee. A busy main thread makes it late. Node’s timers have their own phase and 1ms granularity stories."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Minimum-Delay Misconception works and name the main pitfall.",
      "answerHint": "Use queueMicrotask if you meant ‘after this stack, before paint/timers.’ Use rAF for frames. Measure real delay if timing matters. Do not write tests that assume 0ms timeout runs before a then — it does not. Pitfall: Benchmarking with setTimeout(0) as ‘immediate’ — it is not immediate vs promises."
    },
    {
      "level": "advanced",
      "question": "How would you explain Minimum-Delay Misconception at an interview, including engine/spec details?",
      "answerHint": "HTML minimum delay and nesting-level rules. Timer eligibility vs task-queue picking. Date.now resolution can make small delays look 0 or 1ms."
    }
  ],
  "pitfalls": [
    "Benchmarking with setTimeout(0) as ‘immediate’ — it is not immediate vs promises.",
    "Do not write tests that assume 0ms timeout runs before a then — it does not."
  ],
  "interview": {
    "expectations": [
      "Explain Minimum-Delay Misconception without mixing it up with a nearby B1.27 — Timers & Scheduling topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HTML minimum delay and nesting-level rules."
    ],
    "commonQuestions": [
      "What is Minimum-Delay Misconception?",
      "Why does JavaScript minimum-delay misconception behave this way?",
      "What is the classic Minimum-Delay Misconception interview trap?"
    ],
    "traps": [
      "Benchmarking with setTimeout(0) as ‘immediate’ — it is not immediate vs promises."
    ],
    "misconceptions": [
      "Spinning 0ms timers starved the page, so hosts imposed floors. Also OS timer resolution is finite."
    ],
    "strongSignals": [
      "Separates Minimum-Delay Misconception from lookalike APIs and can draw the mental model."
    ]
  }
})
