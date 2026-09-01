import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Controlled vs Uncontrolled",
  "whatIsIt": "Controlled components: value + onChange from parent state. Uncontrolled: defaultValue + ref or internal state. TS models exclusivity with union props. Typing onChange as (value: T) => void matches controlled pattern.",
  "whyExists": "React docs pattern — types should encode one mode per usage.",
  "mentalModel": "Remote-controlled car (value) vs toy with own batteries (defaultValue).",
  "how": [
    "Controlled: value required with onChange.",
    "Uncontrolled: defaultValue optional, value absent.",
    "Ref typing for uncontrolled input: RefObject<HTMLInputElement>.",
    "Generic Input<T> for number vs string parsers.",
    "Never both value and defaultValue in types."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Casting props to any to pass both value and defaultValue — defeats pattern.",
    "variant": "warning"
  },
  "example": "type ControlledNumber = {\n  value: number;\n  onChange: (n: number) => void;\n  defaultValue?: never;\n};\ntype UncontrolledNumber = { defaultValue?: number; value?: never };\ntype NumberFieldProps = ControlledNumber | UncontrolledNumber;\n// type ControlledNumber = { narrows allowed values",
  "exampleCaption": "Union separates controlled vs uncontrolled number field",
  "internals": [
    "React warns at runtime if switching modes.",
    "Fully controlled needs onChange for every value prop update.",
    "File inputs often uncontrolled-only in React."
  ],
  "takeaways": [
    "Controlled: value required with onChange.",
    "Uncontrolled: defaultValue optional, value absent.",
    "Casting props to any to pass both value and defaultValue — defeats pattern.",
    "React warns at runtime if switching modes."
  ],
  "revision": [
    "Controlled vs Uncontrolled: Remote-controlled car (value) vs toy with own batteries (defaultValue).",
    "Controlled: value required with onChange.",
    "Uncontrolled: defaultValue optional, value absent.",
    "Ref typing for uncontrolled input: RefObject<HTMLInputElement>.",
    "Trap: Casting props to any to pass both value and defaultValue — defeats pattern."
  ],
  "flashcards": [
    [
      "Controlled vs Uncontrolled",
      "Controlled components: value + onChange from parent state."
    ],
    [
      "Mental model",
      "Remote-controlled car (value) vs toy with own batteries (defaultValue)."
    ],
    [
      "Common trap",
      "Casting props to any to pass both value and defaultValue — defeats pattern."
    ],
    [
      "Controlled: value required with onChange.",
      "Uncontrolled: defaultValue optional, value absent."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Controlled vs Uncontrolled in TypeScript and when do you use it?",
      "answerHint": "Controlled components: value + onChange from parent state. Uncontrolled: defaultValue + ref or internal state. TS models exclusivity with union props. Typing onChange as (value: T) => void matches controlled pattern."
    },
    {
      "level": "intermediate",
      "question": "Explain Controlled vs Uncontrolled with a code example and one pitfall.",
      "answerHint": "Controlled: value required with onChange. Uncontrolled: defaultValue optional, value absent. Ref typing for uncontrolled input: RefObject<HTMLInputElement>. Generic Input<T> for number vs string parsers. Never both value and defaultValue in types. Pitfall: Casting props to any to pass both value and defaultValue — defeats pattern."
    },
    {
      "level": "advanced",
      "question": "How would you explain Controlled vs Uncontrolled in a senior frontend interview?",
      "answerHint": "React warns at runtime if switching modes. Fully controlled needs onChange for every value prop update. File inputs often uncontrolled-only in React. type ControlledNumber = {\n  value: number;\n  onChange: (n: number) => void;\n  defaultValue?: never;\n};\ntype Uncontrolled"
    }
  ],
  "pitfalls": [
    "Casting props to any to pass both value and defaultValue — defeats pattern."
  ],
  "interview": {
    "expectations": [
      "Explain Controlled vs Uncontrolled with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "React warns at runtime if switching modes."
    ],
    "commonQuestions": [
      "What is Controlled vs Uncontrolled?",
      "When would you choose Controlled vs Uncontrolled over alternatives?",
      "What is the classic Controlled vs Uncontrolled interview trap?"
    ],
    "traps": [
      "Casting props to any to pass both value and defaultValue — defeats pattern."
    ],
    "misconceptions": [
      "React docs pattern — types should encode one mode per usage."
    ],
    "strongSignals": [
      "Uses Controlled vs Uncontrolled to remove invalid states, not just document them."
    ]
  }
})
