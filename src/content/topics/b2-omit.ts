import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Omit",
  "whatIsIt": "Omit<T, K> removes keys K from T: Omit<User, \"password\">. Dual of Pick. Common for creating safe views and input types without internal fields.",
  "whyExists": "When excluded fields are few or sensitive, Omit is clearer than Pick long list.",
  "mentalModel": "Redact columns from type export.",
  "how": [
    "Omit<User, \"id\" | \"createdAt\"> for create input.",
    "Omit<ComponentProps, \"className\"> for wrapper.",
    "Combine Omit + Partial for update minus immutable keys.",
    "K extends keyof T required.",
    "Custom Omit for union keys with Exclude on keys."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Omit does not prevent extra runtime properties from API — validate separately.",
    "variant": "warning"
  },
  "example": "type User = { id: string; name: string; internalNote: string };\ntype CreateUser = Omit<User, 'id' | 'internalNote'>;\nconst input: CreateUser = { name: 'Ada' };\nconsole.log(input.name);\nconst __typed: User = {} as User;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { User }\");\n// type User = { id: string; name: string; internalNote: string }; narrows allowed values",
  "exampleCaption": "CreateUser omits id and internalNote",
  "internals": [
    "Omit = Pick all keys except excluded.",
    "Works with index signatures cautiously.",
    "Template for Omit<T, keyof Other> diff types."
  ],
  "takeaways": [
    "Omit<User, \"id\" | \"createdAt\"> for create input.",
    "Omit<ComponentProps, \"className\"> for wrapper.",
    "Omit does not prevent extra runtime properties from API — validate separately.",
    "Omit = Pick all keys except excluded."
  ],
  "revision": [
    "Omit: Redact columns from type export.",
    "Omit<User, \"id\" | \"createdAt\"> for create input.",
    "Omit<ComponentProps, \"className\"> for wrapper.",
    "Combine Omit + Partial for update minus immutable keys.",
    "Trap: Omit does not prevent extra runtime properties from API — validate separately."
  ],
  "flashcards": [
    [
      "Omit",
      "Omit<T, K> removes keys K from T: Omit<User, \"password\">."
    ],
    [
      "Mental model",
      "Redact columns from type export."
    ],
    [
      "Common trap",
      "Omit does not prevent extra runtime properties from API — validate separately."
    ],
    [
      "Omit<User, \"id\" | \"createdAt\"> for create input.",
      "Omit<ComponentProps, \"className\"> for wrapper."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Omit in TypeScript and when do you use it?",
      "answerHint": "Omit<T, K> removes keys K from T: Omit<User, \"password\">. Dual of Pick. Common for creating safe views and input types without internal fields."
    },
    {
      "level": "intermediate",
      "question": "Explain Omit with a code example and one pitfall.",
      "answerHint": "Omit<User, \"id\" | \"createdAt\"> for create input. Omit<ComponentProps, \"className\"> for wrapper. Combine Omit + Partial for update minus immutable keys. K extends keyof T required. Custom Omit for union keys with Exclude on keys. Pitfall: Omit does not prevent extra runtime properties from API — validate separately."
    },
    {
      "level": "advanced",
      "question": "How would you explain Omit in a senior frontend interview?",
      "answerHint": "Omit = Pick all keys except excluded. Works with index signatures cautiously. Template for Omit<T, keyof Other> diff types. type User = { id: string; name: string; internalNote: string };\ntype CreateUser = Omit<User, 'id' | 'internalNote'>;\ncon"
    }
  ],
  "pitfalls": [
    "Omit does not prevent extra runtime properties from API — validate separately."
  ],
  "interview": {
    "expectations": [
      "Explain Omit with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Omit = Pick all keys except excluded."
    ],
    "commonQuestions": [
      "What is Omit?",
      "When would you choose Omit over alternatives?",
      "What is the classic Omit interview trap?"
    ],
    "traps": [
      "Omit does not prevent extra runtime properties from API — validate separately."
    ],
    "misconceptions": [
      "When excluded fields are few or sensitive, Omit is clearer than Pick long list."
    ],
    "strongSignals": [
      "Uses Omit to remove invalid states, not just document them."
    ]
  }
})
