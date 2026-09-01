import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Function Execution Context",
  "whatIsIt": "A function execution context is pushed on call: new environments for params/vars, this bound (unless arrow), new.target, and a reference to the outer lexical environment. Returning or throwing pops it. Recursion pushes many. Closures keep environments after pop.",
  "whyExists": "Each invocation needs isolated locals even if the same function runs twice.",
  "mentalModel": "A new sticky-note pad per call, with an arrow pointing to the outer pad you were born in.",
  "how": [
    "Locals from two calls do not collide.",
    "this is set at this push (call site).",
    "Too many pushes: stack overflow.",
    "await pops until resume pushes again."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming a recursive function’s `local` is shared — only closed-over outer lets are shared.",
    "variant": "warning"
  },
  "example": "function f(n) {\n  const local = n * 10;\n  if (n === 0) return local;\n  return local + f(n - 1);\n}\nconsole.log(f(3));\n",
  "exampleCaption": "Each recursive call has its own local",
  "internals": [
    "PrepareForOrdinaryCall + OrdinaryCallBindThis + EvaluateBody.",
    "Function environment record holds this/new.target/super.",
    "Pop on return, throw, or await suspend."
  ],
  "takeaways": [
    "Locals from two calls do not collide.",
    "this is set at this push (call site).",
    "Assuming a recursive function’s `local` is shared — only closed-over outer lets are shared.",
    "PrepareForOrdinaryCall + OrdinaryCallBindThis + EvaluateBody."
  ],
  "revision": [
    "Function Execution Context: A new sticky-note pad per call, with an arrow pointing to the outer pad you were born in.",
    "Locals from two calls do not collide.",
    "this is set at this push (call site).",
    "Too many pushes: stack overflow.",
    "Trap: Assuming a recursive function’s `local` is shared — only closed-over outer lets are shared."
  ],
  "flashcards": [
    [
      "Function Execution Context",
      "A function execution context is pushed on call: new environments for params/vars, this bound (unless arrow), new.target, and a reference to the outer lexical environment."
    ],
    [
      "Mental model",
      "A new sticky-note pad per call, with an arrow pointing to the outer pad you were born in."
    ],
    [
      "Common trap",
      "Assuming a recursive function’s `local` is shared — only closed-over outer lets are shared."
    ],
    [
      "Locals from two calls do not collide.",
      "this is set at this push (call site)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Function Execution Context and where does a beginner first see it?",
      "answerHint": "A function execution context is pushed on call: new environments for params/vars, this bound (unless arrow), new.target, and a reference to the outer lexical environment. Returning or throwing pops it. Recursion pushes many. Closures keep environments after pop."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Function Execution Context works and name the main pitfall.",
      "answerHint": "Locals from two calls do not collide. this is set at this push (call site). Too many pushes: stack overflow. await pops until resume pushes again. Pitfall: Assuming a recursive function’s `local` is shared — only closed-over outer lets are shared."
    },
    {
      "level": "advanced",
      "question": "How would you explain Function Execution Context at an interview, including engine/spec details?",
      "answerHint": "PrepareForOrdinaryCall + OrdinaryCallBindThis + EvaluateBody. Function environment record holds this/new.target/super. Pop on return, throw, or await suspend."
    }
  ],
  "pitfalls": [
    "Assuming a recursive function’s `local` is shared — only closed-over outer lets are shared.",
    "await pops until resume pushes again."
  ],
  "interview": {
    "expectations": [
      "Explain Function Execution Context without mixing it up with a nearby B1.23 — Execution Context topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "PrepareForOrdinaryCall + OrdinaryCallBindThis + EvaluateBody."
    ],
    "commonQuestions": [
      "What is Function Execution Context?",
      "Why does JavaScript function execution context behave this way?",
      "What is the classic Function Execution Context interview trap?"
    ],
    "traps": [
      "Assuming a recursive function’s `local` is shared — only closed-over outer lets are shared."
    ],
    "misconceptions": [
      "Each invocation needs isolated locals even if the same function runs twice."
    ],
    "strongSignals": [
      "Separates Function Execution Context from lookalike APIs and can draw the mental model."
    ]
  }
})
