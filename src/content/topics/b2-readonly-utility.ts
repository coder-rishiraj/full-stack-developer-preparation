import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Readonly",
  "whatIsIt": "Readonly<T> makes all properties readonly at top level. ReadonlyArray prevents mutating methods. Deep readonly needs recursive utility or libraries like type-fest.",
  "whyExists": "Immutable views of config and state snapshots.",
  "mentalModel": "Plastic wrap on object — cannot reassign properties.",
  "how": [
    "function render(props: Readonly<Props>).",
    "Readonly<User> for selector output.",
    "Combine with Pick for immutable id field subset.",
    "as const often sufficient for literals.",
    "DeepReadonly custom mapped recursion."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Readonly shallow — nested object fields still mutable.",
    "variant": "warning"
  },
  "example": "type Point = { x: number; y: number };\nfunction translate(p: Readonly<Point>, dx: number): Point {\n  return { x: p.x + dx, y: p.y };\n}\nconsole.log(translate({ x: 0, y: 0 }, 5));\nconst __typed: Point = {} as Point;\nconsole.log(\"export type { Point }\");\n// type Point = { x: number; y: number }; narrows allowed values",
  "exampleCaption": "Readonly param; returns new Point",
  "internals": [
    "Mapped type adds readonly modifier.",
    "ReadonlyArray is separate built-in alias.",
    "Const assertions overlap for literals."
  ],
  "takeaways": [
    "function render(props: Readonly<Props>).",
    "Readonly<User> for selector output.",
    "Readonly shallow — nested object fields still mutable.",
    "Mapped type adds readonly modifier."
  ],
  "revision": [
    "Readonly: Plastic wrap on object — cannot reassign properties.",
    "function render(props: Readonly<Props>).",
    "Readonly<User> for selector output.",
    "Combine with Pick for immutable id field subset.",
    "Trap: Readonly shallow — nested object fields still mutable."
  ],
  "flashcards": [
    [
      "Readonly",
      "Readonly<T> makes all properties readonly at top level."
    ],
    [
      "Mental model",
      "Plastic wrap on object — cannot reassign properties."
    ],
    [
      "Common trap",
      "Readonly shallow — nested object fields still mutable."
    ],
    [
      "function render(props: Readonly<Props>).",
      "Readonly<User> for selector output."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Readonly in TypeScript and when do you use it?",
      "answerHint": "Readonly<T> makes all properties readonly at top level. ReadonlyArray prevents mutating methods. Deep readonly needs recursive utility or libraries like type-fest."
    },
    {
      "level": "intermediate",
      "question": "Explain Readonly with a code example and one pitfall.",
      "answerHint": "function render(props: Readonly<Props>). Readonly<User> for selector output. Combine with Pick for immutable id field subset. as const often sufficient for literals. DeepReadonly custom mapped recursion. Pitfall: Readonly shallow — nested object fields still mutable."
    },
    {
      "level": "advanced",
      "question": "How would you explain Readonly in a senior frontend interview?",
      "answerHint": "Mapped type adds readonly modifier. ReadonlyArray is separate built-in alias. Const assertions overlap for literals. type Point = { x: number; y: number };\nfunction translate(p: Readonly<Point>, dx: number): Point {\n  return { x: p.x + d"
    }
  ],
  "pitfalls": [
    "Readonly shallow — nested object fields still mutable."
  ],
  "interview": {
    "expectations": [
      "Explain Readonly with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Mapped type adds readonly modifier."
    ],
    "commonQuestions": [
      "What is Readonly?",
      "When would you choose Readonly over alternatives?",
      "What is the classic Readonly interview trap?"
    ],
    "traps": [
      "Readonly shallow — nested object fields still mutable."
    ],
    "misconceptions": [
      "Immutable views of config and state snapshots."
    ],
    "strongSignals": [
      "Uses Readonly to remove invalid states, not just document them."
    ]
  }
})
