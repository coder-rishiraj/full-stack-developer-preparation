import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Intl.DateTimeFormat",
  "whatIsIt": "Intl.DateTimeFormat(locale, options) formats a Date (or ms) into a locale string: timeZone, dateStyle, hourCycle, weekday. It does not replace Date math. formatToParts gives tokens. Default locale is host-defined. Use it for display, not for round-trip serialization (prefer ISO).",
  "whyExists": "toLocaleString was under-specified. Intl is the standard i18n API for dates, numbers, lists.",
  "mentalModel": "A printer: you give an instant + locale/options, it types a human string. It is not a parser.",
  "how": [
    "new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', dateStyle: 'medium' }).format(d).",
    "Reuse the formatter; constructing it is relatively heavy.",
    "Do not parse the formatted string back.",
    "hour12 vs hourCycle for 12/24h."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Relying on exact format() string in tests — it can change with ICU data updates.",
    "variant": "warning"
  },
  "example": "const d = new Date('2020-01-02T15:04:05Z');\nconst fmt = new Intl.DateTimeFormat('en-US', {\n  timeZone: 'UTC',\n  dateStyle: 'short',\n  timeStyle: 'short',\n});\nconsole.log(fmt.format(d));\nconsole.log(fmt.formatToParts(d).map((p) => p.type).join(','));\n",
  "exampleCaption": "DateTimeFormat UTC short datetime + parts",
  "internals": [
    "ECMA-402 specifies Intl.",
    "Implementations use ICU/CLDR data.",
    "formatToParts is the stable-ish structure vs a single string."
  ],
  "takeaways": [
    "new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', dateStyle: 'medium' }).format(d).",
    "Reuse the formatter; constructing it is relatively heavy.",
    "Relying on exact format() string in tests — it can change with ICU data updates.",
    "ECMA-402 specifies Intl."
  ],
  "revision": [
    "Intl.DateTimeFormat: A printer: you give an instant + locale/options, it types a human string. It is not a parser.",
    "new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', dateStyle: 'medium' }).format(d).",
    "Reuse the formatter; constructing it is relatively heavy.",
    "Do not parse the formatted string back.",
    "Trap: Relying on exact format() string in tests — it can change with ICU data updates."
  ],
  "flashcards": [
    [
      "Intl.DateTimeFormat",
      "Intl.DateTimeFormat(locale, options) formats a Date (or ms) into a locale string: timeZone, dateStyle, hourCycle, weekday."
    ],
    [
      "Mental model",
      "A printer: you give an instant + locale/options, it types a human string. It is not a parser."
    ],
    [
      "Common trap",
      "Relying on exact format() string in tests — it can change with ICU data updates."
    ],
    [
      "new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', dateStyle: 'medium' }).forma",
      "Reuse the formatter; constructing it is relatively heavy."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Intl.DateTimeFormat and where does a beginner first see it?",
      "answerHint": "Intl.DateTimeFormat(locale, options) formats a Date (or ms) into a locale string: timeZone, dateStyle, hourCycle, weekday. It does not replace Date math. formatToParts gives tokens. Default locale is host-defined. Use it for display, not for round-trip serialization (prefer ISO)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Intl.DateTimeFormat works and name the main pitfall.",
      "answerHint": "new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', dateStyle: 'medium' }).format(d). Reuse the formatter; constructing it is relatively heavy. Do not parse the formatted string back. hour12 vs hourCycle for 12/24h. Pitfall: Relying on exact format() string in tests — it can change with ICU data updates."
    },
    {
      "level": "advanced",
      "question": "How would you explain Intl.DateTimeFormat at an interview, including engine/spec details?",
      "answerHint": "ECMA-402 specifies Intl. Implementations use ICU/CLDR data. formatToParts is the stable-ish structure vs a single string."
    }
  ],
  "pitfalls": [
    "Relying on exact format() string in tests — it can change with ICU data updates.",
    "hour12 vs hourCycle for 12/24h."
  ],
  "interview": {
    "expectations": [
      "Explain Intl.DateTimeFormat without mixing it up with a nearby B1.36 — Dates & Time topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ECMA-402 specifies Intl."
    ],
    "commonQuestions": [
      "What is Intl.DateTimeFormat?",
      "Why does JavaScript intl.datetimeformat behave this way?",
      "What is the classic Intl.DateTimeFormat interview trap?"
    ],
    "traps": [
      "Relying on exact format() string in tests — it can change with ICU data updates."
    ],
    "misconceptions": [
      "toLocaleString was under-specified. Intl is the standard i18n API for dates, numbers, lists."
    ],
    "strongSignals": [
      "Separates Intl.DateTimeFormat from lookalike APIs and can draw the mental model."
    ]
  }
})
