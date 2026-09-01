import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement Exclusive Button Props",
  "whatIsIt": "Implementation: build React-style props union where controlled and uncontrolled modes are mutually exclusive using never fields.",
  "whyExists": "Live code mutually exclusive props pattern.",
  "mentalModel": "Type Input props so value/defaultValue conflict is compile error.",
  "how": [
    "Define Controlled and Uncontrolled types with never.",
    "Union into InputProps.",
    "Component destructures safely after mode check.",
    "Test assigning both props — should error.",
    "Optional generic Value type param."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using optional both value and defaultValue — union allows neither; handle empty case.",
    "variant": "warning"
  },
  "example": "type Controlled<T> = { value: T; onChange: (v: T) => void; defaultValue?: never };\ntype Uncontrolled<T> = { defaultValue: T; value?: never };\ntype FieldProps<T> = Controlled<T> | Uncontrolled<T>;\nfunction Field<T>(props: FieldProps<T>) {\n  return 'value' in props && props.value !== undefined\n    ? String(props.value)\n    : String(props.defaultValue);\n}\nconsole.log(Field({ value: 1, onChange: () => {} }));",
  "exampleCaption": "Field accepts controlled OR uncontrolled props",
  "internals": [
    "never optional removes key from other union branch.",
    "in operator narrows union props in component body.",
    "Matches React controlled component documentation."
  ],
  "takeaways": [
    "Define Controlled and Uncontrolled types with never.",
    "Union into InputProps.",
    "Using optional both value and defaultValue — union allows neither; handle empty case.",
    "never optional removes key from other union branch."
  ],
  "revision": [
    "Implement Exclusive Button Props: Type Input props so value/defaultValue conflict is compile error.",
    "Define Controlled and Uncontrolled types with never.",
    "Union into InputProps.",
    "Component destructures safely after mode check.",
    "Trap: Using optional both value and defaultValue — union allows neither; handle empty case."
  ],
  "flashcards": [
    [
      "Implement Exclusive Button Props",
      "Implementation: build React-style props union where controlled and uncontrolled modes are mutually exclusive using never fields."
    ],
    [
      "Mental model",
      "Type Input props so value/defaultValue conflict is compile error."
    ],
    [
      "Common trap",
      "Using optional both value and defaultValue — union allows neither; handle empty case."
    ],
    [
      "Define Controlled and Uncontrolled types with never.",
      "Union into InputProps."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Implement Exclusive Button Props in TypeScript and when do you use it?",
      "answerHint": "Implementation: build React-style props union where controlled and uncontrolled modes are mutually exclusive using never fields."
    },
    {
      "level": "intermediate",
      "question": "Explain Implement Exclusive Button Props with a code example and one pitfall.",
      "answerHint": "Define Controlled and Uncontrolled types with never. Union into InputProps. Component destructures safely after mode check. Test assigning both props — should error. Optional generic Value type param. Pitfall: Using optional both value and defaultValue — union allows neither; handle empty case."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement Exclusive Button Props in a senior frontend interview?",
      "answerHint": "never optional removes key from other union branch. in operator narrows union props in component body. Matches React controlled component documentation. type Controlled<T> = { value: T; onChange: (v: T) => void; defaultValue?: never };\ntype Uncontrolled<T> = { defaultValue"
    }
  ],
  "pitfalls": [
    "Using optional both value and defaultValue — union allows neither; handle empty case."
  ],
  "interview": {
    "expectations": [
      "Explain Implement Exclusive Button Props with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "never optional removes key from other union branch."
    ],
    "commonQuestions": [
      "What is Implement Exclusive Button Props?",
      "When would you choose Implement Exclusive Button Props over alternatives?",
      "What is the classic Implement Exclusive Button Props interview trap?"
    ],
    "traps": [
      "Using optional both value and defaultValue — union allows neither; handle empty case."
    ],
    "misconceptions": [
      "Live code mutually exclusive props pattern."
    ],
    "strongSignals": [
      "Uses Implement Exclusive Button Props to remove invalid states, not just document them."
    ]
  }
})
