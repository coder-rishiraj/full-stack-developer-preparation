import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Key Remapping (as)",
  "whatIsIt": "Mapped type key remapping: [K in keyof T as NewKey] transforms property names. Filter with never to omit. Enables prefix/suffix renames type-safely.",
  "whyExists": "Advanced mapped type feature for API field renaming utilities.",
  "mentalModel": "Rename columns while transforming row type.",
  "how": [
    "as `${K}Id` to suffix keys.",
    "Filter optional: as K extends optional ? never : K.",
    "Combine with conditional on K.",
    "Getters pattern: as `get${Capitalize<string & K>}`.",
    "Avoid infinite recursion in remapped keys."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Capitalize on symbol keys — use string & K constraint.",
    "variant": "warning"
  },
  "example": "type Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];\n};\ntype User = { name: string; age: number };\ntype UserGetters = Getters<User>;\nconst g: UserGetters = { getName: () => 'Ada', getAge: () => 30 };\nconsole.log(g.getName());\n// type Getters<T> = { narrows allowed values",
  "exampleCaption": "Keys remapped to getName, getAge",
  "internals": [
    "Remapping in TS 4.1+ mapped types.",
    "never as NewKey omits property from result.",
    "Preserves value types while changing keys."
  ],
  "takeaways": [
    "as `${K}Id` to suffix keys.",
    "Filter optional: as K extends optional ? never : K.",
    "Capitalize on symbol keys — use string & K constraint.",
    "Remapping in TS 4.1+ mapped types."
  ],
  "revision": [
    "Key Remapping (as): Rename columns while transforming row type.",
    "as `${K}Id` to suffix keys.",
    "Filter optional: as K extends optional ? never : K.",
    "Combine with conditional on K.",
    "Trap: Capitalize on symbol keys — use string & K constraint."
  ],
  "flashcards": [
    [
      "Key Remapping (as)",
      "Mapped type key remapping: [K in keyof T as NewKey] transforms property names."
    ],
    [
      "Mental model",
      "Rename columns while transforming row type."
    ],
    [
      "Common trap",
      "Capitalize on symbol keys — use string & K constraint."
    ],
    [
      "as `${K}Id` to suffix keys.",
      "Filter optional: as K extends optional ? never : K."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Key Remapping (as) in TypeScript and when do you use it?",
      "answerHint": "Mapped type key remapping: [K in keyof T as NewKey] transforms property names. Filter with never to omit. Enables prefix/suffix renames type-safely."
    },
    {
      "level": "intermediate",
      "question": "Explain Key Remapping (as) with a code example and one pitfall.",
      "answerHint": "as `${K}Id` to suffix keys. Filter optional: as K extends optional ? never : K. Combine with conditional on K. Getters pattern: as `get${Capitalize<string & K>}`. Avoid infinite recursion in remapped keys. Pitfall: Capitalize on symbol keys — use string & K constraint."
    },
    {
      "level": "advanced",
      "question": "How would you explain Key Remapping (as) in a senior frontend interview?",
      "answerHint": "Remapping in TS 4.1+ mapped types. never as NewKey omits property from result. Preserves value types while changing keys. type Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];\n};\ntype User = { name: string; age: "
    }
  ],
  "pitfalls": [
    "Capitalize on symbol keys — use string & K constraint."
  ],
  "interview": {
    "expectations": [
      "Explain Key Remapping (as) with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Remapping in TS 4.1+ mapped types."
    ],
    "commonQuestions": [
      "What is Key Remapping (as)?",
      "When would you choose Key Remapping (as) over alternatives?",
      "What is the classic Key Remapping (as) interview trap?"
    ],
    "traps": [
      "Capitalize on symbol keys — use string & K constraint."
    ],
    "misconceptions": [
      "Advanced mapped type feature for API field renaming utilities."
    ],
    "strongSignals": [
      "Uses Key Remapping (as) to remove invalid states, not just document them."
    ]
  }
})
