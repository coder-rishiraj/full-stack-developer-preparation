import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Branded / Nominal Types",
  "whatIsIt": "Branded types (opaque types) add phantom brand to prevent mixing structurally identical types: type UserId = string & { readonly __brand: unique symbol }. Zero runtime cost; prevents passing OrderId where UserId expected.",
  "whyExists": "Interview pattern for domain primitives — nominal typing simulation.",
  "mentalModel": "Same-shaped IDs get different colored labels at compile time.",
  "how": [
    "declare const brand: unique symbol;",
    "type Brand<T, B> = T & { readonly __brand: B };",
    "Constructor functions validate and return branded type.",
    "Use for currency units, emails, UUIDs.",
    "Do not brand without runtime validation at boundaries."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Branding with as only — no validation; still strings at runtime.",
    "variant": "warning"
  },
  "example": "declare const UserIdBrand: unique symbol;\ntype UserId = string & { readonly [UserIdBrand]: true };\nfunction userId(raw: string): UserId {\n  if (!raw) throw new Error('empty');\n  return raw as UserId;\n}\nfunction load(id: UserId) { console.log(id); }\nload(userId('u_1'));",
  "exampleCaption": "UserId brand blocks plain string assignability",
  "internals": [
    "Structural typing bypassed via incompatible brand intersection.",
    "unique symbol brands differ per declaration.",
    "Zod .brand() adds similar pattern with runtime parse."
  ],
  "takeaways": [
    "declare const brand: unique symbol;",
    "type Brand<T, B> = T & { readonly __brand: B };",
    "Branding with as only — no validation; still strings at runtime.",
    "Structural typing bypassed via incompatible brand intersection."
  ],
  "revision": [
    "Branded / Nominal Types: Same-shaped IDs get different colored labels at compile time.",
    "declare const brand: unique symbol;",
    "type Brand<T, B> = T & { readonly __brand: B };",
    "Constructor functions validate and return branded type.",
    "Trap: Branding with as only — no validation; still strings at runtime."
  ],
  "flashcards": [
    [
      "Branded / Nominal Types",
      "Branded types (opaque types) add phantom brand to prevent mixing structurally identical types: type UserId = string & { readonly __brand: unique symbol }."
    ],
    [
      "Mental model",
      "Same-shaped IDs get different colored labels at compile time."
    ],
    [
      "Common trap",
      "Branding with as only — no validation; still strings at runtime."
    ],
    [
      "declare const brand: unique symbol;",
      "type Brand<T, B> = T & { readonly __brand: B };"
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Branded / Nominal Types in TypeScript and when do you use it?",
      "answerHint": "Branded types (opaque types) add phantom brand to prevent mixing structurally identical types: type UserId = string & { readonly __brand: unique symbol }. Zero runtime cost; prevents passing OrderId where UserId expected."
    },
    {
      "level": "intermediate",
      "question": "Explain Branded / Nominal Types with a code example and one pitfall.",
      "answerHint": "declare const brand: unique symbol; type Brand<T, B> = T & { readonly __brand: B }; Constructor functions validate and return branded type. Use for currency units, emails, UUIDs. Do not brand without runtime validation at boundaries. Pitfall: Branding with as only — no validation; still strings at runtime."
    },
    {
      "level": "advanced",
      "question": "How would you explain Branded / Nominal Types in a senior frontend interview?",
      "answerHint": "Structural typing bypassed via incompatible brand intersection. unique symbol brands differ per declaration. Zod .brand() adds similar pattern with runtime parse. declare const UserIdBrand: unique symbol;\ntype UserId = string & { readonly [UserIdBrand]: true };\nfunction userId(raw: "
    }
  ],
  "pitfalls": [
    "Branding with as only — no validation; still strings at runtime."
  ],
  "interview": {
    "expectations": [
      "Explain Branded / Nominal Types with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Structural typing bypassed via incompatible brand intersection."
    ],
    "commonQuestions": [
      "What is Branded / Nominal Types?",
      "When would you choose Branded / Nominal Types over alternatives?",
      "What is the classic Branded / Nominal Types interview trap?"
    ],
    "traps": [
      "Branding with as only — no validation; still strings at runtime."
    ],
    "misconceptions": [
      "Interview pattern for domain primitives — nominal typing simulation."
    ],
    "strongSignals": [
      "Uses Branded / Nominal Types to remove invalid states, not just document them."
    ]
  }
})
