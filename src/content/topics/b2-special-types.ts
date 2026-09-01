import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "any, unknown, never, void",
  "whatIsIt": "Beyond primitives, TS has special types: any (opt-out), unknown (safe top), void (no return), never (no values), null, and undefined. They model JS behavior and control flow. Strict mode treats null/undefined distinctly from other types.",
  "whyExists": "These types encode edge cases — unreachable code, missing returns, untrusted input — that primitives alone cannot express.",
  "mentalModel": "Special types are traffic signals: stop (never), caution (unknown), detour (any).",
  "how": [
    "Replace any with unknown at trust boundaries.",
    "Use void for functions that run side effects only.",
    "never marks exhaustiveness gaps and throw paths.",
    "Enable strictNullChecks — null is not assignable to string.",
    "undefined optional props use ? syntax."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using any as default instead of unknown — disables all checking downstream.",
    "variant": "warning"
  },
  "example": "function assertNever(x: never): never {\n  throw new Error('Unexpected: ' + x);\n}\ntype Action = { type: 'inc' } | { type: 'dec' };\nfunction reduce(a: Action) {\n  switch (a.type) { case 'inc': return 1; case 'dec': return -1; default: return assertNever(a); }\n// type Action = { type: 'inc' } | { type: 'dec' }; narrows allowed values\nconsole.log(reduce('demo'));\n// Action is available to importers as a type alias",
  "exampleCaption": "never enforces exhaustive switch on Action",
  "internals": [
    "any is both top and bottom — assignable everywhere both ways.",
    "unknown requires narrowing before property access.",
    "never is subtype of every type; only never assignable to never."
  ],
  "takeaways": [
    "Replace any with unknown at trust boundaries.",
    "Use void for functions that run side effects only.",
    "Using any as default instead of unknown — disables all checking downstream.",
    "any is both top and bottom — assignable everywhere both ways."
  ],
  "revision": [
    "any, unknown, never, void: Special types are traffic signals: stop (never), caution (unknown), detour (any).",
    "Replace any with unknown at trust boundaries.",
    "Use void for functions that run side effects only.",
    "never marks exhaustiveness gaps and throw paths.",
    "Trap: Using any as default instead of unknown — disables all checking downstream."
  ],
  "flashcards": [
    [
      "any, unknown, never, void",
      "Beyond primitives, TS has special types: any (opt-out), unknown (safe top), void (no return), never (no values), null, and undefined."
    ],
    [
      "Mental model",
      "Special types are traffic signals: stop (never), caution (unknown), detour (any)."
    ],
    [
      "Common trap",
      "Using any as default instead of unknown — disables all checking downstream."
    ],
    [
      "Replace any with unknown at trust boundaries.",
      "Use void for functions that run side effects only."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is any, unknown, never, void in TypeScript and when do you use it?",
      "answerHint": "Beyond primitives, TS has special types: any (opt-out), unknown (safe top), void (no return), never (no values), null, and undefined. They model JS behavior and control flow. Strict mode treats null/undefined distinctly from other types."
    },
    {
      "level": "intermediate",
      "question": "Explain any, unknown, never, void with a code example and one pitfall.",
      "answerHint": "Replace any with unknown at trust boundaries. Use void for functions that run side effects only. never marks exhaustiveness gaps and throw paths. Enable strictNullChecks — null is not assignable to string. undefined optional props use ? syntax. Pitfall: Using any as default instead of unknown — disables all checking downstream."
    },
    {
      "level": "advanced",
      "question": "How would you explain any, unknown, never, void in a senior frontend interview?",
      "answerHint": "any is both top and bottom — assignable everywhere both ways. unknown requires narrowing before property access. never is subtype of every type; only never assignable to never. function assertNever(x: never): never {\n  throw new Error('Unexpected: ' + x);\n}\ntype Action = { type: 'inc' } | { type:"
    }
  ],
  "pitfalls": [
    "Using any as default instead of unknown — disables all checking downstream."
  ],
  "interview": {
    "expectations": [
      "Explain any, unknown, never, void with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "any is both top and bottom — assignable everywhere both ways."
    ],
    "commonQuestions": [
      "What is any, unknown, never, void?",
      "When would you choose any, unknown, never, void over alternatives?",
      "What is the classic any, unknown, never, void interview trap?"
    ],
    "traps": [
      "Using any as default instead of unknown — disables all checking downstream."
    ],
    "misconceptions": [
      "These types encode edge cases — unreachable code, missing returns, untrusted input — that primitives alone cannot express."
    ],
    "strongSignals": [
      "Uses any, unknown, never, void to remove invalid states, not just document them."
    ]
  }
})
