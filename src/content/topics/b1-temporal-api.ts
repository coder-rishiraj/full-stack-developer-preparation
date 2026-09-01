import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Temporal API Direction",
  "whatIsIt": "Temporal is a forthcoming (and partially shipping) API for PlainDate, PlainTime, Instant, ZonedDateTime, Duration — immutable, explicit time zones, no 0-based month. It is designed to replace most Date usage. Availability is still uneven; polyfills exist. Date remains for now.",
  "whyExists": "Date’s mutability, parse chaos, and DST math made every app depend on Moment then Luxon. Temporal is the language-level fix.",
  "mentalModel": "Separate types: a calendar date is not an instant. Instant is a timeline point. ZonedDateTime is instant + zone + calendar.",
  "how": [
    "Watch for Temporal.Now.instant() in supporting engines.",
    "Do not mix Date and Temporal without conversion (Instant.from).",
    "Keep using Date + Intl until your baseline supports Temporal.",
    "Prefer immutability: plus() returns a new object."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming Temporal is everywhere in 2024–2026 browsers — always detect.",
    "variant": "warning"
  },
  "example": "if (typeof Temporal !== 'undefined') {\n  const t = Temporal.Now.instant();\n  console.log(t.toString());\n} else {\n  console.log('Temporal not in this engine; Date.now()', Date.now());\n}\n",
  "exampleCaption": "Feature-detect Temporal vs Date.now fallback",
  "internals": [
    "Temporal is a TC39 proposal at stage 3/4 depending on the year — check current.",
    "ISO calendar vs others are first-class.",
    "No more [[DateValue]] mutation; records are immutable slots."
  ],
  "takeaways": [
    "Watch for Temporal.Now.instant() in supporting engines.",
    "Do not mix Date and Temporal without conversion (Instant.from).",
    "Assuming Temporal is everywhere in 2024–2026 browsers — always detect.",
    "Temporal is a TC39 proposal at stage 3/4 depending on the year — check current."
  ],
  "revision": [
    "Temporal API Direction: Separate types: a calendar date is not an instant. Instant is a timeline point. ZonedDateTime is instant + zone + calendar.",
    "Watch for Temporal.Now.instant() in supporting engines.",
    "Do not mix Date and Temporal without conversion (Instant.from).",
    "Keep using Date + Intl until your baseline supports Temporal.",
    "Trap: Assuming Temporal is everywhere in 2024–2026 browsers — always detect."
  ],
  "flashcards": [
    [
      "Temporal API Direction",
      "Temporal is a forthcoming (and partially shipping) API for PlainDate, PlainTime, Instant, ZonedDateTime, Duration — immutable, explicit time zones, no 0-based month."
    ],
    [
      "Mental model",
      "Separate types: a calendar date is not an instant. Instant is a timeline point. ZonedDateTime is instant + zone + calendar."
    ],
    [
      "Common trap",
      "Assuming Temporal is everywhere in 2024–2026 browsers — always detect."
    ],
    [
      "Watch for Temporal.Now.instant() in supporting engines.",
      "Do not mix Date and Temporal without conversion (Instant.from)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Temporal API Direction and where does a beginner first see it?",
      "answerHint": "Temporal is a forthcoming (and partially shipping) API for PlainDate, PlainTime, Instant, ZonedDateTime, Duration — immutable, explicit time zones, no 0-based month. It is designed to replace most Date usage. Availability is still uneven; polyfills exist. Date remains for now."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Temporal API Direction works and name the main pitfall.",
      "answerHint": "Watch for Temporal.Now.instant() in supporting engines. Do not mix Date and Temporal without conversion (Instant.from). Keep using Date + Intl until your baseline supports Temporal. Prefer immutability: plus() returns a new object. Pitfall: Assuming Temporal is everywhere in 2024–2026 browsers — always detect."
    },
    {
      "level": "advanced",
      "question": "How would you explain Temporal API Direction at an interview, including engine/spec details?",
      "answerHint": "Temporal is a TC39 proposal at stage 3/4 depending on the year — check current. ISO calendar vs others are first-class. No more [[DateValue]] mutation; records are immutable slots."
    }
  ],
  "pitfalls": [
    "Assuming Temporal is everywhere in 2024–2026 browsers — always detect.",
    "Prefer immutability: plus() returns a new object."
  ],
  "interview": {
    "expectations": [
      "Explain Temporal API Direction without mixing it up with a nearby B1.36 — Dates & Time topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Temporal is a TC39 proposal at stage 3/4 depending on the year — check current."
    ],
    "commonQuestions": [
      "What is Temporal API Direction?",
      "Why does JavaScript temporal api direction behave this way?",
      "What is the classic Temporal API Direction interview trap?"
    ],
    "traps": [
      "Assuming Temporal is everywhere in 2024–2026 browsers — always detect."
    ],
    "misconceptions": [
      "Date’s mutability, parse chaos, and DST math made every app depend on Moment then Luxon. Temporal is the language-level fix."
    ],
    "strongSignals": [
      "Separates Temporal API Direction from lookalike APIs and can draw the mental model."
    ]
  }
})
