import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Unix Timestamps",
  "whatIsIt": "Unix time in JS Date is milliseconds, not seconds. Date.now(), +d, d.getTime() are ms. APIs (JWT exp, some DBs) use seconds — multiply/divide by 1000. 32-bit second clocks overflow in 2038; JS ms in a double is fine far beyond that for second precision but not nanoseconds.",
  "whyExists": "C used seconds; JS Date used ms like Java. Mixing them is the off-by-1000 bug.",
  "mentalModel": "JS: 13-ish digit now(). Unix often: 10-digit seconds. Convert at the boundary.",
  "how": [
    "If a number is ~1e9, it is seconds; ~1e12 is ms (in this decade).",
    "new Date(seconds * 1000).",
    "Math.floor(Date.now()/1000) for second APIs.",
    "Do not store Date objects in JSON without a protocol."
  ],
  "callout": {
    "title": "Watch for",
    "text": "new Date(1710000000) is 1970 + 20 days, not 2024 — you forgot *1000.",
    "variant": "warning"
  },
  "example": "const ms = Date.now();\nconst s = Math.floor(ms / 1000);\nconsole.log(ms, s, new Date(s * 1000).toISOString());\nconsole.log(new Date(s).getFullYear()); // wrong: treated as ms\n",
  "exampleCaption": "Seconds vs ms constructor mix-up",
  "internals": [
    "TimeClip on the number of ms.",
    "IEEE double has millisecond precision for a wide date range.",
    "Temporal will expose Instant with nanoseconds as bigint."
  ],
  "takeaways": [
    "If a number is ~1e9, it is seconds; ~1e12 is ms (in this decade).",
    "new Date(seconds * 1000).",
    "new Date(1710000000) is 1970 + 20 days, not 2024 — you forgot *1000.",
    "TimeClip on the number of ms."
  ],
  "revision": [
    "Unix Timestamps: JS: 13-ish digit now(). Unix often: 10-digit seconds. Convert at the boundary.",
    "If a number is ~1e9, it is seconds; ~1e12 is ms (in this decade).",
    "new Date(seconds * 1000).",
    "Math.floor(Date.now()/1000) for second APIs.",
    "Trap: new Date(1710000000) is 1970 + 20 days, not 2024 — you forgot *1000."
  ],
  "flashcards": [
    [
      "Unix Timestamps",
      "Unix time in JS Date is milliseconds, not seconds."
    ],
    [
      "Mental model",
      "JS: 13-ish digit now(). Unix often: 10-digit seconds. Convert at the boundary."
    ],
    [
      "Common trap",
      "new Date(1710000000) is 1970 + 20 days, not 2024 — you forgot *1000."
    ],
    [
      "If a number is ~1e9, it is seconds; ~1e12 is ms (in this decade).",
      "new Date(seconds * 1000)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Unix Timestamps and where does a beginner first see it?",
      "answerHint": "Unix time in JS Date is milliseconds, not seconds. Date.now(), +d, d.getTime() are ms. APIs (JWT exp, some DBs) use seconds — multiply/divide by 1000. 32-bit second clocks overflow in 2038; JS ms in a double is fine far beyond that for second precision but not nanoseconds."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Unix Timestamps works and name the main pitfall.",
      "answerHint": "If a number is ~1e9, it is seconds; ~1e12 is ms (in this decade). new Date(seconds * 1000). Math.floor(Date.now()/1000) for second APIs. Do not store Date objects in JSON without a protocol. Pitfall: new Date(1710000000) is 1970 + 20 days, not 2024 — you forgot *1000."
    },
    {
      "level": "advanced",
      "question": "How would you explain Unix Timestamps at an interview, including engine/spec details?",
      "answerHint": "TimeClip on the number of ms. IEEE double has millisecond precision for a wide date range. Temporal will expose Instant with nanoseconds as bigint."
    }
  ],
  "pitfalls": [
    "new Date(1710000000) is 1970 + 20 days, not 2024 — you forgot *1000.",
    "Do not store Date objects in JSON without a protocol."
  ],
  "interview": {
    "expectations": [
      "Explain Unix Timestamps without mixing it up with a nearby B1.36 — Dates & Time topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "TimeClip on the number of ms."
    ],
    "commonQuestions": [
      "What is Unix Timestamps?",
      "Why does JavaScript unix timestamps behave this way?",
      "What is the classic Unix Timestamps interview trap?"
    ],
    "traps": [
      "new Date(1710000000) is 1970 + 20 days, not 2024 — you forgot *1000."
    ],
    "misconceptions": [
      "C used seconds; JS Date used ms like Java. Mixing them is the off-by-1000 bug."
    ],
    "strongSignals": [
      "Separates Unix Timestamps from lookalike APIs and can draw the mental model."
    ]
  }
})
