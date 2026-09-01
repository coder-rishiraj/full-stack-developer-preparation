import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Parameter Destructuring",
  "whatIsIt": "TypeScript types destructured parameters inline or via a named type: function f({ id, name }: User). Defaults and renaming work like JS; types attach to the pattern. Rest in objects collects remainder with typed Record.",
  "whyExists": "React props and options objects commonly use destructuring — typing the pattern is essential.",
  "mentalModel": "Unpack a typed suitcase at the function door.",
  "how": [
    "Inline: ({ x, y }: { x: number; y: number }).",
    "Named alias: type Props = { label: string }; function C({ label }: Props).",
    "Default values combine with optional types carefully.",
    "Rest ...others typed as Omit when forwarding.",
    "Array destructuring tuples preserve positions."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Forgetting optional means undefined — default in pattern fixes without changing type.",
    "variant": "warning"
  },
  "example": "type Options = { host: string; port?: number; ssl?: boolean };\nfunction connect({ host, port = 443, ssl = true }: Options) {\n  return `${ssl ? 'https' : 'http'}://${host}:${port}`;\n}\nconsole.log(connect({ host: 'localhost' }));\nconst __typed: Options = {} as Options;\nconsole.log(\"export type { Options }\");\n// type Options = { host: string; port?: number; ssl?: boolean }; narrows allowed values",
  "exampleCaption": "Destructured Options with defaults",
  "internals": [
    "Parameter properties in classes combine destructure + visibility.",
    "Contextual typing applies to nested destructuring.",
    "Binding patterns require all non-optional keys or defaults."
  ],
  "takeaways": [
    "Inline: ({ x, y }: { x: number; y: number }).",
    "Named alias: type Props = { label: string }; function C({ label }: Props).",
    "Forgetting optional means undefined — default in pattern fixes without changing type.",
    "Parameter properties in classes combine destructure + visibility."
  ],
  "revision": [
    "Parameter Destructuring: Unpack a typed suitcase at the function door.",
    "Inline: ({ x, y }: { x: number; y: number }).",
    "Named alias: type Props = { label: string }; function C({ label }: Props).",
    "Default values combine with optional types carefully.",
    "Trap: Forgetting optional means undefined — default in pattern fixes without changing type."
  ],
  "flashcards": [
    [
      "Parameter Destructuring",
      "TypeScript types destructured parameters inline or via a named type: function f({ id, name }: User)."
    ],
    [
      "Mental model",
      "Unpack a typed suitcase at the function door."
    ],
    [
      "Common trap",
      "Forgetting optional means undefined — default in pattern fixes without changing type."
    ],
    [
      "Inline: ({ x, y }: { x: number; y: number }).",
      "Named alias: type Props = { label: string }; function C({ label }: Props)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Parameter Destructuring in TypeScript and when do you use it?",
      "answerHint": "TypeScript types destructured parameters inline or via a named type: function f({ id, name }: User). Defaults and renaming work like JS; types attach to the pattern. Rest in objects collects remainder with typed Record."
    },
    {
      "level": "intermediate",
      "question": "Explain Parameter Destructuring with a code example and one pitfall.",
      "answerHint": "Inline: ({ x, y }: { x: number; y: number }). Named alias: type Props = { label: string }; function C({ label }: Props). Default values combine with optional types carefully. Rest ...others typed as Omit when forwarding. Array destructuring tuples preserve positions. Pitfall: Forgetting optional means undefined — default in pattern fixes without changing type."
    },
    {
      "level": "advanced",
      "question": "How would you explain Parameter Destructuring in a senior frontend interview?",
      "answerHint": "Parameter properties in classes combine destructure + visibility. Contextual typing applies to nested destructuring. Binding patterns require all non-optional keys or defaults. type Options = { host: string; port?: number; ssl?: boolean };\nfunction connect({ host, port = 443, ssl = true }: Option"
    }
  ],
  "pitfalls": [
    "Forgetting optional means undefined — default in pattern fixes without changing type."
  ],
  "interview": {
    "expectations": [
      "Explain Parameter Destructuring with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Parameter properties in classes combine destructure + visibility."
    ],
    "commonQuestions": [
      "What is Parameter Destructuring?",
      "When would you choose Parameter Destructuring over alternatives?",
      "What is the classic Parameter Destructuring interview trap?"
    ],
    "traps": [
      "Forgetting optional means undefined — default in pattern fixes without changing type."
    ],
    "misconceptions": [
      "React props and options objects commonly use destructuring — typing the pattern is essential."
    ],
    "strongSignals": [
      "Uses Parameter Destructuring to remove invalid states, not just document them."
    ]
  }
})
