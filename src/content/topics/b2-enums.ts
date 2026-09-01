import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Enums",
  "whatIsIt": "Enums declare a set of named constants. Numeric enums auto-increment; string enums are preferred for readability and tree-shaking. Const enums inline at compile time. Enums generate JS objects unless const — unlike literal unions.",
  "whyExists": "Enums give named constants with reverse mapping for numeric variants — though literal unions often replace them in modern TS.",
  "mentalModel": "A menu of numbered meal codes — enum maps names to values.",
  "how": [
    "Prefer string enums for domain statuses.",
    "const enum for zero runtime when inlining OK.",
    "Avoid mixing computed and auto members carelessly.",
    "Compare with literal unions for bundle size.",
    "Use satisfies with as const objects as alternative."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Numeric enum reverse mapping surprises — Object.keys includes numbers and names.",
    "variant": "warning"
  },
  "example": "enum Status { Idle = 'idle', Loading = 'loading', Done = 'done' }\nfunction render(s: Status) {\n  if (s === Status.Loading) return '...';\n  return s;\n}\nconsole.log(render(Status.Done));\nconsole.log(render('demo'));\n// TypeScript validates this file before emit",
  "exampleCaption": "String enum Status with typed render",
  "internals": [
    "Enums are nominal-ish — less structural mixing than unions.",
    "const enum requires compile-time known values.",
    "isolatedModules may block const enum re-exports."
  ],
  "takeaways": [
    "Prefer string enums for domain statuses.",
    "const enum for zero runtime when inlining OK.",
    "Numeric enum reverse mapping surprises — Object.keys includes numbers and names.",
    "Enums are nominal-ish — less structural mixing than unions."
  ],
  "revision": [
    "Enums: A menu of numbered meal codes — enum maps names to values.",
    "Prefer string enums for domain statuses.",
    "const enum for zero runtime when inlining OK.",
    "Avoid mixing computed and auto members carelessly.",
    "Trap: Numeric enum reverse mapping surprises — Object.keys includes numbers and names."
  ],
  "flashcards": [
    [
      "Enums",
      "Enums declare a set of named constants."
    ],
    [
      "Mental model",
      "A menu of numbered meal codes — enum maps names to values."
    ],
    [
      "Common trap",
      "Numeric enum reverse mapping surprises — Object.keys includes numbers and names."
    ],
    [
      "Prefer string enums for domain statuses.",
      "const enum for zero runtime when inlining OK."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Enums in TypeScript and when do you use it?",
      "answerHint": "Enums declare a set of named constants. Numeric enums auto-increment; string enums are preferred for readability and tree-shaking. Const enums inline at compile time. Enums generate JS objects unless const — unlike literal unions."
    },
    {
      "level": "intermediate",
      "question": "Explain Enums with a code example and one pitfall.",
      "answerHint": "Prefer string enums for domain statuses. const enum for zero runtime when inlining OK. Avoid mixing computed and auto members carelessly. Compare with literal unions for bundle size. Use satisfies with as const objects as alternative. Pitfall: Numeric enum reverse mapping surprises — Object.keys includes numbers and names."
    },
    {
      "level": "advanced",
      "question": "How would you explain Enums in a senior frontend interview?",
      "answerHint": "Enums are nominal-ish — less structural mixing than unions. const enum requires compile-time known values. isolatedModules may block const enum re-exports. enum Status { Idle = 'idle', Loading = 'loading', Done = 'done' }\nfunction render(s: Status) {\n  if (s === Status.Loadin"
    }
  ],
  "pitfalls": [
    "Numeric enum reverse mapping surprises — Object.keys includes numbers and names."
  ],
  "interview": {
    "expectations": [
      "Explain Enums with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Enums are nominal-ish — less structural mixing than unions."
    ],
    "commonQuestions": [
      "What is Enums?",
      "When would you choose Enums over alternatives?",
      "What is the classic Enums interview trap?"
    ],
    "traps": [
      "Numeric enum reverse mapping surprises — Object.keys includes numbers and names."
    ],
    "misconceptions": [
      "Enums give named constants with reverse mapping for numeric variants — though literal unions often replace them in modern TS."
    ],
    "strongSignals": [
      "Uses Enums to remove invalid states, not just document them."
    ]
  }
})
