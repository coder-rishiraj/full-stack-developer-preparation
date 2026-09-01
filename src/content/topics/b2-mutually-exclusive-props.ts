import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Mutually Exclusive Props",
  "whatIsIt": "Mutually exclusive props: never allow conflicting props together — use union: { a: string; b?: never } | { b: string; a?: never }. Or XOR utility. Common: controlled vs uncontrolled value props.",
  "whyExists": "GreatFrontEnd senior interview — prevent impossible prop combinations at compile time.",
  "mentalModel": "Either supply value OR defaultValue, never both.",
  "how": [
    "Union of two prop shapes with never on alternate field.",
    "type Exclusive<A, B> = (A & { [K in keyof B]?: never }) | (B & { [K in keyof A]?: never });",
    "Controlled: { value: T; onChange: ...; defaultValue?: never }.",
    "Document in JSDoc which branch to use.",
    "Discriminant prop alternative: mode: \"controlled\" | \"uncontrolled\"."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Both optional — allows neither value nor defaultValue; add validation or third variant.",
    "variant": "warning"
  },
  "example": "type Controlled = { value: string; onChange: (v: string) => void; defaultValue?: never };\ntype Uncontrolled = { defaultValue: string; value?: never; onChange?: (v: string) => void };\ntype InputProps = Controlled | Uncontrolled;\nfunction Field(props: InputProps) { return props.value ?? props.defaultValue; }\nconst __typed: Controlled = {} as Controlled;\nconsole.log(\"export type { Controlled }\");\n// type Controlled = { value: string; onChange: (v: string) => void; defaultValue?: never }; narrows allowed values\nconsole.log(Field('demo'));\n// Controlled is available to importers as a type alias",
  "exampleCaption": "InputProps union forbids value + defaultValue together",
  "internals": [
    "never optional props strip conflicting keys in union.",
    "TypeScript  unions not discriminated — both branches checked on access.",
    "React Hook Form vs controlled patterns use this."
  ],
  "takeaways": [
    "Union of two prop shapes with never on alternate field.",
    "type Exclusive<A, B> = (A & { [K in keyof B]?: never }) | (B & { [K in keyof A]?: never });",
    "Both optional — allows neither value nor defaultValue; add validation or third variant.",
    "never optional props strip conflicting keys in union."
  ],
  "revision": [
    "Mutually Exclusive Props: Either supply value OR defaultValue, never both.",
    "Union of two prop shapes with never on alternate field.",
    "type Exclusive<A, B> = (A & { [K in keyof B]?: never }) | (B & { [K in keyof A]?: never });",
    "Controlled: { value: T; onChange: ...; defaultValue?: never }.",
    "Trap: Both optional — allows neither value nor defaultValue; add validation or third variant."
  ],
  "flashcards": [
    [
      "Mutually Exclusive Props",
      "Mutually exclusive props: never allow conflicting props together — use union: { a: string; b?: never } | { b: string; a?: never }."
    ],
    [
      "Mental model",
      "Either supply value OR defaultValue, never both."
    ],
    [
      "Common trap",
      "Both optional — allows neither value nor defaultValue; add validation or third variant."
    ],
    [
      "Union of two prop shapes with never on alternate field.",
      "type Exclusive<A, B> = (A & { [K in keyof B]?: never }) | (B & { [K in keyof A]?: never });"
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Mutually Exclusive Props in TypeScript and when do you use it?",
      "answerHint": "Mutually exclusive props: never allow conflicting props together — use union: { a: string; b?: never } | { b: string; a?: never }. Or XOR utility. Common: controlled vs uncontrolled value props."
    },
    {
      "level": "intermediate",
      "question": "Explain Mutually Exclusive Props with a code example and one pitfall.",
      "answerHint": "Union of two prop shapes with never on alternate field. type Exclusive<A, B> = (A & { [K in keyof B]?: never }) | (B & { [K in keyof A]?: never }); Controlled: { value: T; onChange: ...; defaultValue?: never }. Document in JSDoc which branch to use. Discriminant prop alternative: mode: \"controlled\" | \"uncontrolled\". Pitfall: Both optional — allows neither value nor defaultValue; add validation or third variant."
    },
    {
      "level": "advanced",
      "question": "How would you explain Mutually Exclusive Props in a senior frontend interview?",
      "answerHint": "never optional props strip conflicting keys in union. TypeScript  unions not discriminated — both branches checked on access. React Hook Form vs controlled patterns use this. type Controlled = { value: string; onChange: (v: string) => void; defaultValue?: never };\ntype Uncontrolled = { defaultV"
    }
  ],
  "pitfalls": [
    "Both optional — allows neither value nor defaultValue; add validation or third variant."
  ],
  "interview": {
    "expectations": [
      "Explain Mutually Exclusive Props with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "never optional props strip conflicting keys in union."
    ],
    "commonQuestions": [
      "What is Mutually Exclusive Props?",
      "When would you choose Mutually Exclusive Props over alternatives?",
      "What is the classic Mutually Exclusive Props interview trap?"
    ],
    "traps": [
      "Both optional — allows neither value nor defaultValue; add validation or third variant."
    ],
    "misconceptions": [
      "GreatFrontEnd senior interview — prevent impossible prop combinations at compile time."
    ],
    "strongSignals": [
      "Uses Mutually Exclusive Props to remove invalid states, not just document them."
    ]
  }
})
