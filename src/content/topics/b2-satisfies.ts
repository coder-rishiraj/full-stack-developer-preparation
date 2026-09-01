import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "satisfies",
  "whatIsIt": "satisfies operator validates expression matches type without widening inferred type: const palette = { red: [255,0,0] } satisfies Record<string, readonly number[]>. Keeps literal types while checking shape.",
  "whyExists": "TS 4.9+ — fixes as const vs annotation tradeoff.",
  "mentalModel": "Check against mold without losing detailed inference.",
  "how": [
    "config satisfies ConfigType preserves literal keys.",
    "Variant map satisfies Record<Kind, Handler>.",
    "Prefer over annotation when literals must stay narrow.",
    "Combine with as const inside or outside as needed.",
    "Errors show mismatch without changing inferred type."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using : Record<string, Route> annotation — widens ROUTES values to Route not literals.",
    "variant": "warning"
  },
  "example": "type Route = '/' | '/about';\nconst ROUTES = {\n  home: '/',\n  about: '/about',\n} as const satisfies Record<string, Route>;\ntype RoutePath = (typeof ROUTES)[keyof typeof ROUTES];\nconsole.log(ROUTES.home);\n// type Route = '/' | '/about'; narrows allowed values",
  "exampleCaption": "satisfies validates values are Route literals",
  "internals": [
    "satisfies is compile-time only — erased.",
    "Preserves union literal narrowing for keys/values.",
    "Enables autocomplete on typeof object keys."
  ],
  "takeaways": [
    "config satisfies ConfigType preserves literal keys.",
    "Variant map satisfies Record<Kind, Handler>.",
    "Using : Record<string, Route> annotation — widens ROUTES values to Route not literals.",
    "satisfies is compile-time only — erased."
  ],
  "revision": [
    "satisfies: Check against mold without losing detailed inference.",
    "config satisfies ConfigType preserves literal keys.",
    "Variant map satisfies Record<Kind, Handler>.",
    "Prefer over annotation when literals must stay narrow.",
    "Trap: Using : Record<string, Route> annotation — widens ROUTES values to Route not literals."
  ],
  "flashcards": [
    [
      "satisfies",
      "satisfies operator validates expression matches type without widening inferred type: const palette = { red: [255,0,0] } satisfies Record<string, readonly number[]>."
    ],
    [
      "Mental model",
      "Check against mold without losing detailed inference."
    ],
    [
      "Common trap",
      "Using : Record<string, Route> annotation — widens ROUTES values to Route not literals."
    ],
    [
      "config satisfies ConfigType preserves literal keys.",
      "Variant map satisfies Record<Kind, Handler>."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is satisfies in TypeScript and when do you use it?",
      "answerHint": "satisfies operator validates expression matches type without widening inferred type: const palette = { red: [255,0,0] } satisfies Record<string, readonly number[]>. Keeps literal types while checking shape."
    },
    {
      "level": "intermediate",
      "question": "Explain satisfies with a code example and one pitfall.",
      "answerHint": "config satisfies ConfigType preserves literal keys. Variant map satisfies Record<Kind, Handler>. Prefer over annotation when literals must stay narrow. Combine with as const inside or outside as needed. Errors show mismatch without changing inferred type. Pitfall: Using : Record<string, Route> annotation — widens ROUTES values to Route not literals."
    },
    {
      "level": "advanced",
      "question": "How would you explain satisfies in a senior frontend interview?",
      "answerHint": "satisfies is compile-time only — erased. Preserves union literal narrowing for keys/values. Enables autocomplete on typeof object keys. type Route = '/' | '/about';\nconst ROUTES = {\n  home: '/',\n  about: '/about',\n} as const satisfies Record<string, Route>"
    }
  ],
  "pitfalls": [
    "Using : Record<string, Route> annotation — widens ROUTES values to Route not literals."
  ],
  "interview": {
    "expectations": [
      "Explain satisfies with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "satisfies is compile-time only — erased."
    ],
    "commonQuestions": [
      "What is satisfies?",
      "When would you choose satisfies over alternatives?",
      "What is the classic satisfies interview trap?"
    ],
    "traps": [
      "Using : Record<string, Route> annotation — widens ROUTES values to Route not literals."
    ],
    "misconceptions": [
      "TS 4.9+ — fixes as const vs annotation tradeoff."
    ],
    "strongSignals": [
      "Uses satisfies to remove invalid states, not just document them."
    ]
  }
})
