import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Closure Interview Puzzles",
  "whatIsIt": "Puzzles combine loop captures, returned factories, mutating closed-over objects, and async timing. Ask: which environment record? Is the binding shared? When does the inner run? If it runs after a loop, var shows the end value. If two methods share `let n`, they share mutations.",
  "whyExists": "Interviews check whether you simulate environments, not whether you memorized a blog post.",
  "mentalModel": "Draw boxes for each call, arrows for inner functions, and a timeline for when they run.",
  "how": [
    "Identify shared vs per-iteration bindings.",
    "Note mutation vs rebinding of outer names.",
    "Place async callbacks on a later tick.",
    "Watch IIFE vs block let as different fix patterns."
  ],
  "callout": {
    "title": "Watch for",
    "text": "const j = i inside a var loop is the IIFE-less snapshot; forgetting it is the puzzle.",
    "variant": "warning"
  },
  "example": "function puzzle() {\n  const fns = [];\n  let i = 0;\n  while (i < 3) {\n    const j = i;\n    fns.push(() => [i, j]);\n    i += 1;\n  }\n  return fns.map((f) => f());\n}\nconsole.log(puzzle());\nconst shared = (() => {\n  let n = 0;\n  return [() => ++n, () => n];\n})();\nshared[0]();\nconsole.log(shared[1]());\n",
  "exampleCaption": "while+const j snapshot vs shared n between two functions",
  "internals": [
    "while with let i is not per-iteration like for(let i); you must copy to const j.",
    "for(let i) spec copies i each iteration; while does not auto-copy.",
    "Two functions from one factory share one environment record."
  ],
  "takeaways": [
    "Identify shared vs per-iteration bindings.",
    "Note mutation vs rebinding of outer names.",
    "const j = i inside a var loop is the IIFE-less snapshot; forgetting it is the puzzle.",
    "while with let i is not per-iteration like for(let i); you must copy to const j."
  ],
  "revision": [
    "Closure Interview Puzzles: Draw boxes for each call, arrows for inner functions, and a timeline for when they run.",
    "Identify shared vs per-iteration bindings.",
    "Note mutation vs rebinding of outer names.",
    "Place async callbacks on a later tick.",
    "Trap: const j = i inside a var loop is the IIFE-less snapshot; forgetting it is the puzzle."
  ],
  "flashcards": [
    [
      "Closure Interview Puzzles",
      "Puzzles combine loop captures, returned factories, mutating closed-over objects, and async timing."
    ],
    [
      "Mental model",
      "Draw boxes for each call, arrows for inner functions, and a timeline for when they run."
    ],
    [
      "Common trap",
      "const j = i inside a var loop is the IIFE-less snapshot; forgetting it is the puzzle."
    ],
    [
      "Identify shared vs per-iteration bindings.",
      "Note mutation vs rebinding of outer names."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Closure Interview Puzzles and where does a beginner first see it?",
      "answerHint": "Puzzles combine loop captures, returned factories, mutating closed-over objects, and async timing. Ask: which environment record? Is the binding shared? When does the inner run? If it runs after a loop, var shows the end value. If two methods share `let n`, they share mutations."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Closure Interview Puzzles works and name the main pitfall.",
      "answerHint": "Identify shared vs per-iteration bindings. Note mutation vs rebinding of outer names. Place async callbacks on a later tick. Watch IIFE vs block let as different fix patterns. Pitfall: const j = i inside a var loop is the IIFE-less snapshot; forgetting it is the puzzle."
    },
    {
      "level": "advanced",
      "question": "How would you explain Closure Interview Puzzles at an interview, including engine/spec details?",
      "answerHint": "while with let i is not per-iteration like for(let i); you must copy to const j. for(let i) spec copies i each iteration; while does not auto-copy. Two functions from one factory share one environment record."
    }
  ],
  "pitfalls": [
    "const j = i inside a var loop is the IIFE-less snapshot; forgetting it is the puzzle.",
    "Watch IIFE vs block let as different fix patterns."
  ],
  "interview": {
    "expectations": [
      "Explain Closure Interview Puzzles without mixing it up with a nearby B1.12 — Closures topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "while with let i is not per-iteration like for(let i); you must copy to const j."
    ],
    "commonQuestions": [
      "What is Closure Interview Puzzles?",
      "Why does JavaScript closure interview puzzles behave this way?",
      "What is the classic Closure Interview Puzzles interview trap?"
    ],
    "traps": [
      "const j = i inside a var loop is the IIFE-less snapshot; forgetting it is the puzzle."
    ],
    "misconceptions": [
      "Interviews check whether you simulate environments, not whether you memorized a blog post."
    ],
    "strongSignals": [
      "Separates Closure Interview Puzzles from lookalike APIs and can draw the mental model."
    ]
  }
})
