import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Debouncing",
  "whatIsIt": "Debounce delays calling fn until wait ms have passed since the last invoke. Typical: search input. Leading vs trailing: fire at start and/or after quiet. You must cancel on unmount. Implement with setTimeout and a stored id; each call clears the previous timer.",
  "whyExists": "Users type faster than you should hit the network. Debounce waits for a pause.",
  "mentalModel": "An elevator door: it resets the close timer every time someone blocks the sensor. It closes after the last interruption.",
  "how": [
    "Trailing debounce for search boxes.",
    "Return a cancel function.",
    "Pass the latest args to the trailing call.",
    "Do not debounce already-debounced handlers accidentally twice."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Debouncing a function but using the first event’s target in a closure — args must be from the last call.",
    "variant": "warning"
  },
  "example": "function debounce(fn, wait) {\n  let t;\n  const wrapped = (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), wait);\n  };\n  wrapped.cancel = () => clearTimeout(t);\n  return wrapped;\n}\nconst d = debounce((s) => console.log('search', s), 20);\nd('a'); d('ab'); d('abc');\n",
  "exampleCaption": "Trailing debounce: only the last 'abc' should log",
  "internals": [
    "Purely host timers; not a language primitive.",
    "Each wrapped call is O(1) plus one timeout.",
    "Leading+trailing needs extra flags for ‘already fired.’"
  ],
  "takeaways": [
    "Trailing debounce for search boxes.",
    "Return a cancel function.",
    "Debouncing a function but using the first event’s target in a closure — args must be from the last call.",
    "Purely host timers; not a language primitive."
  ],
  "revision": [
    "Debouncing: An elevator door: it resets the close timer every time someone blocks the sensor. It closes after the last interruption.",
    "Trailing debounce for search boxes.",
    "Return a cancel function.",
    "Pass the latest args to the trailing call.",
    "Trap: Debouncing a function but using the first event’s target in a closure — args must be from the last call."
  ],
  "flashcards": [
    [
      "Debouncing",
      "Debounce delays calling fn until wait ms have passed since the last invoke."
    ],
    [
      "Mental model",
      "An elevator door: it resets the close timer every time someone blocks the sensor. It closes after the last interruption."
    ],
    [
      "Common trap",
      "Debouncing a function but using the first event’s target in a closure — args must be from the last call."
    ],
    [
      "Trailing debounce for search boxes.",
      "Return a cancel function."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Debouncing and where does a beginner first see it?",
      "answerHint": "Debounce delays calling fn until wait ms have passed since the last invoke. Typical: search input. Leading vs trailing: fire at start and/or after quiet. You must cancel on unmount. Implement with setTimeout and a stored id; each call clears the previous timer."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Debouncing works and name the main pitfall.",
      "answerHint": "Trailing debounce for search boxes. Return a cancel function. Pass the latest args to the trailing call. Do not debounce already-debounced handlers accidentally twice. Pitfall: Debouncing a function but using the first event’s target in a closure — args must be from the last call."
    },
    {
      "level": "advanced",
      "question": "How would you explain Debouncing at an interview, including engine/spec details?",
      "answerHint": "Purely host timers; not a language primitive. Each wrapped call is O(1) plus one timeout. Leading+trailing needs extra flags for ‘already fired.’"
    }
  ],
  "pitfalls": [
    "Debouncing a function but using the first event’s target in a closure — args must be from the last call.",
    "Do not debounce already-debounced handlers accidentally twice."
  ],
  "interview": {
    "expectations": [
      "Explain Debouncing without mixing it up with a nearby B1.40 — Performance Patterns topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Purely host timers; not a language primitive."
    ],
    "commonQuestions": [
      "What is Debouncing?",
      "Why does JavaScript debouncing behave this way?",
      "What is the classic Debouncing interview trap?"
    ],
    "traps": [
      "Debouncing a function but using the first event’s target in a closure — args must be from the last call."
    ],
    "misconceptions": [
      "Users type faster than you should hit the network. Debounce waits for a pause."
    ],
    "strongSignals": [
      "Separates Debouncing from lookalike APIs and can draw the mental model."
    ]
  }
})
