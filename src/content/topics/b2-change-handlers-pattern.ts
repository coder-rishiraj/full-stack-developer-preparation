import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "ChangeHandlers Pattern",
  "whatIsIt": "Typed change handlers: for field F in form, handler type is (value: T[F]) => void. Build HandlerMap<T> = { [K in keyof T as `on${Capitalize<string & K>}Change`]: (v: T[K]) => void }. Ensures prop names match field types.",
  "whyExists": "Senior React/form library pattern — ties UI event props to state shape.",
  "mentalModel": "Every form field gets correctly typed onXChange callback name.",
  "how": [
    "Define FormState interface first.",
    "Map keys to onFieldChange handler props.",
    "Use satisfies on implementation object.",
    "Generic component props extend HandlerMap<T>.",
    "Pair with discriminated union for field-specific payloads if needed."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Manual handler props — drift from Form fields when renamed.",
    "variant": "warning"
  },
  "example": "type Form = { email: string; age: number };\ntype ChangeHandlers<T> = {\n  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;\n};\nconst handlers: ChangeHandlers<Form> = {\n  onEmailChange: (v) => console.log(v.toLowerCase()),\n  onAgeChange: (v) => console.log(v.toFixed(0)),\nhandlers.onEmailChange('a@b.co');",
  "exampleCaption": "onEmailChange receives string; onAgeChange number",
  "internals": [
    "Template literal distributes over keyof.",
    "Capitalize ensures React camelCase convention.",
    "Omit keys with never in remapping to skip fields."
  ],
  "takeaways": [
    "Define FormState interface first.",
    "Map keys to onFieldChange handler props.",
    "Manual handler props — drift from Form fields when renamed.",
    "Template literal distributes over keyof."
  ],
  "revision": [
    "ChangeHandlers Pattern: Every form field gets correctly typed onXChange callback name.",
    "Define FormState interface first.",
    "Map keys to onFieldChange handler props.",
    "Use satisfies on implementation object.",
    "Trap: Manual handler props — drift from Form fields when renamed."
  ],
  "flashcards": [
    [
      "ChangeHandlers Pattern",
      "Typed change handlers: for field F in form, handler type is (value: T[F]) => void."
    ],
    [
      "Mental model",
      "Every form field gets correctly typed onXChange callback name."
    ],
    [
      "Common trap",
      "Manual handler props — drift from Form fields when renamed."
    ],
    [
      "Define FormState interface first.",
      "Map keys to onFieldChange handler props."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is ChangeHandlers Pattern in TypeScript and when do you use it?",
      "answerHint": "Typed change handlers: for field F in form, handler type is (value: T[F]) => void. Build HandlerMap<T> = { [K in keyof T as `on${Capitalize<string & K>}Change`]: (v: T[K]) => void }. Ensures prop names match field types."
    },
    {
      "level": "intermediate",
      "question": "Explain ChangeHandlers Pattern with a code example and one pitfall.",
      "answerHint": "Define FormState interface first. Map keys to onFieldChange handler props. Use satisfies on implementation object. Generic component props extend HandlerMap<T>. Pair with discriminated union for field-specific payloads if needed. Pitfall: Manual handler props — drift from Form fields when renamed."
    },
    {
      "level": "advanced",
      "question": "How would you explain ChangeHandlers Pattern in a senior frontend interview?",
      "answerHint": "Template literal distributes over keyof. Capitalize ensures React camelCase convention. Omit keys with never in remapping to skip fields. type Form = { email: string; age: number };\ntype ChangeHandlers<T> = {\n  [K in keyof T as `on${Capitalize<string & K>}Ch"
    }
  ],
  "pitfalls": [
    "Manual handler props — drift from Form fields when renamed."
  ],
  "interview": {
    "expectations": [
      "Explain ChangeHandlers Pattern with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Template literal distributes over keyof."
    ],
    "commonQuestions": [
      "What is ChangeHandlers Pattern?",
      "When would you choose ChangeHandlers Pattern over alternatives?",
      "What is the classic ChangeHandlers Pattern interview trap?"
    ],
    "traps": [
      "Manual handler props — drift from Form fields when renamed."
    ],
    "misconceptions": [
      "Senior React/form library pattern — ties UI event props to state shape."
    ],
    "strongSignals": [
      "Uses ChangeHandlers Pattern to remove invalid states, not just document them."
    ]
  }
})
