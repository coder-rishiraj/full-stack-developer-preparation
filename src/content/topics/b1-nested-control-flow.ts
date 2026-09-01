import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Nested Control Flow",
  "whatIsIt": "Nesting if/for/switch/try increases cyclomatic complexity and hides which break belongs to which loop. Flatten with early returns, helper functions, and Array methods when they clarify. Nested loops are fine for 2D data; nested if-else pyramids usually are not.",
  "whyExists": "Real programs combine conditions and loops. The language allows arbitrary nesting; style decides readability.",
  "mentalModel": "Each nest is a box inside a box. If you cannot name each box, extract it.",
  "how": [
    "Return early on invalid input.",
    "Move inner loop bodies to named functions when they grow.",
    "Avoid switch inside for without comments on break.",
    "Prefer map/filter for ‘build an array from an array’ over nested push ifs."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A break in an inner switch that was meant to exit the for — switch ate the break.",
    "variant": "warning"
  },
  "example": "function firstPositivePair(grid) {\n  for (let r = 0; r < grid.length; r++) {\n    for (let c = 0; c < grid[r].length; c++) {\n      const n = grid[r][c];\n      if (n > 0) return { r, c, n };\n    }\n  }\n  return null;\n}\nconsole.log(firstPositivePair([[-1, 0], [-2, 5]]));\n",
  "exampleCaption": "Nested loops with an early return instead of flags",
  "internals": [
    "Each BreakableStatement has its own label set; unlabeled break hits the innermost.",
    "Stack frames do not grow from nesting if/for — only from function calls.",
    "Closures created in nested loops capture per-iteration lets independently."
  ],
  "takeaways": [
    "Return early on invalid input.",
    "Move inner loop bodies to named functions when they grow.",
    "A break in an inner switch that was meant to exit the for — switch ate the break.",
    "Each BreakableStatement has its own label set; unlabeled break hits the innermost."
  ],
  "revision": [
    "Nested Control Flow: Each nest is a box inside a box. If you cannot name each box, extract it.",
    "Return early on invalid input.",
    "Move inner loop bodies to named functions when they grow.",
    "Avoid switch inside for without comments on break.",
    "Trap: A break in an inner switch that was meant to exit the for — switch ate the break."
  ],
  "flashcards": [
    [
      "Nested Control Flow",
      "Nesting if/for/switch/try increases cyclomatic complexity and hides which break belongs to which loop."
    ],
    [
      "Mental model",
      "Each nest is a box inside a box. If you cannot name each box, extract it."
    ],
    [
      "Common trap",
      "A break in an inner switch that was meant to exit the for — switch ate the break."
    ],
    [
      "Return early on invalid input.",
      "Move inner loop bodies to named functions when they grow."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Nested Control Flow and where does a beginner first see it?",
      "answerHint": "Nesting if/for/switch/try increases cyclomatic complexity and hides which break belongs to which loop. Flatten with early returns, helper functions, and Array methods when they clarify. Nested loops are fine for 2D data; nested if-else pyramids usually are not."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Nested Control Flow works and name the main pitfall.",
      "answerHint": "Return early on invalid input. Move inner loop bodies to named functions when they grow. Avoid switch inside for without comments on break. Prefer map/filter for ‘build an array from an array’ over nested push ifs. Pitfall: A break in an inner switch that was meant to exit the for — switch ate the break."
    },
    {
      "level": "advanced",
      "question": "How would you explain Nested Control Flow at an interview, including engine/spec details?",
      "answerHint": "Each BreakableStatement has its own label set; unlabeled break hits the innermost. Stack frames do not grow from nesting if/for — only from function calls. Closures created in nested loops capture per-iteration lets independently."
    }
  ],
  "pitfalls": [
    "A break in an inner switch that was meant to exit the for — switch ate the break.",
    "Prefer map/filter for ‘build an array from an array’ over nested push ifs."
  ],
  "interview": {
    "expectations": [
      "Explain Nested Control Flow without mixing it up with a nearby B1.6 — Control Flow topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Each BreakableStatement has its own label set; unlabeled break hits the innermost."
    ],
    "commonQuestions": [
      "What is Nested Control Flow?",
      "Why does JavaScript nested control flow behave this way?",
      "What is the classic Nested Control Flow interview trap?"
    ],
    "traps": [
      "A break in an inner switch that was meant to exit the for — switch ate the break."
    ],
    "misconceptions": [
      "Real programs combine conditions and loops. The language allows arbitrary nesting; style decides readability."
    ],
    "strongSignals": [
      "Separates Nested Control Flow from lookalike APIs and can draw the mental model."
    ]
  }
})
