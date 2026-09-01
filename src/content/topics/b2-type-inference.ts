import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Type Inference",
  "whatIsIt": "Type inference lets the compiler deduce types without annotations from initializers, return expressions, and usage context. const x = 10 infers number; const arr = [1, 2] infers number[]. Generic functions infer type parameters from arguments.",
  "whyExists": "Less boilerplate, fewer lies — inferred types track actual code paths.",
  "mentalModel": "The compiler reads your code like a detective and writes the dossier (type) for you.",
  "how": [
    "Prefer inference for locals and simple callbacks.",
    "Hover in IDE to see inferred type when unsure.",
    "as const prevents widening literal inference.",
    "Generic calls infer T from arguments: identity(\"a\") → string.",
    "When inference fails, add minimal annotation at the leak point."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Empty array [] infers never[] — annotate Element[] or provide initial element.",
    "variant": "warning"
  },
  "example": "const ids = [1, 2, 3];           // number[]\nconst first = ids[0];              // number\nfunction wrap<T>(x: T) { return [x]; }\nconst pair = wrap('ok');           // string[]\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead\n// Enable \"strict\": true in tsconfig.json\n// Hover types in your editor to inspect inference",
  "exampleCaption": "Array and generic inference without annotations",
  "internals": [
    "Flow-sensitive inference narrows in if branches.",
    "Best common type algorithm merges branch returns.",
    "Inference runs limited depth — deep recursion may need hints."
  ],
  "takeaways": [
    "Prefer inference for locals and simple callbacks.",
    "Hover in IDE to see inferred type when unsure.",
    "Empty array [] infers never[] — annotate Element[] or provide initial element.",
    "Flow-sensitive inference narrows in if branches."
  ],
  "revision": [
    "Type Inference: The compiler reads your code like a detective and writes the dossier (type) for you.",
    "Prefer inference for locals and simple callbacks.",
    "Hover in IDE to see inferred type when unsure.",
    "as const prevents widening literal inference.",
    "Trap: Empty array [] infers never[] — annotate Element[] or provide initial element."
  ],
  "flashcards": [
    [
      "Type Inference",
      "Type inference lets the compiler deduce types without annotations from initializers, return expressions, and usage context."
    ],
    [
      "Mental model",
      "The compiler reads your code like a detective and writes the dossier (type) for you."
    ],
    [
      "Common trap",
      "Empty array [] infers never[] — annotate Element[] or provide initial element."
    ],
    [
      "Prefer inference for locals and simple callbacks.",
      "Hover in IDE to see inferred type when unsure."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Type Inference in TypeScript and when do you use it?",
      "answerHint": "Type inference lets the compiler deduce types without annotations from initializers, return expressions, and usage context. const x = 10 infers number; const arr = [1, 2] infers number[]. Generic functions infer type parameters from arguments."
    },
    {
      "level": "intermediate",
      "question": "Explain Type Inference with a code example and one pitfall.",
      "answerHint": "Prefer inference for locals and simple callbacks. Hover in IDE to see inferred type when unsure. as const prevents widening literal inference. Generic calls infer T from arguments: identity(\"a\") → string. When inference fails, add minimal annotation at the leak point. Pitfall: Empty array [] infers never[] — annotate Element[] or provide initial element."
    },
    {
      "level": "advanced",
      "question": "How would you explain Type Inference in a senior frontend interview?",
      "answerHint": "Flow-sensitive inference narrows in if branches. Best common type algorithm merges branch returns. Inference runs limited depth — deep recursion may need hints. const ids = [1, 2, 3];           // number[]\nconst first = ids[0];              // number\nfunction wrap<T>(x: T) { retur"
    }
  ],
  "pitfalls": [
    "Empty array [] infers never[] — annotate Element[] or provide initial element."
  ],
  "interview": {
    "expectations": [
      "Explain Type Inference with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Flow-sensitive inference narrows in if branches."
    ],
    "commonQuestions": [
      "What is Type Inference?",
      "When would you choose Type Inference over alternatives?",
      "What is the classic Type Inference interview trap?"
    ],
    "traps": [
      "Empty array [] infers never[] — annotate Element[] or provide initial element."
    ],
    "misconceptions": [
      "Less boilerplate, fewer lies — inferred types track actual code paths."
    ],
    "strongSignals": [
      "Uses Type Inference to remove invalid states, not just document them."
    ]
  }
})
