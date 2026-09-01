import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "keys / values / entries / fromEntries",
  "whatIsIt": "Object.keys returns enumerable own string keys (insertion order, then integer indexes first on arrays). values and entries follow the same key set. fromEntries builds an object from [key,value] pairs (last duplicate wins). They do not include symbols. JSON.stringify uses enumerable own strings too.",
  "whyExists": "Turning objects into arrays lets you map/filter/reduce records. fromEntries closes the loop after transforming entries.",
  "mentalModel": "Photograph the enumerable string columns of this object only, not the prototype’s columns.",
  "how": [
    "Object.entries(obj).map → fromEntries for transforms.",
    "For symbols, call getOwnPropertySymbols.",
    "Integer keys on arrays come first, then other strings.",
    "Do not use keys on Map — use Map.prototype.keys."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Object.keys(map) on a Map is [] — Map is not a plain record of its entries.",
    "variant": "warning"
  },
  "example": "const o = { z: 1, a: 2 };\nconsole.log(Object.keys(o), Object.values(o));\nconst doubled = Object.fromEntries(\n  Object.entries(o).map(([k, v]) => [k, v * 2]),\n);\nconsole.log(doubled);\nconst arr = ['p', 'q'];\narr.extra = true;\nconsole.log(Object.keys(arr));\n",
  "exampleCaption": "entries transform and array extra keys",
  "internals": [
    "OwnPropertyKeys order: integer indexes ascending, then other strings in creation order, then symbols.",
    "keys filters to enumerable strings only.",
    "fromEntries ToPropertyKey on each key (symbols allowed here)."
  ],
  "takeaways": [
    "Object.entries(obj).map → fromEntries for transforms.",
    "For symbols, call getOwnPropertySymbols.",
    "Object.keys(map) on a Map is [] — Map is not a plain record of its entries.",
    "OwnPropertyKeys order: integer indexes ascending, then other strings in creation order, then symbols."
  ],
  "revision": [
    "keys / values / entries / fromEntries: Photograph the enumerable string columns of this object only, not the prototype’s columns.",
    "Object.entries(obj).map → fromEntries for transforms.",
    "For symbols, call getOwnPropertySymbols.",
    "Integer keys on arrays come first, then other strings.",
    "Trap: Object.keys(map) on a Map is [] — Map is not a plain record of its entries."
  ],
  "flashcards": [
    [
      "keys / values / entries / fromEntries",
      "Object.keys returns enumerable own string keys (insertion order, then integer indexes first on arrays)."
    ],
    [
      "Mental model",
      "Photograph the enumerable string columns of this object only, not the prototype’s columns."
    ],
    [
      "Common trap",
      "Object.keys(map) on a Map is [] — Map is not a plain record of its entries."
    ],
    [
      "Object.entries(obj).map → fromEntries for transforms.",
      "For symbols, call getOwnPropertySymbols."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is keys / values / entries / fromEntries and where does a beginner first see it?",
      "answerHint": "Object.keys returns enumerable own string keys (insertion order, then integer indexes first on arrays). values and entries follow the same key set. fromEntries builds an object from [key,value] pairs (last duplicate wins). They do not include symbols. JSON.stringify uses enumerable own strings too."
    },
    {
      "level": "intermediate",
      "question": "Walk through how keys / values / entries / fromEntries works and name the main pitfall.",
      "answerHint": "Object.entries(obj).map → fromEntries for transforms. For symbols, call getOwnPropertySymbols. Integer keys on arrays come first, then other strings. Do not use keys on Map — use Map.prototype.keys. Pitfall: Object.keys(map) on a Map is [] — Map is not a plain record of its entries."
    },
    {
      "level": "advanced",
      "question": "How would you explain keys / values / entries / fromEntries at an interview, including engine/spec details?",
      "answerHint": "OwnPropertyKeys order: integer indexes ascending, then other strings in creation order, then symbols. keys filters to enumerable strings only. fromEntries ToPropertyKey on each key (symbols allowed here)."
    }
  ],
  "pitfalls": [
    "Object.keys(map) on a Map is [] — Map is not a plain record of its entries.",
    "Do not use keys on Map — use Map.prototype.keys."
  ],
  "interview": {
    "expectations": [
      "Explain keys / values / entries / fromEntries without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OwnPropertyKeys order: integer indexes ascending, then other strings in creation order, then symbols."
    ],
    "commonQuestions": [
      "What is keys / values / entries / fromEntries?",
      "Why does JavaScript keys / values / entries / fromentries behave this way?",
      "What is the classic keys / values / entries / fromEntries interview trap?"
    ],
    "traps": [
      "Object.keys(map) on a Map is [] — Map is not a plain record of its entries."
    ],
    "misconceptions": [
      "Turning objects into arrays lets you map/filter/reduce records. fromEntries closes the loop after transforming entries."
    ],
    "strongSignals": [
      "Separates keys / values / entries / fromEntries from lookalike APIs and can draw the mental model."
    ]
  }
})
