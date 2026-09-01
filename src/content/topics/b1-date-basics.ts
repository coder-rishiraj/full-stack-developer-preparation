import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Date Basics",
  "whatIsIt": "Date is a mutable object wrapping a time value (ms since Unix epoch, UTC) plus local calendar methods. new Date() is now. new Date(iso) parses; new Date(y, mIndex, d) is local time and month is 0-based. Invalid dates are NaN time. Date.now() is a number, not a Date.",
  "whyExists": "The web needed timestamps. Java’s Date was copied, including the 0-based month bug.",
  "mentalModel": "A mutable box of ‘ms since 1970-01-01T00:00:00Z’ with getters in local or UTC flavors.",
  "how": [
    "Prefer Date.now() or new Date().toISOString() at APIs.",
    "Month is 0-based in the numbers constructor.",
    "Do not parse arbitrary strings with new Date(str) — it is implementation-defined except ISO.",
    "Copy dates: new Date(d) or d.getTime()."
  ],
  "callout": {
    "title": "Watch for",
    "text": "new Date(2020, 1, 1) is February, not January.",
    "variant": "warning"
  },
  "example": "const d = new Date('2020-01-02T00:00:00Z');\nconsole.log(d.toISOString(), d.getUTCFullYear(), d.getUTCMonth());\nconst local = new Date(2020, 0, 2);\nconsole.log(local.getFullYear(), local.getMonth(), local.getDate());\nconsole.log(Number.isNaN(new Date('nope').getTime()));\n",
  "exampleCaption": "ISO UTC vs local numbers constructor; invalid Date",
  "internals": [
    "[[DateValue]] is a time value or NaN.",
    "ES5 ISO8601 subset is specified; other strings are implementation-defined.",
    "Getters use local TZ offset unless UTC variants."
  ],
  "takeaways": [
    "Prefer Date.now() or new Date().toISOString() at APIs.",
    "Month is 0-based in the numbers constructor.",
    "new Date(2020, 1, 1) is February, not January.",
    "[[DateValue]] is a time value or NaN."
  ],
  "revision": [
    "Date Basics: A mutable box of ‘ms since 1970-01-01T00:00:00Z’ with getters in local or UTC flavors.",
    "Prefer Date.now() or new Date().toISOString() at APIs.",
    "Month is 0-based in the numbers constructor.",
    "Do not parse arbitrary strings with new Date(str) — it is implementation-defined except ISO.",
    "Trap: new Date(2020, 1, 1) is February, not January."
  ],
  "flashcards": [
    [
      "Date Basics",
      "Date is a mutable object wrapping a time value (ms since Unix epoch, UTC) plus local calendar methods."
    ],
    [
      "Mental model",
      "A mutable box of ‘ms since 1970-01-01T00:00:00Z’ with getters in local or UTC flavors."
    ],
    [
      "Common trap",
      "new Date(2020, 1, 1) is February, not January."
    ],
    [
      "Prefer Date.now() or new Date().toISOString() at APIs.",
      "Month is 0-based in the numbers constructor."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Date Basics and where does a beginner first see it?",
      "answerHint": "Date is a mutable object wrapping a time value (ms since Unix epoch, UTC) plus local calendar methods. new Date() is now. new Date(iso) parses; new Date(y, mIndex, d) is local time and month is 0-based. Invalid dates are NaN time. Date.now() is a number, not a Date."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Date Basics works and name the main pitfall.",
      "answerHint": "Prefer Date.now() or new Date().toISOString() at APIs. Month is 0-based in the numbers constructor. Do not parse arbitrary strings with new Date(str) — it is implementation-defined except ISO. Copy dates: new Date(d) or d.getTime(). Pitfall: new Date(2020, 1, 1) is February, not January."
    },
    {
      "level": "advanced",
      "question": "How would you explain Date Basics at an interview, including engine/spec details?",
      "answerHint": "[[DateValue]] is a time value or NaN. ES5 ISO8601 subset is specified; other strings are implementation-defined. Getters use local TZ offset unless UTC variants."
    }
  ],
  "pitfalls": [
    "new Date(2020, 1, 1) is February, not January.",
    "Copy dates: new Date(d) or d.getTime()."
  ],
  "interview": {
    "expectations": [
      "Explain Date Basics without mixing it up with a nearby B1.36 — Dates & Time topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[DateValue]] is a time value or NaN."
    ],
    "commonQuestions": [
      "What is Date Basics?",
      "Why does JavaScript date basics behave this way?",
      "What is the classic Date Basics interview trap?"
    ],
    "traps": [
      "new Date(2020, 1, 1) is February, not January."
    ],
    "misconceptions": [
      "The web needed timestamps. Java’s Date was copied, including the 0-based month bug."
    ],
    "strongSignals": [
      "Separates Date Basics from lookalike APIs and can draw the mental model."
    ]
  }
})
