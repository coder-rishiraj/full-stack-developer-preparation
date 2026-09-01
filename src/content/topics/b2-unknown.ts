import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "unknown",
  "whatIsIt": "unknown is the type-safe counterpart to any: you can assign anything to unknown, but cannot use it until narrowed. It forces runtime checks, typeof, or type guards before property access, calls, or arithmetic.",
  "whyExists": "Interview favorite: unknown vs any — unknown preserves safety; any removes it.",
  "mentalModel": "A sealed package — you must inspect contents before use.",
  "how": [
    "Function params for user input: (input: unknown).",
    "Narrow with typeof, instanceof, in, or custom guards.",
    "After validation, assign to concrete type.",
    "unknown is not assignable to string without narrowing.",
    "Use in API layers receiving JSON or message events."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Casting unknown to MyType with as — bypasses safety you chose unknown for.",
    "variant": "warning"
  },
  "example": "function len(x: unknown): number {\n  if (typeof x === 'string') return x.length;\n  if (Array.isArray(x)) return x.length;\n  throw new Error('unsupported');\n}\nconsole.log(len('abc'), len([1, 2]));\nconst sample: unknown = 'text';\n// TypeScript validates this file before emit",
  "exampleCaption": "unknown narrowed by typeof and Array.isArray",
  "internals": [
    "unknown is top type except any in assignability.",
    "Control flow analysis tracks narrowing per branch.",
    "Predicate guards (v is T) teach the checker."
  ],
  "takeaways": [
    "Function params for user input: (input: unknown).",
    "Narrow with typeof, instanceof, in, or custom guards.",
    "Casting unknown to MyType with as — bypasses safety you chose unknown for.",
    "unknown is top type except any in assignability."
  ],
  "revision": [
    "unknown: A sealed package — you must inspect contents before use.",
    "Function params for user input: (input: unknown).",
    "Narrow with typeof, instanceof, in, or custom guards.",
    "After validation, assign to concrete type.",
    "Trap: Casting unknown to MyType with as — bypasses safety you chose unknown for."
  ],
  "flashcards": [
    [
      "unknown",
      "unknown is the type-safe counterpart to any: you can assign anything to unknown, but cannot use it until narrowed."
    ],
    [
      "Mental model",
      "A sealed package — you must inspect contents before use."
    ],
    [
      "Common trap",
      "Casting unknown to MyType with as — bypasses safety you chose unknown for."
    ],
    [
      "Function params for user input: (input: unknown).",
      "Narrow with typeof, instanceof, in, or custom guards."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is unknown in TypeScript and when do you use it?",
      "answerHint": "unknown is the type-safe counterpart to any: you can assign anything to unknown, but cannot use it until narrowed. It forces runtime checks, typeof, or type guards before property access, calls, or arithmetic."
    },
    {
      "level": "intermediate",
      "question": "Explain unknown with a code example and one pitfall.",
      "answerHint": "Function params for user input: (input: unknown). Narrow with typeof, instanceof, in, or custom guards. After validation, assign to concrete type. unknown is not assignable to string without narrowing. Use in API layers receiving JSON or message events. Pitfall: Casting unknown to MyType with as — bypasses safety you chose unknown for."
    },
    {
      "level": "advanced",
      "question": "How would you explain unknown in a senior frontend interview?",
      "answerHint": "unknown is top type except any in assignability. Control flow analysis tracks narrowing per branch. Predicate guards (v is T) teach the checker. function len(x: unknown): number {\n  if (typeof x === 'string') return x.length;\n  if (Array.isArray(x)) return x.length"
    }
  ],
  "pitfalls": [
    "Casting unknown to MyType with as — bypasses safety you chose unknown for."
  ],
  "interview": {
    "expectations": [
      "Explain unknown with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "unknown is top type except any in assignability."
    ],
    "commonQuestions": [
      "What is unknown?",
      "When would you choose unknown over alternatives?",
      "What is the classic unknown interview trap?"
    ],
    "traps": [
      "Casting unknown to MyType with as — bypasses safety you chose unknown for."
    ],
    "misconceptions": [
      "Interview favorite: unknown vs any — unknown preserves safety; any removes it."
    ],
    "strongSignals": [
      "Uses unknown to remove invalid states, not just document them."
    ]
  }
})
