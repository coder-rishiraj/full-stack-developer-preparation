import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Searching Strings",
  "whatIsIt": "indexOf/lastIndexOf return a code-unit index or -1. includes/startsWith/endsWith return booleans and accept a start index. search takes a regex and returns an index. match/matchAll belong with regex. All are case-sensitive unless you normalize case or use /i.",
  "whyExists": "Finding a needle in text is the most common string task. Boolean helpers were added because indexOf === -1 was noisy.",
  "mentalModel": "A cursor walking UTF-16 cells. -1 means ‘not found,’ never 0 — 0 is a valid hit at the start.",
  "how": [
    "Use includes for existence; indexOf when you need the position.",
    "Never if (s.indexOf(x)) — 0 is found-at-start and falsy.",
    "startsWith is not a regex; escape nothing.",
    "Case-fold with toLowerCase only for ASCII-ish data; otherwise locale rules."
  ],
  "callout": {
    "title": "Watch for",
    "text": "if (str.indexOf(substr)) fails when the substring sits at index 0.",
    "variant": "warning"
  },
  "example": "const s = 'JavaScript';\nconsole.log(s.indexOf('a'), s.indexOf('z'), s.lastIndexOf('a'));\nconsole.log(s.includes('Script'), s.startsWith('Java'), s.endsWith('pt'));\nconsole.log(Boolean(s.indexOf('J')), s.indexOf('J'));\nconsole.log(s.search(/script/i));\n",
  "exampleCaption": "indexOf 0 is a hit; includes/startsWith/endsWith",
  "internals": [
    "StringIndexOf abstract op used by includes/startsWith/endsWith/indexOf.",
    "startsWith with a regex argument throws TypeError (IsRegExp check).",
    "search ToString’s non-regex and then creates a RegExp."
  ],
  "takeaways": [
    "Use includes for existence; indexOf when you need the position.",
    "Never if (s.indexOf(x)) — 0 is found-at-start and falsy.",
    "if (str.indexOf(substr)) fails when the substring sits at index 0.",
    "StringIndexOf abstract op used by includes/startsWith/endsWith/indexOf."
  ],
  "revision": [
    "Searching Strings: A cursor walking UTF-16 cells. -1 means ‘not found,’ never 0 — 0 is a valid hit at the start.",
    "Use includes for existence; indexOf when you need the position.",
    "Never if (s.indexOf(x)) — 0 is found-at-start and falsy.",
    "startsWith is not a regex; escape nothing.",
    "Trap: if (str.indexOf(substr)) fails when the substring sits at index 0."
  ],
  "flashcards": [
    [
      "Searching Strings",
      "indexOf/lastIndexOf return a code-unit index or -1."
    ],
    [
      "Mental model",
      "A cursor walking UTF-16 cells. -1 means ‘not found,’ never 0 — 0 is a valid hit at the start."
    ],
    [
      "Common trap",
      "if (str.indexOf(substr)) fails when the substring sits at index 0."
    ],
    [
      "Use includes for existence; indexOf when you need the position.",
      "Never if (s.indexOf(x)) — 0 is found-at-start and falsy."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Searching Strings and where does a beginner first see it?",
      "answerHint": "indexOf/lastIndexOf return a code-unit index or -1. includes/startsWith/endsWith return booleans and accept a start index. search takes a regex and returns an index. match/matchAll belong with regex. All are case-sensitive unless you normalize case or use /i."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Searching Strings works and name the main pitfall.",
      "answerHint": "Use includes for existence; indexOf when you need the position. Never if (s.indexOf(x)) — 0 is found-at-start and falsy. startsWith is not a regex; escape nothing. Case-fold with toLowerCase only for ASCII-ish data; otherwise locale rules. Pitfall: if (str.indexOf(substr)) fails when the substring sits at index 0."
    },
    {
      "level": "advanced",
      "question": "How would you explain Searching Strings at an interview, including engine/spec details?",
      "answerHint": "StringIndexOf abstract op used by includes/startsWith/endsWith/indexOf. startsWith with a regex argument throws TypeError (IsRegExp check). search ToString’s non-regex and then creates a RegExp."
    }
  ],
  "pitfalls": [
    "if (str.indexOf(substr)) fails when the substring sits at index 0.",
    "Case-fold with toLowerCase only for ASCII-ish data; otherwise locale rules."
  ],
  "interview": {
    "expectations": [
      "Explain Searching Strings without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "StringIndexOf abstract op used by includes/startsWith/endsWith/indexOf."
    ],
    "commonQuestions": [
      "What is Searching Strings?",
      "Why does JavaScript searching strings behave this way?",
      "What is the classic Searching Strings interview trap?"
    ],
    "traps": [
      "if (str.indexOf(substr)) fails when the substring sits at index 0."
    ],
    "misconceptions": [
      "Finding a needle in text is the most common string task. Boolean helpers were added because indexOf === -1 was noisy."
    ],
    "strongSignals": [
      "Separates Searching Strings from lookalike APIs and can draw the mental model."
    ]
  }
})
