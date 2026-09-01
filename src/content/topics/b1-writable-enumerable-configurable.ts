import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "writable / enumerable / configurable",
  "whatIsIt": "writable: can [[Set]] change a data value? enumerable: does it show in keys/for...in/spread? configurable: can we delete, change flags, or switch data/accessor? Once configurable is false, you are mostly stuck (writable can still go from true→false on data properties). Accessors use get/set instead of writable.",
  "whyExists": "Three independent knobs cover mutation, visibility, and meta-mutation. Combining them implements freeze/seal.",
  "mentalModel": "writable = edit the value. enumerable = list me. configurable = edit the knobs / delete me.",
  "how": [
    "Public data: all true (literal default).",
    "Hidden: enumerable false.",
    "Constants: writable false, configurable false.",
    "Do not lock configurable until you mean it."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Non-configurable but writable data property: you can still change the value, you just cannot delete it — freeze needs writable false too.",
    "variant": "warning"
  },
  "example": "function dump(o, k) { console.log(k, Object.getOwnPropertyDescriptor(o, k)); }\nconst o = { a: 1 };\ndump(o, 'a');\nObject.defineProperty(o, 'b', { value: 2, writable: true, enumerable: false, configurable: true });\ndump(o, 'b');\nconsole.log(Object.keys(o), o.b);\n",
  "exampleCaption": "Default literal flags vs custom b",
  "internals": [
    "OrdinaryDefineOwnProperty table of allowed changes when configurable is false.",
    "[[Delete]] requires configurable true (or the property not to exist).",
    "Module namespace exports are non-configurable live data-like bindings (exotic)."
  ],
  "takeaways": [
    "Public data: all true (literal default).",
    "Hidden: enumerable false.",
    "Non-configurable but writable data property: you can still change the value, you just cannot delete it — freeze needs writable false too.",
    "OrdinaryDefineOwnProperty table of allowed changes when configurable is false."
  ],
  "revision": [
    "writable / enumerable / configurable: writable = edit the value. enumerable = list me. configurable = edit the knobs / delete me.",
    "Public data: all true (literal default).",
    "Hidden: enumerable false.",
    "Constants: writable false, configurable false.",
    "Trap: Non-configurable but writable data property: you can still change the value, you just cannot delete it — freeze needs writable false too."
  ],
  "flashcards": [
    [
      "writable / enumerable / configurable",
      "writable: can [[Set]] change a data value? enumerable: does it show in keys/for...in/spread? configurable: can we delete, change flags, or switch data/accessor? Once configurable is false, you are mostly stuck (writable can still go from true→false on data properties)."
    ],
    [
      "Mental model",
      "writable = edit the value. enumerable = list me. configurable = edit the knobs / delete me."
    ],
    [
      "Common trap",
      "Non-configurable but writable data property: you can still change the value, you just cannot delete it — freeze needs writable false too."
    ],
    [
      "Public data: all true (literal default).",
      "Hidden: enumerable false."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is writable / enumerable / configurable and where does a beginner first see it?",
      "answerHint": "writable: can [[Set]] change a data value? enumerable: does it show in keys/for...in/spread? configurable: can we delete, change flags, or switch data/accessor? Once configurable is false, you are mostly stuck (writable can still go from true→false on data properties). Accessors use get/set instead of writable."
    },
    {
      "level": "intermediate",
      "question": "Walk through how writable / enumerable / configurable works and name the main pitfall.",
      "answerHint": "Public data: all true (literal default). Hidden: enumerable false. Constants: writable false, configurable false. Do not lock configurable until you mean it. Pitfall: Non-configurable but writable data property: you can still change the value, you just cannot delete it — freeze needs writable false too."
    },
    {
      "level": "advanced",
      "question": "How would you explain writable / enumerable / configurable at an interview, including engine/spec details?",
      "answerHint": "OrdinaryDefineOwnProperty table of allowed changes when configurable is false. [[Delete]] requires configurable true (or the property not to exist). Module namespace exports are non-configurable live data-like bindings (exotic)."
    }
  ],
  "pitfalls": [
    "Non-configurable but writable data property: you can still change the value, you just cannot delete it — freeze needs writable false too.",
    "Do not lock configurable until you mean it."
  ],
  "interview": {
    "expectations": [
      "Explain writable / enumerable / configurable without mixing it up with a nearby B1.14 — Object Property Model topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OrdinaryDefineOwnProperty table of allowed changes when configurable is false."
    ],
    "commonQuestions": [
      "What is writable / enumerable / configurable?",
      "Why does JavaScript writable / enumerable / configurable behave this way?",
      "What is the classic writable / enumerable / configurable interview trap?"
    ],
    "traps": [
      "Non-configurable but writable data property: you can still change the value, you just cannot delete it — freeze needs writable false too."
    ],
    "misconceptions": [
      "Three independent knobs cover mutation, visibility, and meta-mutation. Combining them implements freeze/seal."
    ],
    "strongSignals": [
      "Separates writable / enumerable / configurable from lookalike APIs and can draw the mental model."
    ]
  }
})
