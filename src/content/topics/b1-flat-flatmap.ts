import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "flat / flatMap",
  "whatIsIt": "flat(depth=1) concatenates nested arrays up to depth. flat(Infinity) fully flattens. Holes are dropped. flatMap(fn) is map(fn) then flat(1) — fn can return an array to expand, or a value to keep one. Neither is recursive flatten unless you set depth. They return new arrays.",
  "whyExists": "Nested arrays from grouping or map-that-returns-lists needed a standard flatten.",
  "mentalModel": "flat: smash nested lists. flatMap: transform then smash one level (map + concat).",
  "how": [
    "flatMap instead of map().flat().",
    "Return [] from flatMap to drop an item.",
    "Do not flat() accidentally flattening strings (strings are not arrays; they stay).",
    "depth 0 is a shallow copy-ish flatten no-op beyond copy rules."
  ],
  "callout": {
    "title": "Watch for",
    "text": "flatMap(fn) only flats one level — returning nested arrays leaves inner arrays.",
    "variant": "warning"
  },
  "example": "console.log([1, [2, [3]]].flat(), [1, [2, [3]]].flat(2));\nconsole.log([1, 2, 3].flatMap((n) => [n, n * 10]));\nconsole.log([1, 2, 3].flatMap((n) => (n === 2 ? [] : [n])));\nconsole.log([1, , 3].flat());\n",
  "exampleCaption": "flat depth, flatMap expand/drop, holes",
  "internals": [
    "FlattenIntoArray recursive with depth counter.",
    "IsArray check — array-likes that are not arrays may not flatten.",
    "flatMap is equivalent to map then flatten 1, but specified as one walk."
  ],
  "takeaways": [
    "flatMap instead of map().flat().",
    "Return [] from flatMap to drop an item.",
    "flatMap(fn) only flats one level — returning nested arrays leaves inner arrays.",
    "FlattenIntoArray recursive with depth counter."
  ],
  "revision": [
    "flat / flatMap: flat: smash nested lists. flatMap: transform then smash one level (map + concat).",
    "flatMap instead of map().flat().",
    "Return [] from flatMap to drop an item.",
    "Do not flat() accidentally flattening strings (strings are not arrays; they stay).",
    "Trap: flatMap(fn) only flats one level — returning nested arrays leaves inner arrays."
  ],
  "flashcards": [
    [
      "flat / flatMap",
      "flat(depth=1) concatenates nested arrays up to depth."
    ],
    [
      "Mental model",
      "flat: smash nested lists. flatMap: transform then smash one level (map + concat)."
    ],
    [
      "Common trap",
      "flatMap(fn) only flats one level — returning nested arrays leaves inner arrays."
    ],
    [
      "flatMap instead of map().flat().",
      "Return [] from flatMap to drop an item."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is flat / flatMap and where does a beginner first see it?",
      "answerHint": "flat(depth=1) concatenates nested arrays up to depth. flat(Infinity) fully flattens. Holes are dropped. flatMap(fn) is map(fn) then flat(1) — fn can return an array to expand, or a value to keep one. Neither is recursive flatten unless you set depth. They return new arrays."
    },
    {
      "level": "intermediate",
      "question": "Walk through how flat / flatMap works and name the main pitfall.",
      "answerHint": "flatMap instead of map().flat(). Return [] from flatMap to drop an item. Do not flat() accidentally flattening strings (strings are not arrays; they stay). depth 0 is a shallow copy-ish flatten no-op beyond copy rules. Pitfall: flatMap(fn) only flats one level — returning nested arrays leaves inner arrays."
    },
    {
      "level": "advanced",
      "question": "How would you explain flat / flatMap at an interview, including engine/spec details?",
      "answerHint": "FlattenIntoArray recursive with depth counter. IsArray check — array-likes that are not arrays may not flatten. flatMap is equivalent to map then flatten 1, but specified as one walk."
    }
  ],
  "pitfalls": [
    "flatMap(fn) only flats one level — returning nested arrays leaves inner arrays.",
    "depth 0 is a shallow copy-ish flatten no-op beyond copy rules."
  ],
  "interview": {
    "expectations": [
      "Explain flat / flatMap without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "FlattenIntoArray recursive with depth counter."
    ],
    "commonQuestions": [
      "What is flat / flatMap?",
      "Why does JavaScript flat / flatmap behave this way?",
      "What is the classic flat / flatMap interview trap?"
    ],
    "traps": [
      "flatMap(fn) only flats one level — returning nested arrays leaves inner arrays."
    ],
    "misconceptions": [
      "Nested arrays from grouping or map-that-returns-lists needed a standard flatten."
    ],
    "strongSignals": [
      "Separates flat / flatMap from lookalike APIs and can draw the mental model."
    ]
  }
})
