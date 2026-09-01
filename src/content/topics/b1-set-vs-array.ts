import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Set vs Array",
  "whatIsIt": "Array: ordered list, duplicates allowed, indexes, extra methods (map/filter). Set: unique values, fast has, no random access by index. Convert with [...set] or Array.from. Use Set when the question is membership or uniqueness; array when order of duplicates and indexes matter.",
  "whyExists": "Both are collections. Picking the wrong one is a performance and bug choice (duplicate users in a list vs a set of ids).",
  "mentalModel": "Array is a numbered playlist (repeats allowed). Set is a bag of unique tickets.",
  "how": [
    "Dedupe: [...new Set(arr)].",
    "Intersection: a.filter(x => bSet.has(x)).",
    "Do not use Set for ordered stacks unless you only need uniqueness.",
    "JSON.stringify(set) is {} — convert first."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.stringify(new Set([1,2])) is '{}' not '[1,2]'.",
    "variant": "warning"
  },
  "example": "const arr = [1, 2, 2, 3];\nconst unique = [...new Set(arr)];\nconst other = new Set([2, 4]);\nconsole.log(unique.filter((n) => other.has(n)));\nconsole.log(JSON.stringify(new Set([1])), JSON.stringify(unique));\n",
  "exampleCaption": "Dedupe and intersection; JSON of Set vs array",
  "internals": [
    "Array is an exotic object with length; Set is a Set object with internal [[SetData]].",
    "Set iteration order is insertion order per spec.",
    "No Array.prototype methods on Set — convert or write helpers."
  ],
  "takeaways": [
    "Dedupe: [...new Set(arr)].",
    "Intersection: a.filter(x => bSet.has(x)).",
    "JSON.stringify(new Set([1,2])) is '{}' not '[1,2]'.",
    "Array is an exotic object with length; Set is a Set object with internal [[SetData]]."
  ],
  "revision": [
    "Set vs Array: Array is a numbered playlist (repeats allowed). Set is a bag of unique tickets.",
    "Dedupe: [...new Set(arr)].",
    "Intersection: a.filter(x => bSet.has(x)).",
    "Do not use Set for ordered stacks unless you only need uniqueness.",
    "Trap: JSON.stringify(new Set([1,2])) is '{}' not '[1,2]'."
  ],
  "flashcards": [
    [
      "Set vs Array",
      "Array: ordered list, duplicates allowed, indexes, extra methods (map/filter)."
    ],
    [
      "Mental model",
      "Array is a numbered playlist (repeats allowed). Set is a bag of unique tickets."
    ],
    [
      "Common trap",
      "JSON.stringify(new Set([1,2])) is '{}' not '[1,2]'."
    ],
    [
      "Dedupe: [...new Set(arr)].",
      "Intersection: a.filter(x => bSet.has(x))."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Set vs Array and where does a beginner first see it?",
      "answerHint": "Array: ordered list, duplicates allowed, indexes, extra methods (map/filter). Set: unique values, fast has, no random access by index. Convert with [...set] or Array.from. Use Set when the question is membership or uniqueness; array when order of duplicates and indexes matter."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Set vs Array works and name the main pitfall.",
      "answerHint": "Dedupe: [...new Set(arr)]. Intersection: a.filter(x => bSet.has(x)). Do not use Set for ordered stacks unless you only need uniqueness. JSON.stringify(set) is {} — convert first. Pitfall: JSON.stringify(new Set([1,2])) is '{}' not '[1,2]'."
    },
    {
      "level": "advanced",
      "question": "How would you explain Set vs Array at an interview, including engine/spec details?",
      "answerHint": "Array is an exotic object with length; Set is a Set object with internal [[SetData]]. Set iteration order is insertion order per spec. No Array.prototype methods on Set — convert or write helpers."
    }
  ],
  "pitfalls": [
    "JSON.stringify(new Set([1,2])) is '{}' not '[1,2]'.",
    "JSON.stringify(set) is {} — convert first."
  ],
  "interview": {
    "expectations": [
      "Explain Set vs Array without mixing it up with a nearby B1.19 — Maps, Sets & Weak Collections topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Array is an exotic object with length; Set is a Set object with internal [[SetData]]."
    ],
    "commonQuestions": [
      "What is Set vs Array?",
      "Why does JavaScript set vs array behave this way?",
      "What is the classic Set vs Array interview trap?"
    ],
    "traps": [
      "JSON.stringify(new Set([1,2])) is '{}' not '[1,2]'."
    ],
    "misconceptions": [
      "Both are collections. Picking the wrong one is a performance and bug choice (duplicate users in a list vs a set of ids)."
    ],
    "strongSignals": [
      "Separates Set vs Array from lookalike APIs and can draw the mental model."
    ]
  }
})
