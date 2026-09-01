import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Index Signatures",
  "whatIsIt": "Index signature allows arbitrary keys: { [key: string]: number }. Keys must be compatible with index type. Mixed known properties + index signature require known props to match index value type.",
  "whyExists": "Dynamic dictionaries when key set unknown at compile time.",
  "mentalModel": "Open-ended column for any string key → number value.",
  "how": [
    "[key: string]: T for string-keyed bags.",
    "symbol index for unique keys rare.",
    "Record<Keys, V> preferred when keys are finite union.",
    "noUncheckedIndexedAccess adds undefined on read.",
    "Readonly index signature for immutable maps."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Known property incompatible with index value type — compile error.",
    "variant": "warning"
  },
  "example": "type Scores = { [player: string]: number; winner?: string };\nfunction total(scores: Scores): number {\n  return Object.values(scores).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);\n}\nconsole.log(total({ ada: 10, bob: 8 }));\nconst __typed: Scores = {} as Scores;\nconsole.log(\"export type { Scores }\");\n// type Scores = { [player: string]: number; winner?: string }; narrows allowed values",
  "exampleCaption": "Index signature scores[player: string]: number",
  "internals": [
    "Excess property checks stricter with index signatures.",
    "keyof includes string when string index present.",
    "Template literal keys in mapped types replace index sigs."
  ],
  "takeaways": [
    "[key: string]: T for string-keyed bags.",
    "symbol index for unique keys rare.",
    "Known property incompatible with index value type — compile error.",
    "Excess property checks stricter with index signatures."
  ],
  "revision": [
    "Index Signatures: Open-ended column for any string key → number value.",
    "[key: string]: T for string-keyed bags.",
    "symbol index for unique keys rare.",
    "Record<Keys, V> preferred when keys are finite union.",
    "Trap: Known property incompatible with index value type — compile error."
  ],
  "flashcards": [
    [
      "Index Signatures",
      "Index signature allows arbitrary keys: { [key: string]: number }."
    ],
    [
      "Mental model",
      "Open-ended column for any string key → number value."
    ],
    [
      "Common trap",
      "Known property incompatible with index value type — compile error."
    ],
    [
      "[key: string]: T for string-keyed bags.",
      "symbol index for unique keys rare."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Index Signatures in TypeScript and when do you use it?",
      "answerHint": "Index signature allows arbitrary keys: { [key: string]: number }. Keys must be compatible with index type. Mixed known properties + index signature require known props to match index value type."
    },
    {
      "level": "intermediate",
      "question": "Explain Index Signatures with a code example and one pitfall.",
      "answerHint": "[key: string]: T for string-keyed bags. symbol index for unique keys rare. Record<Keys, V> preferred when keys are finite union. noUncheckedIndexedAccess adds undefined on read. Readonly index signature for immutable maps. Pitfall: Known property incompatible with index value type — compile error."
    },
    {
      "level": "advanced",
      "question": "How would you explain Index Signatures in a senior frontend interview?",
      "answerHint": "Excess property checks stricter with index signatures. keyof includes string when string index present. Template literal keys in mapped types replace index sigs. type Scores = { [player: string]: number; winner?: string };\nfunction total(scores: Scores): number {\n  return Object.va"
    }
  ],
  "pitfalls": [
    "Known property incompatible with index value type — compile error."
  ],
  "interview": {
    "expectations": [
      "Explain Index Signatures with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Excess property checks stricter with index signatures."
    ],
    "commonQuestions": [
      "What is Index Signatures?",
      "When would you choose Index Signatures over alternatives?",
      "What is the classic Index Signatures interview trap?"
    ],
    "traps": [
      "Known property incompatible with index value type — compile error."
    ],
    "misconceptions": [
      "Dynamic dictionaries when key set unknown at compile time."
    ],
    "strongSignals": [
      "Uses Index Signatures to remove invalid states, not just document them."
    ]
  }
})
