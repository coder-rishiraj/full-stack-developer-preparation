import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Stack Overflow",
  "whatIsIt": "Stack overflow is RangeError: Maximum call stack size exceeded when recursion (or insane nesting) exceeds the engine’s frame quota. Mutual recursion counts. Async recursion with await does not grow the JS stack across awaits (each resume is a new short stack) but can still starve the loop. Convert to iterative or trampoline.",
  "whyExists": "The stack is finite. Infinite recursion would otherwise hang forever without an error.",
  "mentalModel": "Too many plates. The waiter refuses and throws RangeError.",
  "how": [
    "Base case first in recursion.",
    "Deep trees: explicit heap stack (array) instead of call stack.",
    "Do not diagnose a hang as overflow if it is an infinite sync loop without calls.",
    "Increase stack only in special VM flags — not in browsers for users."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.stringify on a cyclic object throws TypeError (cycle), not stack overflow — different error.",
    "variant": "warning"
  },
  "example": "function boom(n) { return boom(n + 1); }\ntry { boom(0); } catch (e) { console.log(e.name, e.message.slice(0, 40)); }\nfunction safe(n) {\n  let s = 0;\n  for (let i = 0; i < n; i++) s += i;\n  return s;\n}\nconsole.log(safe(1e6));\n",
  "exampleCaption": "Recursive overflow vs iterative loop",
  "internals": [
    "Host-defined limit; not a spec number.",
    "Each OrdinaryCallBindThis + EvaluateBody costs a frame.",
    "Generators do not grow the stack while suspended."
  ],
  "takeaways": [
    "Base case first in recursion.",
    "Deep trees: explicit heap stack (array) instead of call stack.",
    "JSON.stringify on a cyclic object throws TypeError (cycle), not stack overflow — different error.",
    "Host-defined limit; not a spec number."
  ],
  "revision": [
    "Stack Overflow: Too many plates. The waiter refuses and throws RangeError.",
    "Base case first in recursion.",
    "Deep trees: explicit heap stack (array) instead of call stack.",
    "Do not diagnose a hang as overflow if it is an infinite sync loop without calls.",
    "Trap: JSON.stringify on a cyclic object throws TypeError (cycle), not stack overflow — different error."
  ],
  "flashcards": [
    [
      "Stack Overflow",
      "Stack overflow is RangeError: Maximum call stack size exceeded when recursion (or insane nesting) exceeds the engine’s frame quota."
    ],
    [
      "Mental model",
      "Too many plates. The waiter refuses and throws RangeError."
    ],
    [
      "Common trap",
      "JSON.stringify on a cyclic object throws TypeError (cycle), not stack overflow — different error."
    ],
    [
      "Base case first in recursion.",
      "Deep trees: explicit heap stack (array) instead of call stack."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Stack Overflow and where does a beginner first see it?",
      "answerHint": "Stack overflow is RangeError: Maximum call stack size exceeded when recursion (or insane nesting) exceeds the engine’s frame quota. Mutual recursion counts. Async recursion with await does not grow the JS stack across awaits (each resume is a new short stack) but can still starve the loop. Convert to iterative or trampoline."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Stack Overflow works and name the main pitfall.",
      "answerHint": "Base case first in recursion. Deep trees: explicit heap stack (array) instead of call stack. Do not diagnose a hang as overflow if it is an infinite sync loop without calls. Increase stack only in special VM flags — not in browsers for users. Pitfall: JSON.stringify on a cyclic object throws TypeError (cycle), not stack overflow — different error."
    },
    {
      "level": "advanced",
      "question": "How would you explain Stack Overflow at an interview, including engine/spec details?",
      "answerHint": "Host-defined limit; not a spec number. Each OrdinaryCallBindThis + EvaluateBody costs a frame. Generators do not grow the stack while suspended."
    }
  ],
  "pitfalls": [
    "JSON.stringify on a cyclic object throws TypeError (cycle), not stack overflow — different error.",
    "Increase stack only in special VM flags — not in browsers for users."
  ],
  "interview": {
    "expectations": [
      "Explain Stack Overflow without mixing it up with a nearby B1.24 — Call Stack topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Host-defined limit; not a spec number."
    ],
    "commonQuestions": [
      "What is Stack Overflow?",
      "Why does JavaScript stack overflow behave this way?",
      "What is the classic Stack Overflow interview trap?"
    ],
    "traps": [
      "JSON.stringify on a cyclic object throws TypeError (cycle), not stack overflow — different error."
    ],
    "misconceptions": [
      "The stack is finite. Infinite recursion would otherwise hang forever without an error."
    ],
    "strongSignals": [
      "Separates Stack Overflow from lookalike APIs and can draw the mental model."
    ]
  }
})
