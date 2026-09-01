import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Record vs Index Signature",
  "whatIsIt": "Record<K, V> requires keys K known (often union). Index signature allows any string key. Record enforces exhaustiveness for union keys; index signature is open-ended.",
  "whyExists": "Choose Record for variant maps; index signature for dynamic JSON bags.",
  "mentalModel": "Record = fixed menu; index signature = all-you-can-eat keys.",
  "how": [
    "Record<Status, View> for state machine UI.",
    "{ [id: string]: User } for cache by id.",
    "Record cannot express unknown keys beyond K.",
    "Partial<Record<K,V>> for sparse finite maps.",
    "satisfies Record<K,V> validates object literal keys."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using index signature when keys are finite — lose exhaustiveness checking.",
    "variant": "warning"
  },
  "example": "type Lang = 'en' | 'fr';\nconst HELLO: Record<Lang, string> = { en: 'Hello', fr: 'Bonjour' };\ntype Cache = { [id: string]: { name: string } };\nconst c: Cache = { u1: { name: 'Ada' } };\nconsole.log(HELLO.en, c.u1.name);\nconst __typed: Lang = {} as Lang;\nconsole.log(\"export type { Lang }\");\n// type Lang = 'en' | 'fr'; narrows allowed values",
  "exampleCaption": "Record for Lang union; index sig for Cache",
  "internals": [
    "Record implemented as mapped type.",
    "Index signature implies wider keyof.",
    "noUncheckedIndexedAccess affects both on read."
  ],
  "takeaways": [
    "Record<Status, View> for state machine UI.",
    "{ [id: string]: User } for cache by id.",
    "Using index signature when keys are finite — lose exhaustiveness checking.",
    "Record implemented as mapped type."
  ],
  "revision": [
    "Record vs Index Signature: Record = fixed menu; index signature = all-you-can-eat keys.",
    "Record<Status, View> for state machine UI.",
    "{ [id: string]: User } for cache by id.",
    "Record cannot express unknown keys beyond K.",
    "Trap: Using index signature when keys are finite — lose exhaustiveness checking."
  ],
  "flashcards": [
    [
      "Record vs Index Signature",
      "Record<K, V> requires keys K known (often union)."
    ],
    [
      "Mental model",
      "Record = fixed menu; index signature = all-you-can-eat keys."
    ],
    [
      "Common trap",
      "Using index signature when keys are finite — lose exhaustiveness checking."
    ],
    [
      "Record<Status, View> for state machine UI.",
      "{ [id: string]: User } for cache by id."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Record vs Index Signature in TypeScript and when do you use it?",
      "answerHint": "Record<K, V> requires keys K known (often union). Index signature allows any string key. Record enforces exhaustiveness for union keys; index signature is open-ended."
    },
    {
      "level": "intermediate",
      "question": "Explain Record vs Index Signature with a code example and one pitfall.",
      "answerHint": "Record<Status, View> for state machine UI. { [id: string]: User } for cache by id. Record cannot express unknown keys beyond K. Partial<Record<K,V>> for sparse finite maps. satisfies Record<K,V> validates object literal keys. Pitfall: Using index signature when keys are finite — lose exhaustiveness checking."
    },
    {
      "level": "advanced",
      "question": "How would you explain Record vs Index Signature in a senior frontend interview?",
      "answerHint": "Record implemented as mapped type. Index signature implies wider keyof. noUncheckedIndexedAccess affects both on read. type Lang = 'en' | 'fr';\nconst HELLO: Record<Lang, string> = { en: 'Hello', fr: 'Bonjour' };\ntype Cache = { [id: string]"
    }
  ],
  "pitfalls": [
    "Using index signature when keys are finite — lose exhaustiveness checking."
  ],
  "interview": {
    "expectations": [
      "Explain Record vs Index Signature with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Record implemented as mapped type."
    ],
    "commonQuestions": [
      "What is Record vs Index Signature?",
      "When would you choose Record vs Index Signature over alternatives?",
      "What is the classic Record vs Index Signature interview trap?"
    ],
    "traps": [
      "Using index signature when keys are finite — lose exhaustiveness checking."
    ],
    "misconceptions": [
      "Choose Record for variant maps; index signature for dynamic JSON bags."
    ],
    "strongSignals": [
      "Uses Record vs Index Signature to remove invalid states, not just document them."
    ]
  }
})
