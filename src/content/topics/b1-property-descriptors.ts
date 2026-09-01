import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Property Descriptors",
  "whatIsIt": "A property is defined by a descriptor: data (value, writable) or accessor (get, set), plus enumerable and configurable. getOwnPropertyDescriptor reads it. defineProperty writes it. Missing flags default to false when using defineProperty (unlike literals, which are writable enumerable configurable true).",
  "whyExists": "The object model needed more than a value: getters, locks, and visibility. Descriptors are the full record.",
  "mentalModel": "A property is a row in a table with columns for value or get/set, plus three boolean switches.",
  "how": [
    "defineProperty for non-enumerable or read-only fields.",
    "Remember defineProperty defaults flags to false.",
    "configurable:false is hard to undo.",
    "Accessors cannot also have value/writable."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Object.defineProperty(o,'x',{value:1}) is not writable — later o.x = 2 fails silently or throws.",
    "variant": "warning"
  },
  "example": "const o = {};\nObject.defineProperty(o, 'n', { value: 1, writable: true, enumerable: true, configurable: true });\nconsole.log(Object.getOwnPropertyDescriptor(o, 'n'));\nObject.defineProperty(o, 'hidden', { value: 9 });\nconsole.log(Object.getOwnPropertyDescriptor(o, 'hidden'), Object.keys(o));\n",
  "exampleCaption": "Literal-like descriptor vs default-false defineProperty",
  "internals": [
    "ValidateAndApplyPropertyDescriptor distinguishes data vs accessor.",
    "OrdinaryDefineOwnProperty implements the eight-flag checks.",
    "Proxy defineProperty trap can intercept."
  ],
  "takeaways": [
    "defineProperty for non-enumerable or read-only fields.",
    "Remember defineProperty defaults flags to false.",
    "Object.defineProperty(o,'x',{value:1}) is not writable — later o.x = 2 fails silently or throws.",
    "ValidateAndApplyPropertyDescriptor distinguishes data vs accessor."
  ],
  "revision": [
    "Property Descriptors: A property is a row in a table with columns for value or get/set, plus three boolean switches.",
    "defineProperty for non-enumerable or read-only fields.",
    "Remember defineProperty defaults flags to false.",
    "configurable:false is hard to undo.",
    "Trap: Object.defineProperty(o,'x',{value:1}) is not writable — later o.x = 2 fails silently or throws."
  ],
  "flashcards": [
    [
      "Property Descriptors",
      "A property is defined by a descriptor: data (value, writable) or accessor (get, set), plus enumerable and configurable."
    ],
    [
      "Mental model",
      "A property is a row in a table with columns for value or get/set, plus three boolean switches."
    ],
    [
      "Common trap",
      "Object.defineProperty(o,'x',{value:1}) is not writable — later o.x = 2 fails silently or throws."
    ],
    [
      "defineProperty for non-enumerable or read-only fields.",
      "Remember defineProperty defaults flags to false."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Property Descriptors and where does a beginner first see it?",
      "answerHint": "A property is defined by a descriptor: data (value, writable) or accessor (get, set), plus enumerable and configurable. getOwnPropertyDescriptor reads it. defineProperty writes it. Missing flags default to false when using defineProperty (unlike literals, which are writable enumerable configurable true)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Property Descriptors works and name the main pitfall.",
      "answerHint": "defineProperty for non-enumerable or read-only fields. Remember defineProperty defaults flags to false. configurable:false is hard to undo. Accessors cannot also have value/writable. Pitfall: Object.defineProperty(o,'x',{value:1}) is not writable — later o.x = 2 fails silently or throws."
    },
    {
      "level": "advanced",
      "question": "How would you explain Property Descriptors at an interview, including engine/spec details?",
      "answerHint": "ValidateAndApplyPropertyDescriptor distinguishes data vs accessor. OrdinaryDefineOwnProperty implements the eight-flag checks. Proxy defineProperty trap can intercept."
    }
  ],
  "pitfalls": [
    "Object.defineProperty(o,'x',{value:1}) is not writable — later o.x = 2 fails silently or throws.",
    "Accessors cannot also have value/writable."
  ],
  "interview": {
    "expectations": [
      "Explain Property Descriptors without mixing it up with a nearby B1.14 — Object Property Model topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ValidateAndApplyPropertyDescriptor distinguishes data vs accessor."
    ],
    "commonQuestions": [
      "What is Property Descriptors?",
      "Why does JavaScript property descriptors behave this way?",
      "What is the classic Property Descriptors interview trap?"
    ],
    "traps": [
      "Object.defineProperty(o,'x',{value:1}) is not writable — later o.x = 2 fails silently or throws."
    ],
    "misconceptions": [
      "The object model needed more than a value: getters, locks, and visibility. Descriptors are the full record."
    ],
    "strongSignals": [
      "Separates Property Descriptors from lookalike APIs and can draw the mental model."
    ]
  }
})
