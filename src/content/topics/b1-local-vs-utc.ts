import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Local Time vs UTC",
  "whatIsIt": "Local methods (getHours, toString) use the host timezone. UTC methods (getUTCHours, toISOString) use UTC. ISO strings with Z are UTC. Without a zone, date-only ISO (YYYY-MM-DD) is parsed as UTC in ES2015+, which can show the previous local day. Server apps often stick to UTC internally.",
  "whyExists": "Users live in zones; logs and APIs should not. Date tries to do both and confuses everyone.",
  "mentalModel": "One instant, two wall clocks: local living-room clock vs UTC control tower.",
  "how": [
    "Store UTC instants (ISO Z or ms).",
    "Format for display with Intl in the user’s locale/zone.",
    "Be careful with date-only strings.",
    "setHours vs setUTCHours."
  ],
  "callout": {
    "title": "Watch for",
    "text": "YYYY-MM-DD parsing as UTC midnight showing Dec 31 evening in US timezones.",
    "variant": "warning"
  },
  "example": "const d = new Date('2020-01-01T00:00:00Z');\nconsole.log(d.toISOString(), d.getUTCDate(), d.getDate());\nconst dateOnly = new Date('2020-01-01');\nconsole.log(dateOnly.toISOString());\n",
  "exampleCaption": "Same instant UTC vs local date; date-only parse",
  "internals": [
    "LocalTZA(t) host-defined offset, including DST.",
    "Date.parse of ISO date-only is UTC; date-time without Z is local.",
    "toISOString always UTC and throws on invalid."
  ],
  "takeaways": [
    "Store UTC instants (ISO Z or ms).",
    "Format for display with Intl in the user’s locale/zone.",
    "YYYY-MM-DD parsing as UTC midnight showing Dec 31 evening in US timezones.",
    "LocalTZA(t) host-defined offset, including DST."
  ],
  "revision": [
    "Local Time vs UTC: One instant, two wall clocks: local living-room clock vs UTC control tower.",
    "Store UTC instants (ISO Z or ms).",
    "Format for display with Intl in the user’s locale/zone.",
    "Be careful with date-only strings.",
    "Trap: YYYY-MM-DD parsing as UTC midnight showing Dec 31 evening in US timezones."
  ],
  "flashcards": [
    [
      "Local Time vs UTC",
      "Local methods (getHours, toString) use the host timezone."
    ],
    [
      "Mental model",
      "One instant, two wall clocks: local living-room clock vs UTC control tower."
    ],
    [
      "Common trap",
      "YYYY-MM-DD parsing as UTC midnight showing Dec 31 evening in US timezones."
    ],
    [
      "Store UTC instants (ISO Z or ms).",
      "Format for display with Intl in the user’s locale/zone."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Local Time vs UTC and where does a beginner first see it?",
      "answerHint": "Local methods (getHours, toString) use the host timezone. UTC methods (getUTCHours, toISOString) use UTC. ISO strings with Z are UTC. Without a zone, date-only ISO (YYYY-MM-DD) is parsed as UTC in ES2015+, which can show the previous local day. Server apps often stick to UTC internally."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Local Time vs UTC works and name the main pitfall.",
      "answerHint": "Store UTC instants (ISO Z or ms). Format for display with Intl in the user’s locale/zone. Be careful with date-only strings. setHours vs setUTCHours. Pitfall: YYYY-MM-DD parsing as UTC midnight showing Dec 31 evening in US timezones."
    },
    {
      "level": "advanced",
      "question": "How would you explain Local Time vs UTC at an interview, including engine/spec details?",
      "answerHint": "LocalTZA(t) host-defined offset, including DST. Date.parse of ISO date-only is UTC; date-time without Z is local. toISOString always UTC and throws on invalid."
    }
  ],
  "pitfalls": [
    "YYYY-MM-DD parsing as UTC midnight showing Dec 31 evening in US timezones.",
    "setHours vs setUTCHours."
  ],
  "interview": {
    "expectations": [
      "Explain Local Time vs UTC without mixing it up with a nearby B1.36 — Dates & Time topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "LocalTZA(t) host-defined offset, including DST."
    ],
    "commonQuestions": [
      "What is Local Time vs UTC?",
      "Why does JavaScript local time vs utc behave this way?",
      "What is the classic Local Time vs UTC interview trap?"
    ],
    "traps": [
      "YYYY-MM-DD parsing as UTC midnight showing Dec 31 evening in US timezones."
    ],
    "misconceptions": [
      "Users live in zones; logs and APIs should not. Date tries to do both and confuses everyone."
    ],
    "strongSignals": [
      "Separates Local Time vs UTC from lookalike APIs and can draw the mental model."
    ]
  }
})
