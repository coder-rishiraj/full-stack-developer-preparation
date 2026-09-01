import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Recursion",
  "whatIsIt": "Recursion is a function calling itself (or a cycle of functions) with a base case that stops. Each call pushes a stack frame; too deep throws RangeError (stack overflow). JS does not guarantee tail-call optimization in most engines. Convert deep recursion to a loop or explicit stack.",
  "whyExists": "Trees, nested comments, and divide-and-conquer algorithms map to recursive definitions. The call stack is the implicit stack.",
  "mentalModel": "Russian dolls of the same function. The innermost hits the base case and the dolls unwind with return values.",
  "how": [
    "Always write the base case first.",
    "Shrink the problem (n-1, slice, child nodes).",
    "Mind stack size (~thousands of frames, engine-dependent).",
    "For huge n, iterate."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Missing base case → RangeError, not a polite infinite loop (the stack dies first).",
    "variant": "warning"
  },
  "example": "function fact(n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}\nfunction factIter(n) {\n  let r = 1;\n  for (let i = 2; i <= n; i++) r *= i;\n  return r;\n}\nconsole.log(fact(5), factIter(5));\ntry { fact(1e5); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Recursive factorial vs iterative; overflow",
  "internals": [
    "Each [[Call]] pushes a new execution context on the stack.",
    "Proper Tail Calls exist in the spec but are not implemented in V8/SpiderMonkey generally.",
    "RangeError is thrown when the host stack quota is exceeded."
  ],
  "takeaways": [
    "Always write the base case first.",
    "Shrink the problem (n-1, slice, child nodes).",
    "Missing base case → RangeError, not a polite infinite loop (the stack dies first).",
    "Each [[Call]] pushes a new execution context on the stack."
  ],
  "revision": [
    "Recursion: Russian dolls of the same function. The innermost hits the base case and the dolls unwind with return values.",
    "Always write the base case first.",
    "Shrink the problem (n-1, slice, child nodes).",
    "Mind stack size (~thousands of frames, engine-dependent).",
    "Trap: Missing base case → RangeError, not a polite infinite loop (the stack dies first)."
  ],
  "flashcards": [
    [
      "Recursion",
      "Recursion is a function calling itself (or a cycle of functions) with a base case that stops."
    ],
    [
      "Mental model",
      "Russian dolls of the same function. The innermost hits the base case and the dolls unwind with return values."
    ],
    [
      "Common trap",
      "Missing base case → RangeError, not a polite infinite loop (the stack dies first)."
    ],
    [
      "Always write the base case first.",
      "Shrink the problem (n-1, slice, child nodes)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Recursion and where does a beginner first see it?",
      "answerHint": "Recursion is a function calling itself (or a cycle of functions) with a base case that stops. Each call pushes a stack frame; too deep throws RangeError (stack overflow). JS does not guarantee tail-call optimization in most engines. Convert deep recursion to a loop or explicit stack."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Recursion works and name the main pitfall.",
      "answerHint": "Always write the base case first. Shrink the problem (n-1, slice, child nodes). Mind stack size (~thousands of frames, engine-dependent). For huge n, iterate. Pitfall: Missing base case → RangeError, not a polite infinite loop (the stack dies first)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Recursion at an interview, including engine/spec details?",
      "answerHint": "Each [[Call]] pushes a new execution context on the stack. Proper Tail Calls exist in the spec but are not implemented in V8/SpiderMonkey generally. RangeError is thrown when the host stack quota is exceeded."
    }
  ],
  "pitfalls": [
    "Missing base case → RangeError, not a polite infinite loop (the stack dies first).",
    "For huge n, iterate."
  ],
  "interview": {
    "expectations": [
      "Explain Recursion without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Each [[Call]] pushes a new execution context on the stack."
    ],
    "commonQuestions": [
      "What is Recursion?",
      "Why does JavaScript recursion behave this way?",
      "What is the classic Recursion interview trap?"
    ],
    "traps": [
      "Missing base case → RangeError, not a polite infinite loop (the stack dies first)."
    ],
    "misconceptions": [
      "Trees, nested comments, and divide-and-conquer algorithms map to recursive definitions. The call stack is the implicit stack."
    ],
    "strongSignals": [
      "Separates Recursion from lookalike APIs and can draw the mental model."
    ]
  }
})
