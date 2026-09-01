import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "sort and JavaScript Sorting Gotchas",
  "whatIsIt": "sort() mutates and, without a comparator, converts elements to strings and compares UTF-16 (‘10' < '2'). The compare function should return negative/zero/positive. Undefined elements go to the end. toSorted is the copy version. Stability is required by modern spec (equal items keep order).",
  "whyExists": "Sorting is fundamental. The default string sort is a historic footgun for numbers.",
  "mentalModel": "No comparator: dictionary of ToString. With (a,b) => a-b: numeric. It sorts in place unless you toSorted.",
  "how": [
    "Always pass a comparator for numbers.",
    "Do not subtract if values can be bigint or non-numeric.",
    "Copy first or use toSorted to keep the original.",
    "localeCompare for human strings."
  ],
  "callout": {
    "title": "Watch for",
    "text": "[10, 2].sort() → [10, 2] as strings '10','2' — '10' comes before '2'.",
    "variant": "warning"
  },
  "example": "console.log([10, 2, 1].sort());\nconsole.log([10, 2, 1].sort((a, b) => a - b));\nconst a = ['b', 'a'];\nconsole.log(a.toSorted(), a);\nconsole.log(['ä', 'z', 'a'].sort((x, y) => x.localeCompare(y, 'de')));\n",
  "exampleCaption": "Default string sort vs numeric comparator",
  "internals": [
    "ComparearrayElements: undefined handling, then ToString if no comparefn.",
    "comparefn must be consistent or sort is implementation-defined chaos.",
    "Stability: originally not required; ES2019 required it."
  ],
  "takeaways": [
    "Always pass a comparator for numbers.",
    "Do not subtract if values can be bigint or non-numeric.",
    "[10, 2].sort() → [10, 2] as strings '10','2' — '10' comes before '2'.",
    "ComparearrayElements: undefined handling, then ToString if no comparefn."
  ],
  "revision": [
    "sort and JavaScript Sorting Gotchas: No comparator: dictionary of ToString. With (a,b) => a-b: numeric. It sorts in place unless you toSorted.",
    "Always pass a comparator for numbers.",
    "Do not subtract if values can be bigint or non-numeric.",
    "Copy first or use toSorted to keep the original.",
    "Trap: [10, 2].sort() → [10, 2] as strings '10','2' — '10' comes before '2'."
  ],
  "flashcards": [
    [
      "sort and JavaScript Sorting Gotchas",
      "sort() mutates and, without a comparator, converts elements to strings and compares UTF-16 (‘10' < '2')."
    ],
    [
      "Mental model",
      "No comparator: dictionary of ToString. With (a,b) => a-b: numeric. It sorts in place unless you toSorted."
    ],
    [
      "Common trap",
      "[10, 2].sort() → [10, 2] as strings '10','2' — '10' comes before '2'."
    ],
    [
      "Always pass a comparator for numbers.",
      "Do not subtract if values can be bigint or non-numeric."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is sort and JavaScript Sorting Gotchas and where does a beginner first see it?",
      "answerHint": "sort() mutates and, without a comparator, converts elements to strings and compares UTF-16 (‘10' < '2'). The compare function should return negative/zero/positive. Undefined elements go to the end. toSorted is the copy version. Stability is required by modern spec (equal items keep order)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how sort and JavaScript Sorting Gotchas works and name the main pitfall.",
      "answerHint": "Always pass a comparator for numbers. Do not subtract if values can be bigint or non-numeric. Copy first or use toSorted to keep the original. localeCompare for human strings. Pitfall: [10, 2].sort() → [10, 2] as strings '10','2' — '10' comes before '2'."
    },
    {
      "level": "advanced",
      "question": "How would you explain sort and JavaScript Sorting Gotchas at an interview, including engine/spec details?",
      "answerHint": "ComparearrayElements: undefined handling, then ToString if no comparefn. comparefn must be consistent or sort is implementation-defined chaos. Stability: originally not required; ES2019 required it."
    }
  ],
  "pitfalls": [
    "[10, 2].sort() → [10, 2] as strings '10','2' — '10' comes before '2'.",
    "localeCompare for human strings."
  ],
  "interview": {
    "expectations": [
      "Explain sort and JavaScript Sorting Gotchas without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ComparearrayElements: undefined handling, then ToString if no comparefn."
    ],
    "commonQuestions": [
      "What is sort and JavaScript Sorting Gotchas?",
      "Why does JavaScript sort and javascript sorting gotchas behave this way?",
      "What is the classic sort and JavaScript Sorting Gotchas interview trap?"
    ],
    "traps": [
      "[10, 2].sort() → [10, 2] as strings '10','2' — '10' comes before '2'."
    ],
    "misconceptions": [
      "Sorting is fundamental. The default string sort is a historic footgun for numbers."
    ],
    "strongSignals": [
      "Separates sort and JavaScript Sorting Gotchas from lookalike APIs and can draw the mental model."
    ]
  }
})
