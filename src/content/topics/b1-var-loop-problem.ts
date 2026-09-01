import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "var Loop Problem",
  "whatIsIt": "for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0) } prints 3,3,3 because the timeout callbacks close over one i, which is 3 after the loop. The loop is long finished before the task runs. This is not a setTimeout bug.",
  "whyExists": "var’s function scope plus async queues created the most famous teaching accident in JS.",
  "mentalModel": "The loop sprints to the finish and leaves i=3 on the field. Later, three cameras all photograph that same field.",
  "how": [
    "Replace var with let.",
    "Capture: ((x) => setTimeout(() => console.log(x), 0))(i).",
    "Pass i as a setTimeout argument.",
    "Use forEach on an array of indexes."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Fixing only one of several loops in a file — mixed var/let still surprises.",
    "variant": "warning"
  },
  "example": "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log('var', i), 0);\n}\nfor (let k = 0; k < 3; k++) {\n  setTimeout(() => console.log('let', k), 0);\n}\nfor (var j = 0; j < 3; j++) {\n  setTimeout((x) => console.log('arg', x), 0, j);\n}\n",
  "exampleCaption": "var 3,3,3 vs let 0,1,2 vs extra timeout arg",
  "internals": [
    "The timer task runs in a later macrotask; the loop’s var binding is already at terminal value.",
    "setTimeout extra arguments are passed to the callback by the host.",
    "let per-iteration bindings remain distinct heap slots."
  ],
  "takeaways": [
    "Replace var with let.",
    "Capture: ((x) => setTimeout(() => console.log(x), 0))(i).",
    "Fixing only one of several loops in a file — mixed var/let still surprises.",
    "The timer task runs in a later macrotask; the loop’s var binding is already at terminal value."
  ],
  "revision": [
    "var Loop Problem: The loop sprints to the finish and leaves i=3 on the field. Later, three cameras all photograph that same field.",
    "Replace var with let.",
    "Capture: ((x) => setTimeout(() => console.log(x), 0))(i).",
    "Pass i as a setTimeout argument.",
    "Trap: Fixing only one of several loops in a file — mixed var/let still surprises."
  ],
  "flashcards": [
    [
      "var Loop Problem",
      "for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0) } prints 3,3,3 because the timeout callbacks close over one i, which is 3 after the loop."
    ],
    [
      "Mental model",
      "The loop sprints to the finish and leaves i=3 on the field. Later, three cameras all photograph that same field."
    ],
    [
      "Common trap",
      "Fixing only one of several loops in a file — mixed var/let still surprises."
    ],
    [
      "Replace var with let.",
      "Capture: ((x) => setTimeout(() => console.log(x), 0))(i)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is var Loop Problem and where does a beginner first see it?",
      "answerHint": "for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0) } prints 3,3,3 because the timeout callbacks close over one i, which is 3 after the loop. The loop is long finished before the task runs. This is not a setTimeout bug."
    },
    {
      "level": "intermediate",
      "question": "Walk through how var Loop Problem works and name the main pitfall.",
      "answerHint": "Replace var with let. Capture: ((x) => setTimeout(() => console.log(x), 0))(i). Pass i as a setTimeout argument. Use forEach on an array of indexes. Pitfall: Fixing only one of several loops in a file — mixed var/let still surprises."
    },
    {
      "level": "advanced",
      "question": "How would you explain var Loop Problem at an interview, including engine/spec details?",
      "answerHint": "The timer task runs in a later macrotask; the loop’s var binding is already at terminal value. setTimeout extra arguments are passed to the callback by the host. let per-iteration bindings remain distinct heap slots."
    }
  ],
  "pitfalls": [
    "Fixing only one of several loops in a file — mixed var/let still surprises.",
    "Use forEach on an array of indexes."
  ],
  "interview": {
    "expectations": [
      "Explain var Loop Problem without mixing it up with a nearby B1.12 — Closures topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The timer task runs in a later macrotask; the loop’s var binding is already at terminal value."
    ],
    "commonQuestions": [
      "What is var Loop Problem?",
      "Why does JavaScript var loop problem behave this way?",
      "What is the classic var Loop Problem interview trap?"
    ],
    "traps": [
      "Fixing only one of several loops in a file — mixed var/let still surprises."
    ],
    "misconceptions": [
      "var’s function scope plus async queues created the most famous teaching accident in JS."
    ],
    "strongSignals": [
      "Separates var Loop Problem from lookalike APIs and can draw the mental model."
    ]
  }
})
