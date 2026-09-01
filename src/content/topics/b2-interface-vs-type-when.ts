import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Interface vs Type — When to Use",
  "whatIsIt": "Use interface for object shapes, class contracts, and library augmentation. Use type alias for unions, intersections, tuples, mapped/conditional types, and primitives. Both can describe objects — interface merges; type cannot re-open. Performance: large projects sometimes favor interface for recursive objects.",
  "whyExists": "Interview question with a practical answer — neither is always wrong; conventions reduce debate.",
  "mentalModel": "interface = extensible blueprint; type = Swiss Army alias for any type expression.",
  "how": [
    "Object API surface → interface.",
    "Status = \"a\" | \"b\" → type.",
    "Need declaration merging → interface.",
    "Need Pick/Omit composition on alias → type.",
    "Team consistency beats personal preference."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Rewriting all interfaces as type for aesthetics — lose merging and error message clarity.",
    "variant": "warning"
  },
  "example": "type Id = string;\ninterface Node { id: Id; children: Node[] }\ntype Result = { ok: true; data: string } | { ok: false; error: string };\nfunction handle(r: Result) { return r.ok ? r.data : r.error; }\nconst __typed: Id = {} as Id;\nconsole.log(\"const __item: Node = {} as Node\");\n// type Id = string; narrows allowed values\nconsole.log(handle('demo'));\n// Id is available to importers as a type alias",
  "exampleCaption": "interface for tree Node; type for Result union",
  "internals": [
    "Type aliases cannot be merged after creation.",
    "Both are erased — zero runtime difference.",
    "Recursive types work with both; interface slightly clearer for trees."
  ],
  "takeaways": [
    "Object API surface → interface.",
    "Status = \"a\" | \"b\" → type.",
    "Rewriting all interfaces as type for aesthetics — lose merging and error message clarity.",
    "Type aliases cannot be merged after creation."
  ],
  "revision": [
    "Interface vs Type — When to Use: interface = extensible blueprint; type = Swiss Army alias for any type expression.",
    "Object API surface → interface.",
    "Status = \"a\" | \"b\" → type.",
    "Need declaration merging → interface.",
    "Trap: Rewriting all interfaces as type for aesthetics — lose merging and error message clarity."
  ],
  "flashcards": [
    [
      "Interface vs Type — When to Use",
      "Use interface for object shapes, class contracts, and library augmentation."
    ],
    [
      "Mental model",
      "interface = extensible blueprint; type = Swiss Army alias for any type expression."
    ],
    [
      "Common trap",
      "Rewriting all interfaces as type for aesthetics — lose merging and error message clarity."
    ],
    [
      "Object API surface → interface.",
      "Status = \"a\" | \"b\" → type."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Interface vs Type — When to Use in TypeScript and when do you use it?",
      "answerHint": "Use interface for object shapes, class contracts, and library augmentation. Use type alias for unions, intersections, tuples, mapped/conditional types, and primitives. Both can describe objects — interface merges; type cannot re-open. Performance: large projects sometimes favor interface for recursive objects."
    },
    {
      "level": "intermediate",
      "question": "Explain Interface vs Type — When to Use with a code example and one pitfall.",
      "answerHint": "Object API surface → interface. Status = \"a\" | \"b\" → type. Need declaration merging → interface. Need Pick/Omit composition on alias → type. Team consistency beats personal preference. Pitfall: Rewriting all interfaces as type for aesthetics — lose merging and error message clarity."
    },
    {
      "level": "advanced",
      "question": "How would you explain Interface vs Type — When to Use in a senior frontend interview?",
      "answerHint": "Type aliases cannot be merged after creation. Both are erased — zero runtime difference. Recursive types work with both; interface slightly clearer for trees. type Id = string;\ninterface Node { id: Id; children: Node[] }\ntype Result = { ok: true; data: string } | { ok: false; er"
    }
  ],
  "pitfalls": [
    "Rewriting all interfaces as type for aesthetics — lose merging and error message clarity."
  ],
  "interview": {
    "expectations": [
      "Explain Interface vs Type — When to Use with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Type aliases cannot be merged after creation."
    ],
    "commonQuestions": [
      "What is Interface vs Type — When to Use?",
      "When would you choose Interface vs Type — When to Use over alternatives?",
      "What is the classic Interface vs Type — When to Use interview trap?"
    ],
    "traps": [
      "Rewriting all interfaces as type for aesthetics — lose merging and error message clarity."
    ],
    "misconceptions": [
      "Interview question with a practical answer — neither is always wrong; conventions reduce debate."
    ],
    "strongSignals": [
      "Uses Interface vs Type — When to Use to remove invalid states, not just document them."
    ]
  }
})
