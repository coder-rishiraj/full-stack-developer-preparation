import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "keyof + typeof Patterns",
  "whatIsIt": "Combine keyof with typeof on const objects: keyof typeof ROUTES for keys, (typeof ROUTES)[keyof typeof ROUTES] for values. Standard idiom replacing enums.",
  "whyExists": "Interview-ready pattern for config-driven types without duplication.",
  "mentalModel": "One source object feeds both runtime values and type unions.",
  "how": [
    "const MAP = { a: 1, b: 2 } as const; type Key = keyof typeof MAP;",
    "Event maps: keyof typeof handlers for event names.",
    "satisfies ensures MAP complete for Record keys.",
    "Generic factories keyed by keyof typeof registry.",
    "Export const + derived types from same module."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Forgetting as const — RoutePath widens to string not literal paths.",
    "variant": "warning"
  },
  "example": "const ROUTES = { home: '/', settings: '/settings' } as const;\ntype RouteKey = keyof typeof ROUTES;\ntype RoutePath = (typeof ROUTES)[RouteKey];\nfunction navigate(key: RouteKey) { const path: RoutePath = ROUTES[key]; console.log(path); }\nnavigate('home');\nconst __typed: RouteKey = {} as RouteKey;\nconsole.log(\"export type { RouteKey }\");\n// type RouteKey = keyof typeof ROUTES; narrows allowed values",
  "exampleCaption": "RouteKey and RoutePath derived from ROUTES",
  "internals": [
    "typeof on value vs type alias scope.",
    "keyof distributes on union objects.",
    "Const enum alternative with better JSON story."
  ],
  "takeaways": [
    "const MAP = { a: 1, b: 2 } as const; type Key = keyof typeof MAP;",
    "Event maps: keyof typeof handlers for event names.",
    "Forgetting as const — RoutePath widens to string not literal paths.",
    "typeof on value vs type alias scope."
  ],
  "revision": [
    "keyof + typeof Patterns: One source object feeds both runtime values and type unions.",
    "const MAP = { a: 1, b: 2 } as const; type Key = keyof typeof MAP;",
    "Event maps: keyof typeof handlers for event names.",
    "satisfies ensures MAP complete for Record keys.",
    "Trap: Forgetting as const — RoutePath widens to string not literal paths."
  ],
  "flashcards": [
    [
      "keyof + typeof Patterns",
      "Combine keyof with typeof on const objects: keyof typeof ROUTES for keys, (typeof ROUTES)[keyof typeof ROUTES] for values."
    ],
    [
      "Mental model",
      "One source object feeds both runtime values and type unions."
    ],
    [
      "Common trap",
      "Forgetting as const — RoutePath widens to string not literal paths."
    ],
    [
      "const MAP = { a: 1, b: 2 } as const; type Key = keyof typeof MAP;",
      "Event maps: keyof typeof handlers for event names."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is keyof + typeof Patterns in TypeScript and when do you use it?",
      "answerHint": "Combine keyof with typeof on const objects: keyof typeof ROUTES for keys, (typeof ROUTES)[keyof typeof ROUTES] for values. Standard idiom replacing enums."
    },
    {
      "level": "intermediate",
      "question": "Explain keyof + typeof Patterns with a code example and one pitfall.",
      "answerHint": "const MAP = { a: 1, b: 2 } as const; type Key = keyof typeof MAP; Event maps: keyof typeof handlers for event names. satisfies ensures MAP complete for Record keys. Generic factories keyed by keyof typeof registry. Export const + derived types from same module. Pitfall: Forgetting as const — RoutePath widens to string not literal paths."
    },
    {
      "level": "advanced",
      "question": "How would you explain keyof + typeof Patterns in a senior frontend interview?",
      "answerHint": "typeof on value vs type alias scope. keyof distributes on union objects. Const enum alternative with better JSON story. const ROUTES = { home: '/', settings: '/settings' } as const;\ntype RouteKey = keyof typeof ROUTES;\ntype RoutePath = (typ"
    }
  ],
  "pitfalls": [
    "Forgetting as const — RoutePath widens to string not literal paths."
  ],
  "interview": {
    "expectations": [
      "Explain keyof + typeof Patterns with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "typeof on value vs type alias scope."
    ],
    "commonQuestions": [
      "What is keyof + typeof Patterns?",
      "When would you choose keyof + typeof Patterns over alternatives?",
      "What is the classic keyof + typeof Patterns interview trap?"
    ],
    "traps": [
      "Forgetting as const — RoutePath widens to string not literal paths."
    ],
    "misconceptions": [
      "Interview-ready pattern for config-driven types without duplication."
    ],
    "strongSignals": [
      "Uses keyof + typeof Patterns to remove invalid states, not just document them."
    ]
  }
})
