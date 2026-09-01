import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Object Types",
  "whatIsIt": "Object types describe shape with known properties: { id: string; count: number }. Excess property checking catches typos on object literals. Index signatures allow dynamic keys. Types are structural — extra properties on variables often OK when not fresh literals.",
  "whyExists": "Most domain models are objects — accurate shapes drive autocomplete and refactors.",
  "mentalModel": "A form with named fields — each label has an expected value type.",
  "how": [
    "Define interfaces or type aliases for entities.",
    "Separate creation vs persisted shapes (optional id).",
    "Use Record<K,V> for uniform dynamic keys.",
    "Nested objects: inline or named aliases.",
    "Prefer unknown over empty object for \"some object\"."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Fresh literal with typo extra field — excess property error; assigned variable may not error.",
    "variant": "warning"
  },
  "example": "type Task = { id: string; title: string; done: boolean };\nfunction toggle(t: Task): Task {\n  return { ...t, done: !t.done };\n}\nconst t: Task = { id: '1', title: 'Learn TS', done: false };\nconsole.log(toggle(t).done);\nconst __typed: Task = {} as Task;\n// type Task = { id: string; title: string; done: boolean }; narrows allowed values",
  "exampleCaption": "Task object spread preserves type",
  "internals": [
    "Structural typing: matching shape is assignable.",
    "Weak object types (Object) nearly useless — avoid.",
    "Freshness checking applies to object literals only."
  ],
  "takeaways": [
    "Define interfaces or type aliases for entities.",
    "Separate creation vs persisted shapes (optional id).",
    "Fresh literal with typo extra field — excess property error; assigned variable may not error.",
    "Structural typing: matching shape is assignable."
  ],
  "revision": [
    "Object Types: A form with named fields — each label has an expected value type.",
    "Define interfaces or type aliases for entities.",
    "Separate creation vs persisted shapes (optional id).",
    "Use Record<K,V> for uniform dynamic keys.",
    "Trap: Fresh literal with typo extra field — excess property error; assigned variable may not error."
  ],
  "flashcards": [
    [
      "Object Types",
      "Object types describe shape with known properties: { id: string; count: number }."
    ],
    [
      "Mental model",
      "A form with named fields — each label has an expected value type."
    ],
    [
      "Common trap",
      "Fresh literal with typo extra field — excess property error; assigned variable may not error."
    ],
    [
      "Define interfaces or type aliases for entities.",
      "Separate creation vs persisted shapes (optional id)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Object Types in TypeScript and when do you use it?",
      "answerHint": "Object types describe shape with known properties: { id: string; count: number }. Excess property checking catches typos on object literals. Index signatures allow dynamic keys. Types are structural — extra properties on variables often OK when not fresh literals."
    },
    {
      "level": "intermediate",
      "question": "Explain Object Types with a code example and one pitfall.",
      "answerHint": "Define interfaces or type aliases for entities. Separate creation vs persisted shapes (optional id). Use Record<K,V> for uniform dynamic keys. Nested objects: inline or named aliases. Prefer unknown over empty object for \"some object\". Pitfall: Fresh literal with typo extra field — excess property error; assigned variable may not error."
    },
    {
      "level": "advanced",
      "question": "How would you explain Object Types in a senior frontend interview?",
      "answerHint": "Structural typing: matching shape is assignable. Weak object types (Object) nearly useless — avoid. Freshness checking applies to object literals only. type Task = { id: string; title: string; done: boolean };\nfunction toggle(t: Task): Task {\n  return { ...t, done: !t.don"
    }
  ],
  "pitfalls": [
    "Fresh literal with typo extra field — excess property error; assigned variable may not error."
  ],
  "interview": {
    "expectations": [
      "Explain Object Types with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Structural typing: matching shape is assignable."
    ],
    "commonQuestions": [
      "What is Object Types?",
      "When would you choose Object Types over alternatives?",
      "What is the classic Object Types interview trap?"
    ],
    "traps": [
      "Fresh literal with typo extra field — excess property error; assigned variable may not error."
    ],
    "misconceptions": [
      "Most domain models are objects — accurate shapes drive autocomplete and refactors."
    ],
    "strongSignals": [
      "Uses Object Types to remove invalid states, not just document them."
    ]
  }
})
