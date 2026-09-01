import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Debounce vs Throttle",
  "whatIsIt": "Debounce: wait for quiet, then one call (good for input). Throttle: cap rate during activity (good for scroll). If you need the last value after a throttled stream, add a trailing call (hybrid). Mixing names in interviews is the fail. rAF is a special throttle aligned to frames.",
  "whyExists": "Both limit how often work runs, but the UX intent differs: ‘after they pause’ vs ‘while they drag, periodically.’",
  "mentalModel": "Debounce = wait for the drumroll to stop. Throttle = sample the drumroll every N ms.",
  "how": [
    "Search box → debounce.",
    "Scroll position → throttle or rAF.",
    "Resize → debounce or rAF depending on layout cost.",
    "Say trailing vs leading when you implement."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview: ‘they’re the same.’ They are not — give one UI example each.",
    "variant": "warning"
  },
  "example": "const debounce = (fn, w) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), w); }; };\nconst throttle = (fn, w) => { let l = 0; return (...a) => { const n = Date.now(); if (n - l >= w) { l = n; fn(...a); } }; };\nconsole.log(typeof debounce(() => {}, 1), typeof throttle(() => {}, 1));\n",
  "exampleCaption": "Tiny debounce vs throttle signatures",
  "internals": [
    "Debounce coalesces to the last (or first) call in a quiet window.",
    "Throttle coalesces to at most one in a sliding/fixed window.",
    "Neither is in ECMA-262."
  ],
  "takeaways": [
    "Search box → debounce.",
    "Scroll position → throttle or rAF.",
    "Interview: ‘they’re the same.’ They are not — give one UI example each.",
    "Debounce coalesces to the last (or first) call in a quiet window."
  ],
  "revision": [
    "Debounce vs Throttle: Debounce = wait for the drumroll to stop. Throttle = sample the drumroll every N ms.",
    "Search box → debounce.",
    "Scroll position → throttle or rAF.",
    "Resize → debounce or rAF depending on layout cost.",
    "Trap: Interview: ‘they’re the same.’ They are not — give one UI example each."
  ],
  "flashcards": [
    [
      "Debounce vs Throttle",
      "Debounce: wait for quiet, then one call (good for input)."
    ],
    [
      "Mental model",
      "Debounce = wait for the drumroll to stop. Throttle = sample the drumroll every N ms."
    ],
    [
      "Common trap",
      "Interview: ‘they’re the same.’ They are not — give one UI example each."
    ],
    [
      "Search box → debounce.",
      "Scroll position → throttle or rAF."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Debounce vs Throttle and where does a beginner first see it?",
      "answerHint": "Debounce: wait for quiet, then one call (good for input). Throttle: cap rate during activity (good for scroll). If you need the last value after a throttled stream, add a trailing call (hybrid). Mixing names in interviews is the fail. rAF is a special throttle aligned to frames."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Debounce vs Throttle works and name the main pitfall.",
      "answerHint": "Search box → debounce. Scroll position → throttle or rAF. Resize → debounce or rAF depending on layout cost. Say trailing vs leading when you implement. Pitfall: Interview: ‘they’re the same.’ They are not — give one UI example each."
    },
    {
      "level": "advanced",
      "question": "How would you explain Debounce vs Throttle at an interview, including engine/spec details?",
      "answerHint": "Debounce coalesces to the last (or first) call in a quiet window. Throttle coalesces to at most one in a sliding/fixed window. Neither is in ECMA-262."
    }
  ],
  "pitfalls": [
    "Interview: ‘they’re the same.’ They are not — give one UI example each.",
    "Say trailing vs leading when you implement."
  ],
  "interview": {
    "expectations": [
      "Explain Debounce vs Throttle without mixing it up with a nearby B1.40 — Performance Patterns topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Debounce coalesces to the last (or first) call in a quiet window."
    ],
    "commonQuestions": [
      "What is Debounce vs Throttle?",
      "Why does JavaScript debounce vs throttle behave this way?",
      "What is the classic Debounce vs Throttle interview trap?"
    ],
    "traps": [
      "Interview: ‘they’re the same.’ They are not — give one UI example each."
    ],
    "misconceptions": [
      "Both limit how often work runs, but the UX intent differs: ‘after they pause’ vs ‘while they drag, periodically.’"
    ],
    "strongSignals": [
      "Separates Debounce vs Throttle from lookalike APIs and can draw the mental model."
    ]
  }
})
