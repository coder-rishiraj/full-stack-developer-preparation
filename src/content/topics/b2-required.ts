import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Required",
  "whatIsIt": "Required<T> removes optionality from all properties — opposite of Partial. Useful after merging defaults when you need guaranteed complete object.",
  "whyExists": "Turn draft/config optional fields into definite shape post-validation.",
  "mentalModel": "Fill every blank on the form before submit.",
  "how": [
    "Required<Partial<User>> after merge with defaults.",
    "Combine with Pick for subset completeness.",
    "Runtime validation still needed — types not enforced at runtime.",
    "Deep required needs custom type.",
    "Use after satisfies check on config object."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Required on interface with optional ? may not remove undefined from union members.",
    "variant": "warning"
  },
  "example": "type Draft = { title?: string; body?: string };\ntype Published = Required<Draft>;\nfunction publish(d: Published) { console.log(d.title.length, d.body.length); }\npublish({ title: 'Hi', body: 'Text' });\nconst __typed: Draft = {} as Draft;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { Draft }\");\n// type Draft = { title?: string; body?: string }; narrows allowed values",
  "exampleCaption": "Required makes title and body mandatory",
  "internals": [
    "Removes ? modifier via -? mapped type.",
    "Does not add missing properties that never existed on T.",
    "Works on nested one level only."
  ],
  "takeaways": [
    "Required<Partial<User>> after merge with defaults.",
    "Combine with Pick for subset completeness.",
    "Required on interface with optional ? may not remove undefined from union members.",
    "Removes ? modifier via -? mapped type."
  ],
  "revision": [
    "Required: Fill every blank on the form before submit.",
    "Required<Partial<User>> after merge with defaults.",
    "Combine with Pick for subset completeness.",
    "Runtime validation still needed — types not enforced at runtime.",
    "Trap: Required on interface with optional ? may not remove undefined from union members."
  ],
  "flashcards": [
    [
      "Required",
      "Required<T> removes optionality from all properties — opposite of Partial."
    ],
    [
      "Mental model",
      "Fill every blank on the form before submit."
    ],
    [
      "Common trap",
      "Required on interface with optional ? may not remove undefined from union members."
    ],
    [
      "Required<Partial<User>> after merge with defaults.",
      "Combine with Pick for subset completeness."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Required in TypeScript and when do you use it?",
      "answerHint": "Required<T> removes optionality from all properties — opposite of Partial. Useful after merging defaults when you need guaranteed complete object."
    },
    {
      "level": "intermediate",
      "question": "Explain Required with a code example and one pitfall.",
      "answerHint": "Required<Partial<User>> after merge with defaults. Combine with Pick for subset completeness. Runtime validation still needed — types not enforced at runtime. Deep required needs custom type. Use after satisfies check on config object. Pitfall: Required on interface with optional ? may not remove undefined from union members."
    },
    {
      "level": "advanced",
      "question": "How would you explain Required in a senior frontend interview?",
      "answerHint": "Removes ? modifier via -? mapped type. Does not add missing properties that never existed on T. Works on nested one level only. type Draft = { title?: string; body?: string };\ntype Published = Required<Draft>;\nfunction publish(d: Published) { conso"
    }
  ],
  "pitfalls": [
    "Required on interface with optional ? may not remove undefined from union members."
  ],
  "interview": {
    "expectations": [
      "Explain Required with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Removes ? modifier via -? mapped type."
    ],
    "commonQuestions": [
      "What is Required?",
      "When would you choose Required over alternatives?",
      "What is the classic Required interview trap?"
    ],
    "traps": [
      "Required on interface with optional ? may not remove undefined from union members."
    ],
    "misconceptions": [
      "Turn draft/config optional fields into definite shape post-validation."
    ],
    "strongSignals": [
      "Uses Required to remove invalid states, not just document them."
    ]
  }
})
