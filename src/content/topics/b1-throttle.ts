import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Throttling",
  "whatIsIt": "Throttle ensures fn runs at most once per wait ms while events keep firing. Typical: scroll, resize. Leading throttle fires immediately then ignores until the window; trailing also fires the last event at the end. Unlike debounce, throttle keeps a heartbeat during the storm.",
  "whyExists": "Scroll can fire 100+ times a second. You still want periodic work, not only after the user stops.",
  "mentalModel": "A turnstile that unlocks once per interval. People keep arriving; only one gets through per tick (plus maybe the last one).",
  "how": [
    "Throttle scroll handlers; debounce search.",
    "rAF-throttle for visual work.",
    "Store lastRan timestamp or a locked flag.",
    "Cancel on unmount."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using debounce on scroll — the UI updates only after the user stops, feeling laggy.",
    "variant": "warning"
  },
  "example": "function throttle(fn, wait) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= wait) {\n      last = now;\n      fn(...args);\n    }\n  };\n}\nconst t = throttle((n) => console.log('tick', n), 50);\nfor (let i = 0; i < 5; i++) t(i);\n",
  "exampleCaption": "Leading throttle: first call in a burst runs",
  "internals": [
    "Timestamp vs timeout implementations differ on trailing-edge.",
    "requestAnimationFrame is vsync throttle, not ms throttle.",
    "Both patterns are user-space."
  ],
  "takeaways": [
    "Throttle scroll handlers; debounce search.",
    "rAF-throttle for visual work.",
    "Using debounce on scroll — the UI updates only after the user stops, feeling laggy.",
    "Timestamp vs timeout implementations differ on trailing-edge."
  ],
  "revision": [
    "Throttling: A turnstile that unlocks once per interval. People keep arriving; only one gets through per tick (plus maybe the last one).",
    "Throttle scroll handlers; debounce search.",
    "rAF-throttle for visual work.",
    "Store lastRan timestamp or a locked flag.",
    "Trap: Using debounce on scroll — the UI updates only after the user stops, feeling laggy."
  ],
  "flashcards": [
    [
      "Throttling",
      "Throttle ensures fn runs at most once per wait ms while events keep firing."
    ],
    [
      "Mental model",
      "A turnstile that unlocks once per interval. People keep arriving; only one gets through per tick (plus maybe the last one)."
    ],
    [
      "Common trap",
      "Using debounce on scroll — the UI updates only after the user stops, feeling laggy."
    ],
    [
      "Throttle scroll handlers; debounce search.",
      "rAF-throttle for visual work."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Throttling and where does a beginner first see it?",
      "answerHint": "Throttle ensures fn runs at most once per wait ms while events keep firing. Typical: scroll, resize. Leading throttle fires immediately then ignores until the window; trailing also fires the last event at the end. Unlike debounce, throttle keeps a heartbeat during the storm."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Throttling works and name the main pitfall.",
      "answerHint": "Throttle scroll handlers; debounce search. rAF-throttle for visual work. Store lastRan timestamp or a locked flag. Cancel on unmount. Pitfall: Using debounce on scroll — the UI updates only after the user stops, feeling laggy."
    },
    {
      "level": "advanced",
      "question": "How would you explain Throttling at an interview, including engine/spec details?",
      "answerHint": "Timestamp vs timeout implementations differ on trailing-edge. requestAnimationFrame is vsync throttle, not ms throttle. Both patterns are user-space."
    }
  ],
  "pitfalls": [
    "Using debounce on scroll — the UI updates only after the user stops, feeling laggy.",
    "Cancel on unmount."
  ],
  "interview": {
    "expectations": [
      "Explain Throttling without mixing it up with a nearby B1.40 — Performance Patterns topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Timestamp vs timeout implementations differ on trailing-edge."
    ],
    "commonQuestions": [
      "What is Throttling?",
      "Why does JavaScript throttling behave this way?",
      "What is the classic Throttling interview trap?"
    ],
    "traps": [
      "Using debounce on scroll — the UI updates only after the user stops, feeling laggy."
    ],
    "misconceptions": [
      "Scroll can fire 100+ times a second. You still want periodic work, not only after the user stops."
    ],
    "strongSignals": [
      "Separates Throttling from lookalike APIs and can draw the mental model."
    ]
  }
})
