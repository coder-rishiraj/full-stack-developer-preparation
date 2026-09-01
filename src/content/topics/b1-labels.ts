import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Labels",
  "whatIsIt": "A label is an identifier before a statement: outer: for (...) { break outer }. break label jumps out of that labeled statement. continue label jumps to the next iteration of that labeled loop. Labels do not create a new scope. They are rarely needed and easy to overuse.",
  "whyExists": "Nested loops sometimes need to abort the outer one without a flag variable. C-family labels cover that.",
  "mentalModel": "A named fence around a loop. break fence leaves the fence; continue fence starts the next lap of that fence.",
  "how": [
    "Label loops, not arbitrary blocks, unless you know why.",
    "Choose names that say which loop: rows:, cols:.",
    "Extract a function if labels nest more than one level.",
    "A labeled block can be break’d but not continue’d."
  ],
  "callout": {
    "title": "Watch for",
    "text": "break foo when foo labels an inner loop only exits inner — the name must sit on the statement you want to leave.",
    "variant": "warning"
  },
  "example": "let hits = 0;\nrows: for (let r = 0; r < 3; r++) {\n  for (let c = 0; c < 3; c++) {\n    if (r === 1 && c === 1) break rows;\n    hits += 1;\n  }\n}\nconsole.log(hits);\ndone: {\n  break done;\n  console.log('skipped');\n}\nconsole.log('after block');\n",
  "exampleCaption": "Labeled break out of nested loops and a block",
  "internals": [
    "LabelledStatement wraps a statement with a name in the label set.",
    "continue requires the label to name an IterationStatement.",
    "Duplicate labels in nested statements are early errors in some cases."
  ],
  "takeaways": [
    "Label loops, not arbitrary blocks, unless you know why.",
    "Choose names that say which loop: rows:, cols:.",
    "break foo when foo labels an inner loop only exits inner — the name must sit on the statement you want to leave.",
    "LabelledStatement wraps a statement with a name in the label set."
  ],
  "revision": [
    "Labels: A named fence around a loop. break fence leaves the fence; continue fence starts the next lap of that fence.",
    "Label loops, not arbitrary blocks, unless you know why.",
    "Choose names that say which loop: rows:, cols:.",
    "Extract a function if labels nest more than one level.",
    "Trap: break foo when foo labels an inner loop only exits inner — the name must sit on the statement you want to leave."
  ],
  "flashcards": [
    [
      "Labels",
      "A label is an identifier before a statement: outer: for (...) { break outer }."
    ],
    [
      "Mental model",
      "A named fence around a loop. break fence leaves the fence; continue fence starts the next lap of that fence."
    ],
    [
      "Common trap",
      "break foo when foo labels an inner loop only exits inner — the name must sit on the statement you want to leave."
    ],
    [
      "Label loops, not arbitrary blocks, unless you know why.",
      "Choose names that say which loop: rows:, cols:."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Labels and where does a beginner first see it?",
      "answerHint": "A label is an identifier before a statement: outer: for (...) { break outer }. break label jumps out of that labeled statement. continue label jumps to the next iteration of that labeled loop. Labels do not create a new scope. They are rarely needed and easy to overuse."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Labels works and name the main pitfall.",
      "answerHint": "Label loops, not arbitrary blocks, unless you know why. Choose names that say which loop: rows:, cols:. Extract a function if labels nest more than one level. A labeled block can be break’d but not continue’d. Pitfall: break foo when foo labels an inner loop only exits inner — the name must sit on the statement you want to leave."
    },
    {
      "level": "advanced",
      "question": "How would you explain Labels at an interview, including engine/spec details?",
      "answerHint": "LabelledStatement wraps a statement with a name in the label set. continue requires the label to name an IterationStatement. Duplicate labels in nested statements are early errors in some cases."
    }
  ],
  "pitfalls": [
    "break foo when foo labels an inner loop only exits inner — the name must sit on the statement you want to leave.",
    "A labeled block can be break’d but not continue’d."
  ],
  "interview": {
    "expectations": [
      "Explain Labels without mixing it up with a nearby B1.6 — Control Flow topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "LabelledStatement wraps a statement with a name in the label set."
    ],
    "commonQuestions": [
      "What is Labels?",
      "Why does JavaScript labels behave this way?",
      "What is the classic Labels interview trap?"
    ],
    "traps": [
      "break foo when foo labels an inner loop only exits inner — the name must sit on the statement you want to leave."
    ],
    "misconceptions": [
      "Nested loops sometimes need to abort the outer one without a flag variable. C-family labels cover that."
    ],
    "strongSignals": [
      "Separates Labels from lookalike APIs and can draw the mental model."
    ]
  }
})
