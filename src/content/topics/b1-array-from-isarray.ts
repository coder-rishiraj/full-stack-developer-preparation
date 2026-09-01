import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Array.from / Array.isArray",
  "whatIsIt": "Array.isArray(x) is true for arrays (and array proxies), false for objects and typed arrays. Array.from(iterableOrArrayLike, mapFn?) copies to a real array. from is the right way to convert NodeList, arguments, and generators. Array.of(...items) is a literal-like constructor that does not treat a single number as length.",
  "whyExists": "typeof cannot spot arrays. from unifies iterables and array-likes. of fixes new Array(3) vs Array.of(3).",
  "mentalModel": "isArray: brand check. from: materialize. of: list of arguments as elements, always.",
  "how": [
    "Array.isArray before assuming .map exists as Array’s map.",
    "Array.from(nodeList) in the browser.",
    "Array.from({length:n}, (_,i) => i) to make 0..n-1.",
    "Array.of(3) is [3], new Array(3) is holes."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Array.isArray(new Uint8Array()) is false — typed arrays are not Arrays.",
    "variant": "warning"
  },
  "example": "console.log(Array.isArray([]), Array.isArray({ length: 0 }), Array.isArray('ab'));\nconsole.log(Array.from('ab'), Array.from({ 0: 1, 1: 2, length: 2 }));\nconsole.log(Array.from({ length: 3 }, (_, i) => i));\nconsole.log(Array.of(3), Array(3));\n",
  "exampleCaption": "isArray, from string/array-like, of vs Array(3)",
  "internals": [
    "IsArray: exotic array or proxy with array target.",
    "from: if iterable, iterator walk; else LengthOfArrayLike.",
    "ArraySpeciesCreate is not used by from in the same way as map (from is on Array)."
  ],
  "takeaways": [
    "Array.isArray before assuming .map exists as Array’s map.",
    "Array.from(nodeList) in the browser.",
    "Array.isArray(new Uint8Array()) is false — typed arrays are not Arrays.",
    "IsArray: exotic array or proxy with array target."
  ],
  "revision": [
    "Array.from / Array.isArray: isArray: brand check. from: materialize. of: list of arguments as elements, always.",
    "Array.isArray before assuming .map exists as Array’s map.",
    "Array.from(nodeList) in the browser.",
    "Array.from({length:n}, (_,i) => i) to make 0..n-1.",
    "Trap: Array.isArray(new Uint8Array()) is false — typed arrays are not Arrays."
  ],
  "flashcards": [
    [
      "Array.from / Array.isArray",
      "Array.isArray(x) is true for arrays (and array proxies), false for objects and typed arrays."
    ],
    [
      "Mental model",
      "isArray: brand check. from: materialize. of: list of arguments as elements, always."
    ],
    [
      "Common trap",
      "Array.isArray(new Uint8Array()) is false — typed arrays are not Arrays."
    ],
    [
      "Array.isArray before assuming .map exists as Array’s map.",
      "Array.from(nodeList) in the browser."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Array.from / Array.isArray and where does a beginner first see it?",
      "answerHint": "Array.isArray(x) is true for arrays (and array proxies), false for objects and typed arrays. Array.from(iterableOrArrayLike, mapFn?) copies to a real array. from is the right way to convert NodeList, arguments, and generators. Array.of(...items) is a literal-like constructor that does not treat a single number as length."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Array.from / Array.isArray works and name the main pitfall.",
      "answerHint": "Array.isArray before assuming .map exists as Array’s map. Array.from(nodeList) in the browser. Array.from({length:n}, (_,i) => i) to make 0..n-1. Array.of(3) is [3], new Array(3) is holes. Pitfall: Array.isArray(new Uint8Array()) is false — typed arrays are not Arrays."
    },
    {
      "level": "advanced",
      "question": "How would you explain Array.from / Array.isArray at an interview, including engine/spec details?",
      "answerHint": "IsArray: exotic array or proxy with array target. from: if iterable, iterator walk; else LengthOfArrayLike. ArraySpeciesCreate is not used by from in the same way as map (from is on Array)."
    }
  ],
  "pitfalls": [
    "Array.isArray(new Uint8Array()) is false — typed arrays are not Arrays.",
    "Array.of(3) is [3], new Array(3) is holes."
  ],
  "interview": {
    "expectations": [
      "Explain Array.from / Array.isArray without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "IsArray: exotic array or proxy with array target."
    ],
    "commonQuestions": [
      "What is Array.from / Array.isArray?",
      "Why does JavaScript array.from / array.isarray behave this way?",
      "What is the classic Array.from / Array.isArray interview trap?"
    ],
    "traps": [
      "Array.isArray(new Uint8Array()) is false — typed arrays are not Arrays."
    ],
    "misconceptions": [
      "typeof cannot spot arrays. from unifies iterables and array-likes. of fixes new Array(3) vs Array.of(3)."
    ],
    "strongSignals": [
      "Separates Array.from / Array.isArray from lookalike APIs and can draw the mental model."
    ]
  }
})
