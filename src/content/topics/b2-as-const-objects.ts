import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "as const Objects",
  "whatIsIt": "as const on object literals makes properties readonly and narrows values to literal types. Combined with typeof and keyof, it builds string unions without enums. satisfies checks shape while preserving literals.",
  "whyExists": "Modern TS pattern for config maps and variant keys with full inference.",
  "mentalModel": "Freeze the object and read exact string types from it.",
  "how": [
    "const ROUTES = { home: \"/\", about: \"/about\" } as const;",
    "type Route = typeof ROUTES[keyof typeof ROUTES];",
    "Use satisfies Record<string, string> to validate without widen.",
    "Readonly deep literals for theme tokens.",
    "Pair with mapped types for variant components."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Forgetting as const — values widen to string, losing literal union.",
    "variant": "warning"
  },
  "example": "const EVENTS = { click: 'click', focus: 'focus' } as const;\ntype EventName = (typeof EVENTS)[keyof typeof EVENTS];\nfunction on(name: EventName, fn: () => void) { console.log(name, fn.name); }\non(EVENTS.click, () => {});\nconst __typed: EventName = {} as EventName;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { EventName }\");\n// type EventName = (typeof EVENTS)[keyof typeof EVENTS]; narrows allowed values",
  "exampleCaption": "EVENTS as const drives EventName union",
  "internals": [
    "as const applies recursively to nested literals in TS 5+.",
    "Readonly modifier inferred on all properties.",
    "Tuple literals become readonly tuples with as const."
  ],
  "takeaways": [
    "const ROUTES = { home: \"/\", about: \"/about\" } as const;",
    "type Route = typeof ROUTES[keyof typeof ROUTES];",
    "Forgetting as const — values widen to string, losing literal union.",
    "as const applies recursively to nested literals in TS 5+."
  ],
  "revision": [
    "as const Objects: Freeze the object and read exact string types from it.",
    "const ROUTES = { home: \"/\", about: \"/about\" } as const;",
    "type Route = typeof ROUTES[keyof typeof ROUTES];",
    "Use satisfies Record<string, string> to validate without widen.",
    "Trap: Forgetting as const — values widen to string, losing literal union."
  ],
  "flashcards": [
    [
      "as const Objects",
      "as const on object literals makes properties readonly and narrows values to literal types."
    ],
    [
      "Mental model",
      "Freeze the object and read exact string types from it."
    ],
    [
      "Common trap",
      "Forgetting as const — values widen to string, losing literal union."
    ],
    [
      "const ROUTES = { home: \"/\", about: \"/about\" } as const;",
      "type Route = typeof ROUTES[keyof typeof ROUTES];"
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is as const Objects in TypeScript and when do you use it?",
      "answerHint": "as const on object literals makes properties readonly and narrows values to literal types. Combined with typeof and keyof, it builds string unions without enums. satisfies checks shape while preserving literals."
    },
    {
      "level": "intermediate",
      "question": "Explain as const Objects with a code example and one pitfall.",
      "answerHint": "const ROUTES = { home: \"/\", about: \"/about\" } as const; type Route = typeof ROUTES[keyof typeof ROUTES]; Use satisfies Record<string, string> to validate without widen. Readonly deep literals for theme tokens. Pair with mapped types for variant components. Pitfall: Forgetting as const — values widen to string, losing literal union."
    },
    {
      "level": "advanced",
      "question": "How would you explain as const Objects in a senior frontend interview?",
      "answerHint": "as const applies recursively to nested literals in TS 5+. Readonly modifier inferred on all properties. Tuple literals become readonly tuples with as const. const EVENTS = { click: 'click', focus: 'focus' } as const;\ntype EventName = (typeof EVENTS)[keyof typeof EVENTS];\nfunct"
    }
  ],
  "pitfalls": [
    "Forgetting as const — values widen to string, losing literal union."
  ],
  "interview": {
    "expectations": [
      "Explain as const Objects with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "as const applies recursively to nested literals in TS 5+."
    ],
    "commonQuestions": [
      "What is as const Objects?",
      "When would you choose as const Objects over alternatives?",
      "What is the classic as const Objects interview trap?"
    ],
    "traps": [
      "Forgetting as const — values widen to string, losing literal union."
    ],
    "misconceptions": [
      "Modern TS pattern for config maps and variant keys with full inference."
    ],
    "strongSignals": [
      "Uses as const Objects to remove invalid states, not just document them."
    ]
  }
})
