import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Type Annotations",
  "whatIsIt": "Type annotations attach static types to bindings using colon syntax: const age: number = 30. They appear on parameters, returns, variables, and class members. Annotations are erased on emit — zero runtime cost.",
  "whyExists": "Annotations are the primary way humans and tools read design intent in TS code.",
  "mentalModel": "Sticky notes on variables telling the compiler what shape is allowed.",
  "how": [
    "Parameter annotations are required under noImplicitAny.",
    "Return annotations on recursive functions help inference.",
    "Object destructuring: function f({ id }: { id: string }).",
    "Optional params: id?: string adds undefined to type.",
    "Readonly annotations prevent reassignment of references."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Annotating const x: number = \"5\" — error unless you meant string.",
    "variant": "warning"
  },
  "example": "type Point = { x: number; y: number };\nfunction move(p: Point, dx: number): Point {\n  return { x: p.x + dx, y: p.y };\n}\nconst origin: Point = { x: 0, y: 0 };\nconsole.log(\"export type { Point }\");\n// type Point = { x: number; y: number }; narrows allowed values\nconsole.log(move('demo'));\n// Point is available to importers as a type alias",
  "exampleCaption": "Annotations on param, return, and variable",
  "internals": [
    "Annotations participate in contextual typing bidirectionally.",
    "JSDoc @param is annotation equivalent for .js files.",
    "Type-only imports use import type — erased completely."
  ],
  "takeaways": [
    "Parameter annotations are required under noImplicitAny.",
    "Return annotations on recursive functions help inference.",
    "Annotating const x: number = \"5\" — error unless you meant string.",
    "Annotations participate in contextual typing bidirectionally."
  ],
  "revision": [
    "Type Annotations: Sticky notes on variables telling the compiler what shape is allowed.",
    "Parameter annotations are required under noImplicitAny.",
    "Return annotations on recursive functions help inference.",
    "Object destructuring: function f({ id }: { id: string }).",
    "Trap: Annotating const x: number = \"5\" — error unless you meant string."
  ],
  "flashcards": [
    [
      "Type Annotations",
      "Type annotations attach static types to bindings using colon syntax: const age: number = 30."
    ],
    [
      "Mental model",
      "Sticky notes on variables telling the compiler what shape is allowed."
    ],
    [
      "Common trap",
      "Annotating const x: number = \"5\" — error unless you meant string."
    ],
    [
      "Parameter annotations are required under noImplicitAny.",
      "Return annotations on recursive functions help inference."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Type Annotations in TypeScript and when do you use it?",
      "answerHint": "Type annotations attach static types to bindings using colon syntax: const age: number = 30. They appear on parameters, returns, variables, and class members. Annotations are erased on emit — zero runtime cost."
    },
    {
      "level": "intermediate",
      "question": "Explain Type Annotations with a code example and one pitfall.",
      "answerHint": "Parameter annotations are required under noImplicitAny. Return annotations on recursive functions help inference. Object destructuring: function f({ id }: { id: string }). Optional params: id?: string adds undefined to type. Readonly annotations prevent reassignment of references. Pitfall: Annotating const x: number = \"5\" — error unless you meant string."
    },
    {
      "level": "advanced",
      "question": "How would you explain Type Annotations in a senior frontend interview?",
      "answerHint": "Annotations participate in contextual typing bidirectionally. JSDoc @param is annotation equivalent for .js files. Type-only imports use import type — erased completely. type Point = { x: number; y: number };\nfunction move(p: Point, dx: number): Point {\n  return { x: p.x + dx, y: p.y };\n}\n"
    }
  ],
  "pitfalls": [
    "Annotating const x: number = \"5\" — error unless you meant string."
  ],
  "interview": {
    "expectations": [
      "Explain Type Annotations with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Annotations participate in contextual typing bidirectionally."
    ],
    "commonQuestions": [
      "What is Type Annotations?",
      "When would you choose Type Annotations over alternatives?",
      "What is the classic Type Annotations interview trap?"
    ],
    "traps": [
      "Annotating const x: number = \"5\" — error unless you meant string."
    ],
    "misconceptions": [
      "Annotations are the primary way humans and tools read design intent in TS code."
    ],
    "strongSignals": [
      "Uses Type Annotations to remove invalid states, not just document them."
    ]
  }
})
