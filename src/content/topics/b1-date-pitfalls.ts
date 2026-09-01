import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Date Arithmetic Pitfalls",
  "whatIsIt": "0-based months, mutating setters (setDate overflows into next month), DST holes/overlaps making local add-an-hour skip, string parse inconsistency, mixing timestamps units, invalid Date that still is a Date object, and sort of dates as strings. Adding days: use UTC date math or libraries; setHours(24) is a hack.",
  "whyExists": "Civil time is political (DST). JS Date is a thin instant + local calendar, not a calendar library.",
  "mentalModel": "A stopwatch (instant) wearing a broken calendar hat (local fields). The hat lies around DST.",
  "how": [
    "Add days via UTC: d.setUTCDate(d.getUTCDate() + n).",
    "Do not parse '01/02/2020' without a known locale.",
    "Immutable: copy before set*.",
    "Prefer Temporal or a well-tested library for business calendars."
  ],
  "callout": {
    "title": "Watch for",
    "text": "setMonth(1) on Jan 31 becomes March 2/3 in some cases because February has no 31 — overflow.",
    "variant": "warning"
  },
  "example": "const d = new Date(Date.UTC(2020, 0, 31));\nd.setUTCMonth(1);\nconsole.log(d.toISOString());\nconst a = new Date('2020-03-08T00:00:00');\na.setHours(a.getHours() + 24);\nconsole.log(a.toString());\n",
  "exampleCaption": "setUTCMonth overflow; local +24h across DST (host-dependent)",
  "internals": [
    "MakeDate / MakeDay overflow is specified (not clamped).",
    "Local time conversion uses host TZ database.",
    "Date objects are mutable — sharing them is aliasing."
  ],
  "takeaways": [
    "Add days via UTC: d.setUTCDate(d.getUTCDate() + n).",
    "Do not parse '01/02/2020' without a known locale.",
    "setMonth(1) on Jan 31 becomes March 2/3 in some cases because February has no 31 — overflow.",
    "MakeDate / MakeDay overflow is specified (not clamped)."
  ],
  "revision": [
    "Date Arithmetic Pitfalls: A stopwatch (instant) wearing a broken calendar hat (local fields). The hat lies around DST.",
    "Add days via UTC: d.setUTCDate(d.getUTCDate() + n).",
    "Do not parse '01/02/2020' without a known locale.",
    "Immutable: copy before set*.",
    "Trap: setMonth(1) on Jan 31 becomes March 2/3 in some cases because February has no 31 — overflow."
  ],
  "flashcards": [
    [
      "Date Arithmetic Pitfalls",
      "0-based months, mutating setters (setDate overflows into next month), DST holes/overlaps making local add-an-hour skip, string parse inconsistency, mixing timestamps units, invalid Date that still is a Date object, and sort of dates as strings."
    ],
    [
      "Mental model",
      "A stopwatch (instant) wearing a broken calendar hat (local fields). The hat lies around DST."
    ],
    [
      "Common trap",
      "setMonth(1) on Jan 31 becomes March 2/3 in some cases because February has no 31 — overflow."
    ],
    [
      "Add days via UTC: d.setUTCDate(d.getUTCDate() + n).",
      "Do not parse '01/02/2020' without a known locale."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Date Arithmetic Pitfalls and where does a beginner first see it?",
      "answerHint": "0-based months, mutating setters (setDate overflows into next month), DST holes/overlaps making local add-an-hour skip, string parse inconsistency, mixing timestamps units, invalid Date that still is a Date object, and sort of dates as strings. Adding days: use UTC date math or libraries; setHours(24) is a hack."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Date Arithmetic Pitfalls works and name the main pitfall.",
      "answerHint": "Add days via UTC: d.setUTCDate(d.getUTCDate() + n). Do not parse '01/02/2020' without a known locale. Immutable: copy before set*. Prefer Temporal or a well-tested library for business calendars. Pitfall: setMonth(1) on Jan 31 becomes March 2/3 in some cases because February has no 31 — overflow."
    },
    {
      "level": "advanced",
      "question": "How would you explain Date Arithmetic Pitfalls at an interview, including engine/spec details?",
      "answerHint": "MakeDate / MakeDay overflow is specified (not clamped). Local time conversion uses host TZ database. Date objects are mutable — sharing them is aliasing."
    }
  ],
  "pitfalls": [
    "setMonth(1) on Jan 31 becomes March 2/3 in some cases because February has no 31 — overflow.",
    "Prefer Temporal or a well-tested library for business calendars."
  ],
  "interview": {
    "expectations": [
      "Explain Date Arithmetic Pitfalls without mixing it up with a nearby B1.36 — Dates & Time topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "MakeDate / MakeDay overflow is specified (not clamped)."
    ],
    "commonQuestions": [
      "What is Date Arithmetic Pitfalls?",
      "Why does JavaScript date arithmetic pitfalls behave this way?",
      "What is the classic Date Arithmetic Pitfalls interview trap?"
    ],
    "traps": [
      "setMonth(1) on Jan 31 becomes March 2/3 in some cases because February has no 31 — overflow."
    ],
    "misconceptions": [
      "Civil time is political (DST). JS Date is a thin instant + local calendar, not a calendar library."
    ],
    "strongSignals": [
      "Separates Date Arithmetic Pitfalls from lookalike APIs and can draw the mental model."
    ]
  }
})
