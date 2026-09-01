import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "When to Annotate vs Infer",
  "whatIsIt": "Use inference for internal implementation details; use explicit types at boundaries (exports, React props, API handlers) and when inference is wrong (empty arrays, JSON parse, widening literals). Return type annotations on public functions prevent accidental API changes.",
  "whyExists": "Balance noise vs safety — annotate where mistakes are expensive, infer where code is obvious.",
  "mentalModel": "Inferred types are auto-pilot; explicit types are hands on wheel at intersections.",
  "how": [
    "Export? Explicit signature.",
    "JSON/unknown input? Annotate after validate, not before.",
    "Complex generic utility? Explicit type params at call site if needed.",
    "satisfies preserves literals while checking shape.",
    "If hover shows any or overly wide union, annotate."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Explicit return type on huge function that drifted — compiler would catch narrower bug.",
    "variant": "warning"
  },
  "example": "export function createStore<S>(initial: S) {\n  let state = initial;\n  return {\n    get: (): S => state,\n    set: (next: S) => { state = next; },\n  };\n}\nconst store = createStore({ count: 0 }); // S inferred as { count: number }",
  "exampleCaption": "Generic boundary inferred; methods stay typed",
  "internals": [
    "Implementing interfaces requires explicit class implements clause.",
    "Contextual typing reduces need for callback param annotations.",
    "Function return inference follows all code paths for assignability."
  ],
  "takeaways": [
    "Export? Explicit signature.",
    "JSON/unknown input? Annotate after validate, not before.",
    "Explicit return type on huge function that drifted — compiler would catch narrower bug.",
    "Implementing interfaces requires explicit class implements clause."
  ],
  "revision": [
    "When to Annotate vs Infer: Inferred types are auto-pilot; explicit types are hands on wheel at intersections.",
    "Export? Explicit signature.",
    "JSON/unknown input? Annotate after validate, not before.",
    "Complex generic utility? Explicit type params at call site if needed.",
    "Trap: Explicit return type on huge function that drifted — compiler would catch narrower bug."
  ],
  "flashcards": [
    [
      "When to Annotate vs Infer",
      "Use inference for internal implementation details; use explicit types at boundaries (exports, React props, API handlers) and when inference is wrong (empty arrays, JSON parse, widening literals)."
    ],
    [
      "Mental model",
      "Inferred types are auto-pilot; explicit types are hands on wheel at intersections."
    ],
    [
      "Common trap",
      "Explicit return type on huge function that drifted — compiler would catch narrower bug."
    ],
    [
      "Export? Explicit signature.",
      "JSON/unknown input? Annotate after validate, not before."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is When to Annotate vs Infer in TypeScript and when do you use it?",
      "answerHint": "Use inference for internal implementation details; use explicit types at boundaries (exports, React props, API handlers) and when inference is wrong (empty arrays, JSON parse, widening literals). Return type annotations on public functions prevent accidental API changes."
    },
    {
      "level": "intermediate",
      "question": "Explain When to Annotate vs Infer with a code example and one pitfall.",
      "answerHint": "Export? Explicit signature. JSON/unknown input? Annotate after validate, not before. Complex generic utility? Explicit type params at call site if needed. satisfies preserves literals while checking shape. If hover shows any or overly wide union, annotate. Pitfall: Explicit return type on huge function that drifted — compiler would catch narrower bug."
    },
    {
      "level": "advanced",
      "question": "How would you explain When to Annotate vs Infer in a senior frontend interview?",
      "answerHint": "Implementing interfaces requires explicit class implements clause. Contextual typing reduces need for callback param annotations. Function return inference follows all code paths for assignability. export function createStore<S>(initial: S) {\n  let state = initial;\n  return {\n    get: (): S => state,\n    set: (next: "
    }
  ],
  "pitfalls": [
    "Explicit return type on huge function that drifted — compiler would catch narrower bug."
  ],
  "interview": {
    "expectations": [
      "Explain When to Annotate vs Infer with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Implementing interfaces requires explicit class implements clause."
    ],
    "commonQuestions": [
      "What is When to Annotate vs Infer?",
      "When would you choose When to Annotate vs Infer over alternatives?",
      "What is the classic When to Annotate vs Infer interview trap?"
    ],
    "traps": [
      "Explicit return type on huge function that drifted — compiler would catch narrower bug."
    ],
    "misconceptions": [
      "Balance noise vs safety — annotate where mistakes are expensive, infer where code is obvious."
    ],
    "strongSignals": [
      "Uses When to Annotate vs Infer to remove invalid states, not just document them."
    ]
  }
})
