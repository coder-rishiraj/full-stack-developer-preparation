import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Partial",
  "whatIsIt": "Partial<T> makes every property optional — useful for update DTOs and default merging. Deep partial requires custom recursive type.",
  "whyExists": "PATCH endpoints rarely send full entity — Partial models optional fields.",
  "mentalModel": "Same object blueprint with every field marked optional.",
  "how": [
    "type UpdateUser = Partial<User> for full optional update.",
    "Combine with Pick for scoped patches.",
    "Merge defaults: { ...defaults, ...partial }.",
    "Partial does not affect nested objects deeply.",
    "Required reverses Partial when needed."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Partial<User> allows empty {} — validate at least one key if business requires.",
    "variant": "warning"
  },
  "example": "type Settings = { theme: 'light' | 'dark'; fontSize: number };\nfunction applySettings(base: Settings, patch: Partial<Settings>): Settings {\n  return { ...base, ...patch };\n}\nconsole.log(applySettings({ theme: 'light', fontSize: 14 }, { fontSize: 16 }));\nconst __typed: Settings = {} as Settings;\nconsole.log(\"export type { Settings }\");\n// type Settings = { theme: 'light' | 'dark'; fontSize: number }; narrows allowed values",
  "exampleCaption": "Partial Settings patch merges over base",
  "internals": [
    "Mapped type with ? on each key.",
    "Partial distributes over union T in some versions — verify.",
    "Optional does not mean nullable unless unioned."
  ],
  "takeaways": [
    "type UpdateUser = Partial<User> for full optional update.",
    "Combine with Pick for scoped patches.",
    "Partial<User> allows empty {} — validate at least one key if business requires.",
    "Mapped type with ? on each key."
  ],
  "revision": [
    "Partial: Same object blueprint with every field marked optional.",
    "type UpdateUser = Partial<User> for full optional update.",
    "Combine with Pick for scoped patches.",
    "Merge defaults: { ...defaults, ...partial }.",
    "Trap: Partial<User> allows empty {} — validate at least one key if business requires."
  ],
  "flashcards": [
    [
      "Partial",
      "Partial<T> makes every property optional — useful for update DTOs and default merging."
    ],
    [
      "Mental model",
      "Same object blueprint with every field marked optional."
    ],
    [
      "Common trap",
      "Partial<User> allows empty {} — validate at least one key if business requires."
    ],
    [
      "type UpdateUser = Partial<User> for full optional update.",
      "Combine with Pick for scoped patches."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Partial in TypeScript and when do you use it?",
      "answerHint": "Partial<T> makes every property optional — useful for update DTOs and default merging. Deep partial requires custom recursive type."
    },
    {
      "level": "intermediate",
      "question": "Explain Partial with a code example and one pitfall.",
      "answerHint": "type UpdateUser = Partial<User> for full optional update. Combine with Pick for scoped patches. Merge defaults: { ...defaults, ...partial }. Partial does not affect nested objects deeply. Required reverses Partial when needed. Pitfall: Partial<User> allows empty {} — validate at least one key if business requires."
    },
    {
      "level": "advanced",
      "question": "How would you explain Partial in a senior frontend interview?",
      "answerHint": "Mapped type with ? on each key. Partial distributes over union T in some versions — verify. Optional does not mean nullable unless unioned. type Settings = { theme: 'light' | 'dark'; fontSize: number };\nfunction applySettings(base: Settings, patch: Partial<Set"
    }
  ],
  "pitfalls": [
    "Partial<User> allows empty {} — validate at least one key if business requires."
  ],
  "interview": {
    "expectations": [
      "Explain Partial with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Mapped type with ? on each key."
    ],
    "commonQuestions": [
      "What is Partial?",
      "When would you choose Partial over alternatives?",
      "What is the classic Partial interview trap?"
    ],
    "traps": [
      "Partial<User> allows empty {} — validate at least one key if business requires."
    ],
    "misconceptions": [
      "PATCH endpoints rarely send full entity — Partial models optional fields."
    ],
    "strongSignals": [
      "Uses Partial to remove invalid states, not just document them."
    ]
  }
})
