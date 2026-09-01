import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Optional & Rest Parameters",
  "whatIsIt": "Optional parameters use ? or defaults; rest collects remaining args as typed array. Tuple rest types fix minimum arity: (head: string, ...tail: number[]).",
  "whyExists": "Variadic APIs (format strings, log helpers) need precise rest typing.",
  "mentalModel": "Required front of line, typed queue for the rest.",
  "how": [
    "function log(level: string, ...msgs: string[]).",
    "Optional before rest: (a?: number, ...rest: string[]) — rare, avoid confusion.",
    "Tuple rest for fixed prefix: [string, number, ...boolean[]].",
    "Spread call typed with Parameters and rest.",
    "Defaults make param optional in type until applied."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Required param after optional — use default or union instead.",
    "variant": "warning"
  },
  "example": "function format(template: string, ...values: (string | number)[]): string {\n  return values.reduce<string>((acc, v, i) => acc.replace(`{${i}}`, String(v)), template);\n}\nconsole.log(format('{0} + {1}', 2, 3));\nconsole.log(format('Hello {0}', 'TS'));\nconst parts: (string | number)[] = [1, 'two', 3];\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time",
  "exampleCaption": "Rest values typed as (string | number)[]",
  "internals": [
    "Rest must be last parameter.",
    "Rest infers tuple when arguments are literal tuple.",
    "Function.apply needs tuple typing for strict calls."
  ],
  "takeaways": [
    "function log(level: string, ...msgs: string[]).",
    "Optional before rest: (a?: number, ...rest: string[]) — rare, avoid confusion.",
    "Required param after optional — use default or union instead.",
    "Rest must be last parameter."
  ],
  "revision": [
    "Optional & Rest Parameters: Required front of line, typed queue for the rest.",
    "function log(level: string, ...msgs: string[]).",
    "Optional before rest: (a?: number, ...rest: string[]) — rare, avoid confusion.",
    "Tuple rest for fixed prefix: [string, number, ...boolean[]].",
    "Trap: Required param after optional — use default or union instead."
  ],
  "flashcards": [
    [
      "Optional & Rest Parameters",
      "Optional parameters use ? or defaults; rest collects remaining args as typed array."
    ],
    [
      "Mental model",
      "Required front of line, typed queue for the rest."
    ],
    [
      "Common trap",
      "Required param after optional — use default or union instead."
    ],
    [
      "function log(level: string, ...msgs: string[]).",
      "Optional before rest: (a?: number, ...rest: string[]) — rare, avoid confusion."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Optional & Rest Parameters in TypeScript and when do you use it?",
      "answerHint": "Optional parameters use ? or defaults; rest collects remaining args as typed array. Tuple rest types fix minimum arity: (head: string, ...tail: number[])."
    },
    {
      "level": "intermediate",
      "question": "Explain Optional & Rest Parameters with a code example and one pitfall.",
      "answerHint": "function log(level: string, ...msgs: string[]). Optional before rest: (a?: number, ...rest: string[]) — rare, avoid confusion. Tuple rest for fixed prefix: [string, number, ...boolean[]]. Spread call typed with Parameters and rest. Defaults make param optional in type until applied. Pitfall: Required param after optional — use default or union instead."
    },
    {
      "level": "advanced",
      "question": "How would you explain Optional & Rest Parameters in a senior frontend interview?",
      "answerHint": "Rest must be last parameter. Rest infers tuple when arguments are literal tuple. Function.apply needs tuple typing for strict calls. function format(template: string, ...values: (string | number)[]): string {\n  return values.reduce<string>((acc, v, i) ="
    }
  ],
  "pitfalls": [
    "Required param after optional — use default or union instead."
  ],
  "interview": {
    "expectations": [
      "Explain Optional & Rest Parameters with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Rest must be last parameter."
    ],
    "commonQuestions": [
      "What is Optional & Rest Parameters?",
      "When would you choose Optional & Rest Parameters over alternatives?",
      "What is the classic Optional & Rest Parameters interview trap?"
    ],
    "traps": [
      "Required param after optional — use default or union instead."
    ],
    "misconceptions": [
      "Variadic APIs (format strings, log helpers) need precise rest typing."
    ],
    "strongSignals": [
      "Uses Optional & Rest Parameters to remove invalid states, not just document them."
    ]
  }
})
