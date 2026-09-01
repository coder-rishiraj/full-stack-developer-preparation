import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Arrow Functions",
  "whatIsIt": "Arrow functions share function typing; they lack own this, arguments, and prototype. Typing: const f = (x: number): number => x * 2. Useful for callbacks where lexical this matters in TS+React.",
  "whyExists": "Callbacks dominate modern TS — arrows are default for inline handlers.",
  "mentalModel": "Short typed lambda without its own this binding.",
  "how": [
    "Explicit return type on long arrow bodies.",
    "Generic arrows: const map = <T, U>(arr: T[], fn: (t: T) => U): U[] => ...",
    "Void return for event handlers returning ignored value.",
    "Avoid typing this param on arrows — lexical this only.",
    "Assign to typed Function alias when exporting."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Returning explicit object literal from arrow — wrap in () or add return type to avoid parsing as block.",
    "variant": "warning"
  },
  "example": "type Mapper = <T, U>(items: T[], fn: (item: T) => U) => U[];\nconst map: Mapper = (items, fn) => items.map(fn);\nconsole.log(map([1, 2], (n) => String(n)));\nconst __typed: Mapper = {} as Mapper;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { Mapper }\");\n// type Mapper = <T, U>(items: T[], fn: (item: T) => U) => U[]; narrows allowed values\n// Mapper is available to importers as a type alias",
  "exampleCaption": "Generic arrow function via Mapper alias",
  "internals": [
    "Arrow functions not hoisted — const must be declared before use.",
    "strictBindCallApply types call/apply on functions.",
    "Implied this in TS checked for class field arrows."
  ],
  "takeaways": [
    "Explicit return type on long arrow bodies.",
    "Generic arrows: const map = <T, U>(arr: T[], fn: (t: T) => U): U[] => ...",
    "Returning explicit object literal from arrow — wrap in () or add return type to avoid parsing as block.",
    "Arrow functions not hoisted — const must be declared before use."
  ],
  "revision": [
    "Arrow Functions: Short typed lambda without its own this binding.",
    "Explicit return type on long arrow bodies.",
    "Generic arrows: const map = <T, U>(arr: T[], fn: (t: T) => U): U[] => ...",
    "Void return for event handlers returning ignored value.",
    "Trap: Returning explicit object literal from arrow — wrap in () or add return type to avoid parsing as block."
  ],
  "flashcards": [
    [
      "Arrow Functions",
      "Arrow functions share function typing; they lack own this, arguments, and prototype."
    ],
    [
      "Mental model",
      "Short typed lambda without its own this binding."
    ],
    [
      "Common trap",
      "Returning explicit object literal from arrow — wrap in () or add return type to avoid parsing as block."
    ],
    [
      "Explicit return type on long arrow bodies.",
      "Generic arrows: const map = <T, U>(arr: T[], fn: (t: T) => U): U[] => ..."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Arrow Functions in TypeScript and when do you use it?",
      "answerHint": "Arrow functions share function typing; they lack own this, arguments, and prototype. Typing: const f = (x: number): number => x * 2. Useful for callbacks where lexical this matters in TS+React."
    },
    {
      "level": "intermediate",
      "question": "Explain Arrow Functions with a code example and one pitfall.",
      "answerHint": "Explicit return type on long arrow bodies. Generic arrows: const map = <T, U>(arr: T[], fn: (t: T) => U): U[] => ... Void return for event handlers returning ignored value. Avoid typing this param on arrows — lexical this only. Assign to typed Function alias when exporting. Pitfall: Returning explicit object literal from arrow — wrap in () or add return type to avoid parsing as block."
    },
    {
      "level": "advanced",
      "question": "How would you explain Arrow Functions in a senior frontend interview?",
      "answerHint": "Arrow functions not hoisted — const must be declared before use. strictBindCallApply types call/apply on functions. Implied this in TS checked for class field arrows. type Mapper = <T, U>(items: T[], fn: (item: T) => U) => U[];\nconst map: Mapper = (items, fn) => items.map(fn);\nconsole.l"
    }
  ],
  "pitfalls": [
    "Returning explicit object literal from arrow — wrap in () or add return type to avoid parsing as block."
  ],
  "interview": {
    "expectations": [
      "Explain Arrow Functions with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Arrow functions not hoisted — const must be declared before use."
    ],
    "commonQuestions": [
      "What is Arrow Functions?",
      "When would you choose Arrow Functions over alternatives?",
      "What is the classic Arrow Functions interview trap?"
    ],
    "traps": [
      "Returning explicit object literal from arrow — wrap in () or add return type to avoid parsing as block."
    ],
    "misconceptions": [
      "Callbacks dominate modern TS — arrows are default for inline handlers."
    ],
    "strongSignals": [
      "Uses Arrow Functions to remove invalid states, not just document them."
    ]
  }
})
