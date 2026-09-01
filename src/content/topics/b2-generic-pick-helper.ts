import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Generic pick() Helper",
  "whatIsIt": "Reusable helper: type Patch<T, K extends keyof T> = Partial<Pick<T, K>>. Function update<T, K extends keyof T>(obj: T, keys: K[], patch: Patch<T, K>). Interview shows DRY patch typing.",
  "whyExists": "Generic Pick abstraction used across CRUD services.",
  "mentalModel": "One generic tool for all entity patch shapes.",
  "how": [
    "type Patch<T, K extends keyof T> = Partial<Pick<T, K>>;",
    "Constrain K per call: patchUser(..., patch: Patch<User, \"name\">).",
    "Multiple keys: Patch<User, \"name\" | \"email\">.",
    "Export from shared types package.",
    "Pair with pick runtime Object.keys validation."
  ],
  "callout": {
    "title": "Watch for",
    "text": "K inferred as union of all keys in object — sometimes want explicit K generic.",
    "variant": "warning"
  },
  "example": "type Patch<T, K extends keyof T> = Partial<Pick<T, K>>;\ntype Article = { id: string; title: string; body: string };\nfunction updateArticle<K extends keyof Article>(patch: Patch<Article, K>) {\n  console.log(patch);\n}\nupdateArticle({ title: 'New' });\nupdateArticle({ body: 'Text', title: 'T' });\n// type Patch<T, K extends keyof T> = Partial<Pick<T, K>>; narrows allowed values",
  "exampleCaption": "Patch<Article, K> inferred from patch keys",
  "internals": [
    "Partial<Pick<T,K>> standard library composition.",
    "Assignability flows through generic K.",
    "Used in ORMs and REST clients."
  ],
  "takeaways": [
    "type Patch<T, K extends keyof T> = Partial<Pick<T, K>>;",
    "Constrain K per call: patchUser(..., patch: Patch<User, \"name\">).",
    "K inferred as union of all keys in object — sometimes want explicit K generic.",
    "Partial<Pick<T,K>> standard library composition."
  ],
  "revision": [
    "Generic pick() Helper: One generic tool for all entity patch shapes.",
    "type Patch<T, K extends keyof T> = Partial<Pick<T, K>>;",
    "Constrain K per call: patchUser(..., patch: Patch<User, \"name\">).",
    "Multiple keys: Patch<User, \"name\" | \"email\">.",
    "Trap: K inferred as union of all keys in object — sometimes want explicit K generic."
  ],
  "flashcards": [
    [
      "Generic pick() Helper",
      "Reusable helper: type Patch<T, K extends keyof T> = Partial<Pick<T, K>>."
    ],
    [
      "Mental model",
      "One generic tool for all entity patch shapes."
    ],
    [
      "Common trap",
      "K inferred as union of all keys in object — sometimes want explicit K generic."
    ],
    [
      "type Patch<T, K extends keyof T> = Partial<Pick<T, K>>;",
      "Constrain K per call: patchUser(..., patch: Patch<User, \"name\">)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Generic pick() Helper in TypeScript and when do you use it?",
      "answerHint": "Reusable helper: type Patch<T, K extends keyof T> = Partial<Pick<T, K>>. Function update<T, K extends keyof T>(obj: T, keys: K[], patch: Patch<T, K>). Interview shows DRY patch typing."
    },
    {
      "level": "intermediate",
      "question": "Explain Generic pick() Helper with a code example and one pitfall.",
      "answerHint": "type Patch<T, K extends keyof T> = Partial<Pick<T, K>>; Constrain K per call: patchUser(..., patch: Patch<User, \"name\">). Multiple keys: Patch<User, \"name\" | \"email\">. Export from shared types package. Pair with pick runtime Object.keys validation. Pitfall: K inferred as union of all keys in object — sometimes want explicit K generic."
    },
    {
      "level": "advanced",
      "question": "How would you explain Generic pick() Helper in a senior frontend interview?",
      "answerHint": "Partial<Pick<T,K>> standard library composition. Assignability flows through generic K. Used in ORMs and REST clients. type Patch<T, K extends keyof T> = Partial<Pick<T, K>>;\ntype Article = { id: string; title: string; body: string };\nfunc"
    }
  ],
  "pitfalls": [
    "K inferred as union of all keys in object — sometimes want explicit K generic."
  ],
  "interview": {
    "expectations": [
      "Explain Generic pick() Helper with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Partial<Pick<T,K>> standard library composition."
    ],
    "commonQuestions": [
      "What is Generic pick() Helper?",
      "When would you choose Generic pick() Helper over alternatives?",
      "What is the classic Generic pick() Helper interview trap?"
    ],
    "traps": [
      "K inferred as union of all keys in object — sometimes want explicit K generic."
    ],
    "misconceptions": [
      "Generic Pick abstraction used across CRUD services."
    ],
    "strongSignals": [
      "Uses Generic pick() Helper to remove invalid states, not just document them."
    ]
  }
})
