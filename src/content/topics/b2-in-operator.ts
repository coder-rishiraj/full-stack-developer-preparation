import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "in Operator",
  "whatIsIt": "\"key\" in obj narrows object unions when variants differ by property presence. Works at runtime on objects; TS uses it for discriminating structural variants without a tag field.",
  "whyExists": "Duck typing with compile-time follow-through — common in API payloads.",
  "mentalModel": "Check if drawer has label before opening.",
  "how": [
    "if (\"email\" in contact) use contact.email.",
    "Narrow union of types with different keys.",
    "obj must be object — guard null first.",
    "Combine with typeof obj === \"object\".",
    "Prefer discriminant field when designing new unions."
  ],
  "callout": {
    "title": "Watch for",
    "text": "in checks property anywhere in chain — inherited props can confuse.",
    "variant": "warning"
  },
  "example": "type Cat = { meow: () => void };\ntype Dog = { bark: () => void };\nfunction speak(pet: Cat | Dog) {\n  if ('meow' in pet) pet.meow();\n  else pet.bark();\n}\nconsole.log(\"export type { Cat }\");\n// type Cat = { meow: () => void }; narrows allowed values",
  "exampleCaption": "in operator picks Cat vs Dog branch",
  "internals": [
    "Narrowing requires identifiable property difference.",
    "in on arrays checks index as property.",
    "User-defined type guards often clearer for APIs."
  ],
  "takeaways": [
    "if (\"email\" in contact) use contact.email.",
    "Narrow union of types with different keys.",
    "in checks property anywhere in chain — inherited props can confuse.",
    "Narrowing requires identifiable property difference."
  ],
  "revision": [
    "in Operator: Check if drawer has label before opening.",
    "if (\"email\" in contact) use contact.email.",
    "Narrow union of types with different keys.",
    "obj must be object — guard null first.",
    "Trap: in checks property anywhere in chain — inherited props can confuse."
  ],
  "flashcards": [
    [
      "in Operator",
      "\"key\" in obj narrows object unions when variants differ by property presence."
    ],
    [
      "Mental model",
      "Check if drawer has label before opening."
    ],
    [
      "Common trap",
      "in checks property anywhere in chain — inherited props can confuse."
    ],
    [
      "if (\"email\" in contact) use contact.email.",
      "Narrow union of types with different keys."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is in Operator in TypeScript and when do you use it?",
      "answerHint": "\"key\" in obj narrows object unions when variants differ by property presence. Works at runtime on objects; TS uses it for discriminating structural variants without a tag field."
    },
    {
      "level": "intermediate",
      "question": "Explain in Operator with a code example and one pitfall.",
      "answerHint": "if (\"email\" in contact) use contact.email. Narrow union of types with different keys. obj must be object — guard null first. Combine with typeof obj === \"object\". Prefer discriminant field when designing new unions. Pitfall: in checks property anywhere in chain — inherited props can confuse."
    },
    {
      "level": "advanced",
      "question": "How would you explain in Operator in a senior frontend interview?",
      "answerHint": "Narrowing requires identifiable property difference. in on arrays checks index as property. User-defined type guards often clearer for APIs. type Cat = { meow: () => void };\ntype Dog = { bark: () => void };\nfunction speak(pet: Cat | Dog) {\n  if ('meow' in pet) "
    }
  ],
  "pitfalls": [
    "in checks property anywhere in chain — inherited props can confuse."
  ],
  "interview": {
    "expectations": [
      "Explain in Operator with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Narrowing requires identifiable property difference."
    ],
    "commonQuestions": [
      "What is in Operator?",
      "When would you choose in Operator over alternatives?",
      "What is the classic in Operator interview trap?"
    ],
    "traps": [
      "in checks property anywhere in chain — inherited props can confuse."
    ],
    "misconceptions": [
      "Duck typing with compile-time follow-through — common in API payloads."
    ],
    "strongSignals": [
      "Uses in Operator to remove invalid states, not just document them."
    ]
  }
})
