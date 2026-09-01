import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Enumerable Properties",
  "whatIsIt": "Enumerable is a descriptor flag. for...in, Object.keys, and spread copy enumerable properties. Methods on class prototypes are non-enumerable by default. Object.defineProperty defaults enumerable to false. JSON.stringify only enumerable own strings. You can hide a field from keys by defining it non-enumerable.",
  "whyExists": "Iteration needed a way to skip ‘internal’ methods while still listing data fields. Enumerable is that bit.",
  "mentalModel": "A ‘list me in Object.keys’ checkbox on each property. Off for most prototype methods.",
  "how": [
    "Data on literals is enumerable.",
    "Use defineProperty to hide bookkeeping fields.",
    "Do not for...in if you only wanted own enumerable — use keys.",
    "Spread skips non-enumerable."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming class instance methods show up in Object.keys — they live on the prototype and are non-enumerable.",
    "variant": "warning"
  },
  "example": "const o = { vis: 1 };\nObject.defineProperty(o, 'hid', { value: 2, enumerable: false });\nconsole.log(Object.keys(o), o.hid, { ...o });\nfor (const k in o) console.log('in', k);\nclass C { m() {} }\nconsole.log(Object.keys(new C()), Object.keys(C.prototype));\n",
  "exampleCaption": "Hidden non-enumerable vs class methods",
  "internals": [
    "[[Enumerable]] on the property descriptor.",
    "EnumerableOwnProperties filters that flag.",
    "class methods use DefineMethod with enumerable false."
  ],
  "takeaways": [
    "Data on literals is enumerable.",
    "Use defineProperty to hide bookkeeping fields.",
    "Assuming class instance methods show up in Object.keys — they live on the prototype and are non-enumerable.",
    "[[Enumerable]] on the property descriptor."
  ],
  "revision": [
    "Enumerable Properties: A ‘list me in Object.keys’ checkbox on each property. Off for most prototype methods.",
    "Data on literals is enumerable.",
    "Use defineProperty to hide bookkeeping fields.",
    "Do not for...in if you only wanted own enumerable — use keys.",
    "Trap: Assuming class instance methods show up in Object.keys — they live on the prototype and are non-enumerable."
  ],
  "flashcards": [
    [
      "Enumerable Properties",
      "Enumerable is a descriptor flag."
    ],
    [
      "Mental model",
      "A ‘list me in Object.keys’ checkbox on each property. Off for most prototype methods."
    ],
    [
      "Common trap",
      "Assuming class instance methods show up in Object.keys — they live on the prototype and are non-enumerable."
    ],
    [
      "Data on literals is enumerable.",
      "Use defineProperty to hide bookkeeping fields."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Enumerable Properties and where does a beginner first see it?",
      "answerHint": "Enumerable is a descriptor flag. for...in, Object.keys, and spread copy enumerable properties. Methods on class prototypes are non-enumerable by default. Object.defineProperty defaults enumerable to false. JSON.stringify only enumerable own strings. You can hide a field from keys by defining it non-enumerable."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Enumerable Properties works and name the main pitfall.",
      "answerHint": "Data on literals is enumerable. Use defineProperty to hide bookkeeping fields. Do not for...in if you only wanted own enumerable — use keys. Spread skips non-enumerable. Pitfall: Assuming class instance methods show up in Object.keys — they live on the prototype and are non-enumerable."
    },
    {
      "level": "advanced",
      "question": "How would you explain Enumerable Properties at an interview, including engine/spec details?",
      "answerHint": "[[Enumerable]] on the property descriptor. EnumerableOwnProperties filters that flag. class methods use DefineMethod with enumerable false."
    }
  ],
  "pitfalls": [
    "Assuming class instance methods show up in Object.keys — they live on the prototype and are non-enumerable.",
    "Spread skips non-enumerable."
  ],
  "interview": {
    "expectations": [
      "Explain Enumerable Properties without mixing it up with a nearby B1.14 — Object Property Model topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[Enumerable]] on the property descriptor."
    ],
    "commonQuestions": [
      "What is Enumerable Properties?",
      "Why does JavaScript enumerable properties behave this way?",
      "What is the classic Enumerable Properties interview trap?"
    ],
    "traps": [
      "Assuming class instance methods show up in Object.keys — they live on the prototype and are non-enumerable."
    ],
    "misconceptions": [
      "Iteration needed a way to skip ‘internal’ methods while still listing data fields. Enumerable is that bit."
    ],
    "strongSignals": [
      "Separates Enumerable Properties from lookalike APIs and can draw the mental model."
    ]
  }
})
