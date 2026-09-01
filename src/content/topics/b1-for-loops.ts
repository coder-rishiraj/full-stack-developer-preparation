import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "for / while / do...while",
  "whatIsIt": "for (init; test; update) is C-style. while tests before the body; do...while tests after, so the body runs at least once. for(;;) is an infinite loop you must break. let in for headers is scoped to the loop; var leaks. Skipping the test means true.",
  "whyExists": "Iteration is the workhorse of scripts. Three forms cover ‘known count,’ ‘unknown until condition,’ and ‘run once then maybe again.’",
  "mentalModel": "for is a while with a built-in increment shelf. do...while is ‘pay then check.’",
  "how": [
    "Use for when you have an index; while when waiting on a condition.",
    "Avoid do...while unless you truly must run once.",
    "Prefer for...of for arrays when you do not need the index.",
    "Do not mutate the bound you test in confusing ways."
  ],
  "callout": {
    "title": "Watch for",
    "text": "for (var i = 0; i < n; i++) { setTimeout(() => console.log(i)) } prints n, n, n.",
    "variant": "warning"
  },
  "example": "let s = 0;\nfor (let i = 0; i < 4; i++) s += i;\nlet n = 3;\nwhile (n > 0) n -= 1;\nlet k = 0;\ndo { k += 1; } while (k < 1);\nconsole.log(s, n, k);\n",
  "exampleCaption": "for, while, and do...while side by side",
  "internals": [
    "ForBodyEvaluation with per-iteration environments when using lexical bindings.",
    "while uses LoopContinues based on ToBoolean.",
    "do...while evaluates the body before the first ToBoolean test."
  ],
  "takeaways": [
    "Use for when you have an index; while when waiting on a condition.",
    "Avoid do...while unless you truly must run once.",
    "for (var i = 0; i < n; i++) { setTimeout(() => console.log(i)) } prints n, n, n.",
    "ForBodyEvaluation with per-iteration environments when using lexical bindings."
  ],
  "revision": [
    "for / while / do...while: for is a while with a built-in increment shelf. do...while is ‘pay then check.’",
    "Use for when you have an index; while when waiting on a condition.",
    "Avoid do...while unless you truly must run once.",
    "Prefer for...of for arrays when you do not need the index.",
    "Trap: for (var i = 0; i < n; i++) { setTimeout(() => console.log(i)) } prints n, n, n."
  ],
  "flashcards": [
    [
      "for / while / do...while",
      "for (init; test; update) is C-style."
    ],
    [
      "Mental model",
      "for is a while with a built-in increment shelf. do...while is ‘pay then check.’"
    ],
    [
      "Common trap",
      "for (var i = 0; i < n; i++) { setTimeout(() => console.log(i)) } prints n, n, n."
    ],
    [
      "Use for when you have an index; while when waiting on a condition.",
      "Avoid do...while unless you truly must run once."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is for / while / do...while and where does a beginner first see it?",
      "answerHint": "for (init; test; update) is C-style. while tests before the body; do...while tests after, so the body runs at least once. for(;;) is an infinite loop you must break. let in for headers is scoped to the loop; var leaks. Skipping the test means true."
    },
    {
      "level": "intermediate",
      "question": "Walk through how for / while / do...while works and name the main pitfall.",
      "answerHint": "Use for when you have an index; while when waiting on a condition. Avoid do...while unless you truly must run once. Prefer for...of for arrays when you do not need the index. Do not mutate the bound you test in confusing ways. Pitfall: for (var i = 0; i < n; i++) { setTimeout(() => console.log(i)) } prints n, n, n."
    },
    {
      "level": "advanced",
      "question": "How would you explain for / while / do...while at an interview, including engine/spec details?",
      "answerHint": "ForBodyEvaluation with per-iteration environments when using lexical bindings. while uses LoopContinues based on ToBoolean. do...while evaluates the body before the first ToBoolean test."
    }
  ],
  "pitfalls": [
    "for (var i = 0; i < n; i++) { setTimeout(() => console.log(i)) } prints n, n, n.",
    "Do not mutate the bound you test in confusing ways."
  ],
  "interview": {
    "expectations": [
      "Explain for / while / do...while without mixing it up with a nearby B1.6 — Control Flow topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ForBodyEvaluation with per-iteration environments when using lexical bindings."
    ],
    "commonQuestions": [
      "What is for / while / do...while?",
      "Why does JavaScript for / while / do...while behave this way?",
      "What is the classic for / while / do...while interview trap?"
    ],
    "traps": [
      "for (var i = 0; i < n; i++) { setTimeout(() => console.log(i)) } prints n, n, n."
    ],
    "misconceptions": [
      "Iteration is the workhorse of scripts. Three forms cover ‘known count,’ ‘unknown until condition,’ and ‘run once then maybe again.’"
    ],
    "strongSignals": [
      "Separates for / while / do...while from lookalike APIs and can draw the mental model."
    ]
  }
})
