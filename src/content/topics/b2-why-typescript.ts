import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Why Use TypeScript",
  "whatIsIt": "Teams adopt TypeScript for safer refactors, self-documenting APIs, IDE intelligence (jump-to-definition, inline errors), and catching entire bug classes before CI. It scales collaboration: function signatures become contracts reviewers and tools enforce. It also unlocks advanced patterns — discriminated unions, mapped types, conditional types — that are awkward in plain JS.",
  "whyExists": "As apps grew to hundreds of modules, \"run it and see what breaks\" stopped scaling. Types pay rent upfront and save debugging time in production.",
  "mentalModel": "Types are guardrails on a mountain road. You still drive (write logic), but you are less likely to slide off a cliff (ship undefined access).",
  "how": [
    "Enable strict mode; fix errors incrementally.",
    "Let inference reduce annotation noise.",
    "Use types at module boundaries: props, API responses, DB rows.",
    "Pair with ESLint (@typescript-eslint) for lint + type-aware rules.",
    "Measure adoption: fewer prod TypeErrors, faster onboardings."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Adopting TS without strict flags gives a false sense of safety — any still slips through.",
    "variant": "warning"
  },
  "example": "type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };\nasync function fetchUser(id: string): Promise<ApiResponse<{ name: string }>> {\n  const res = await fetch(`/api/users/${id}`);\n  if (!res.ok) return { data: null, error: res.statusText };\n  return { data: await res.json(), error: null };\n}\nconsole.log(\"}\");\n// type ApiResponse<T> = { data: T; error: null } | { data: null; error: string }; narrows allowed values",
  "exampleCaption": "Union return type documents success and failure paths",
  "internals": [
    "Language service (tsserver) shares the compiler for editor features.",
    "Types enable exhaustive switch checking via never.",
    "Declaration files (.d.ts) let JS libraries participate in the type graph."
  ],
  "takeaways": [
    "Enable strict mode; fix errors incrementally.",
    "Let inference reduce annotation noise.",
    "Adopting TS without strict flags gives a false sense of safety — any still slips through.",
    "Language service (tsserver) shares the compiler for editor features."
  ],
  "revision": [
    "Why Use TypeScript: Types are guardrails on a mountain road. You still drive (write logic), but you are less likely to slide off a cliff (ship undefined access).",
    "Enable strict mode; fix errors incrementally.",
    "Let inference reduce annotation noise.",
    "Use types at module boundaries: props, API responses, DB rows.",
    "Trap: Adopting TS without strict flags gives a false sense of safety — any still slips through."
  ],
  "flashcards": [
    [
      "Why Use TypeScript",
      "Teams adopt TypeScript for safer refactors, self-documenting APIs, IDE intelligence (jump-to-definition, inline errors), and catching entire bug classes before CI."
    ],
    [
      "Mental model",
      "Types are guardrails on a mountain road. You still drive (write logic), but you are less likely to slide off a cliff (ship undefined access)."
    ],
    [
      "Common trap",
      "Adopting TS without strict flags gives a false sense of safety — any still slips through."
    ],
    [
      "Enable strict mode; fix errors incrementally.",
      "Let inference reduce annotation noise."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Why Use TypeScript in TypeScript and when do you use it?",
      "answerHint": "Teams adopt TypeScript for safer refactors, self-documenting APIs, IDE intelligence (jump-to-definition, inline errors), and catching entire bug classes before CI. It scales collaboration: function signatures become contracts reviewers and tools enforce. It also unlocks advanced patterns — discriminated unions, mapped types, conditional types — that are awkward in plain JS."
    },
    {
      "level": "intermediate",
      "question": "Explain Why Use TypeScript with a code example and one pitfall.",
      "answerHint": "Enable strict mode; fix errors incrementally. Let inference reduce annotation noise. Use types at module boundaries: props, API responses, DB rows. Pair with ESLint (@typescript-eslint) for lint + type-aware rules. Measure adoption: fewer prod TypeErrors, faster onboardings. Pitfall: Adopting TS without strict flags gives a false sense of safety — any still slips through."
    },
    {
      "level": "advanced",
      "question": "How would you explain Why Use TypeScript in a senior frontend interview?",
      "answerHint": "Language service (tsserver) shares the compiler for editor features. Types enable exhaustive switch checking via never. Declaration files (.d.ts) let JS libraries participate in the type graph. type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };\nasync function fetchUser(id: string): Pr"
    }
  ],
  "pitfalls": [
    "Adopting TS without strict flags gives a false sense of safety — any still slips through."
  ],
  "interview": {
    "expectations": [
      "Explain Why Use TypeScript with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Language service (tsserver) shares the compiler for editor features."
    ],
    "commonQuestions": [
      "What is Why Use TypeScript?",
      "When would you choose Why Use TypeScript over alternatives?",
      "What is the classic Why Use TypeScript interview trap?"
    ],
    "traps": [
      "Adopting TS without strict flags gives a false sense of safety — any still slips through."
    ],
    "misconceptions": [
      "As apps grew to hundreds of modules, \"run it and see what breaks\" stopped scaling. Types pay rent upfront and save debugging time in production."
    ],
    "strongSignals": [
      "Uses Why Use TypeScript to remove invalid states, not just document them."
    ]
  }
})
