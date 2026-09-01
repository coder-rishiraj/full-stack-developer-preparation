import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "includes / indexOf / find",
  "whatIsIt": "indexOf(value, fromIndex) uses ===. includes(value, fromIndex) uses SameValueZero. find(predicate) returns the element or undefined. findIndex returns -1 if none. fromIndex can be negative (from end). These do not deep-equal objects.",
  "whyExists": "Three APIs: position, boolean with NaN-correctness, and predicate search. Each filled a hole in the last.",
  "mentalModel": "indexOf: === walk. includes: Set-like equality walk. find: your callback decides.",
  "how": [
    "Prefer includes over indexOf !== -1.",
    "find for the object; findIndex when you need to splice it out.",
    "Pass fromIndex to skip a prefix.",
    "undefined from find is ambiguous if undefined is also a valid element — use findIndex."
  ],
  "callout": {
    "title": "Watch for",
    "text": "find returns undefined both for ‘not found’ and ‘found an undefined element.’",
    "variant": "warning"
  },
  "example": "const a = ['a', 'b', 'a'];\nconsole.log(a.indexOf('a'), a.lastIndexOf('a'), a.includes('c'));\nconst users = [{ id: 1 }, { id: 2 }];\nconsole.log(users.find((u) => u.id === 2));\nconsole.log(users.findIndex((u) => u.id === 3));\n",
  "exampleCaption": "indexOf/lastIndexOf/includes vs find/findIndex",
  "internals": [
    "SameValueZero: NaN matches NaN; +0 matches -0.",
    "fromIndex is ToIntegerOrInfinity; > length short-circuits.",
    "Callbacks for find receive (element, index, array)."
  ],
  "takeaways": [
    "Prefer includes over indexOf !== -1.",
    "find for the object; findIndex when you need to splice it out.",
    "find returns undefined both for ‘not found’ and ‘found an undefined element.’",
    "SameValueZero: NaN matches NaN; +0 matches -0."
  ],
  "revision": [
    "includes / indexOf / find: indexOf: === walk. includes: Set-like equality walk. find: your callback decides.",
    "Prefer includes over indexOf !== -1.",
    "find for the object; findIndex when you need to splice it out.",
    "Pass fromIndex to skip a prefix.",
    "Trap: find returns undefined both for ‘not found’ and ‘found an undefined element.’"
  ],
  "flashcards": [
    [
      "includes / indexOf / find",
      "indexOf(value, fromIndex) uses ===."
    ],
    [
      "Mental model",
      "indexOf: === walk. includes: Set-like equality walk. find: your callback decides."
    ],
    [
      "Common trap",
      "find returns undefined both for ‘not found’ and ‘found an undefined element.’"
    ],
    [
      "Prefer includes over indexOf !== -1.",
      "find for the object; findIndex when you need to splice it out."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is includes / indexOf / find and where does a beginner first see it?",
      "answerHint": "indexOf(value, fromIndex) uses ===. includes(value, fromIndex) uses SameValueZero. find(predicate) returns the element or undefined. findIndex returns -1 if none. fromIndex can be negative (from end). These do not deep-equal objects."
    },
    {
      "level": "intermediate",
      "question": "Walk through how includes / indexOf / find works and name the main pitfall.",
      "answerHint": "Prefer includes over indexOf !== -1. find for the object; findIndex when you need to splice it out. Pass fromIndex to skip a prefix. undefined from find is ambiguous if undefined is also a valid element — use findIndex. Pitfall: find returns undefined both for ‘not found’ and ‘found an undefined element.’"
    },
    {
      "level": "advanced",
      "question": "How would you explain includes / indexOf / find at an interview, including engine/spec details?",
      "answerHint": "SameValueZero: NaN matches NaN; +0 matches -0. fromIndex is ToIntegerOrInfinity; > length short-circuits. Callbacks for find receive (element, index, array)."
    }
  ],
  "pitfalls": [
    "find returns undefined both for ‘not found’ and ‘found an undefined element.’",
    "undefined from find is ambiguous if undefined is also a valid element — use findIndex."
  ],
  "interview": {
    "expectations": [
      "Explain includes / indexOf / find without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "SameValueZero: NaN matches NaN; +0 matches -0."
    ],
    "commonQuestions": [
      "What is includes / indexOf / find?",
      "Why does JavaScript includes / indexof / find behave this way?",
      "What is the classic includes / indexOf / find interview trap?"
    ],
    "traps": [
      "find returns undefined both for ‘not found’ and ‘found an undefined element.’"
    ],
    "misconceptions": [
      "Three APIs: position, boolean with NaN-correctness, and predicate search. Each filled a hole in the last."
    ],
    "strongSignals": [
      "Separates includes / indexOf / find from lookalike APIs and can draw the mental model."
    ]
  }
})
