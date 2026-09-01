import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Property Lookup & Shadowing",
  "whatIsIt": "Lookup: start at the object, if own descriptor exists, use it (data or getter). Else go to [[Prototype]]. If a setter exists on the chain and you assign, that setter may run instead of shadowing (accessor on proto). Shadowing with an own data property hides proto getters too.",
  "whyExists": "Understanding get vs set on the chain explains ‘why did my assignment not change the prototype field?’ and ‘why did a setter fire?’",
  "mentalModel": "Read: walk until you find it. Write: usually plant an own property, unless a setter on the way intercepts.",
  "how": [
    "Own data shadows everything above for that key.",
    "delete own to reveal proto again.",
    "Watch prototype accessors — assignment can call them.",
    "hasOwn tells you if lookup would stop immediately."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assigning to an inherited data property creates an own property; it does not mutate the prototype’s value.",
    "variant": "warning"
  },
  "example": "const proto = {\n  get x() { return 1; },\n  set x(v) { this._x = v; },\n};\nconst o = Object.create(proto);\nconsole.log(o.x);\no.x = 5;\nconsole.log(o._x, Object.hasOwn(o, 'x'), o.x);\n",
  "exampleCaption": "Prototype setter writes _x on the instance",
  "internals": [
    "OrdinarySetWithOwnDescriptor vs walking for setters.",
    "GetOwnProperty is per object; HasProperty walks.",
    "Proxy get/set traps sit in front of this algorithm."
  ],
  "takeaways": [
    "Own data shadows everything above for that key.",
    "delete own to reveal proto again.",
    "Assigning to an inherited data property creates an own property; it does not mutate the prototype’s value.",
    "OrdinarySetWithOwnDescriptor vs walking for setters."
  ],
  "revision": [
    "Property Lookup & Shadowing: Read: walk until you find it. Write: usually plant an own property, unless a setter on the way intercepts.",
    "Own data shadows everything above for that key.",
    "delete own to reveal proto again.",
    "Watch prototype accessors — assignment can call them.",
    "Trap: Assigning to an inherited data property creates an own property; it does not mutate the prototype’s value."
  ],
  "flashcards": [
    [
      "Property Lookup & Shadowing",
      "Lookup: start at the object, if own descriptor exists, use it (data or getter)."
    ],
    [
      "Mental model",
      "Read: walk until you find it. Write: usually plant an own property, unless a setter on the way intercepts."
    ],
    [
      "Common trap",
      "Assigning to an inherited data property creates an own property; it does not mutate the prototype’s value."
    ],
    [
      "Own data shadows everything above for that key.",
      "delete own to reveal proto again."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Property Lookup & Shadowing and where does a beginner first see it?",
      "answerHint": "Lookup: start at the object, if own descriptor exists, use it (data or getter). Else go to [[Prototype]]. If a setter exists on the chain and you assign, that setter may run instead of shadowing (accessor on proto). Shadowing with an own data property hides proto getters too."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Property Lookup & Shadowing works and name the main pitfall.",
      "answerHint": "Own data shadows everything above for that key. delete own to reveal proto again. Watch prototype accessors — assignment can call them. hasOwn tells you if lookup would stop immediately. Pitfall: Assigning to an inherited data property creates an own property; it does not mutate the prototype’s value."
    },
    {
      "level": "advanced",
      "question": "How would you explain Property Lookup & Shadowing at an interview, including engine/spec details?",
      "answerHint": "OrdinarySetWithOwnDescriptor vs walking for setters. GetOwnProperty is per object; HasProperty walks. Proxy get/set traps sit in front of this algorithm."
    }
  ],
  "pitfalls": [
    "Assigning to an inherited data property creates an own property; it does not mutate the prototype’s value.",
    "hasOwn tells you if lookup would stop immediately."
  ],
  "interview": {
    "expectations": [
      "Explain Property Lookup & Shadowing without mixing it up with a nearby B1.16 — Prototypes & Prototype Chain topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OrdinarySetWithOwnDescriptor vs walking for setters."
    ],
    "commonQuestions": [
      "What is Property Lookup & Shadowing?",
      "Why does JavaScript property lookup & shadowing behave this way?",
      "What is the classic Property Lookup & Shadowing interview trap?"
    ],
    "traps": [
      "Assigning to an inherited data property creates an own property; it does not mutate the prototype’s value."
    ],
    "misconceptions": [
      "Understanding get vs set on the chain explains ‘why did my assignment not change the prototype field?’ and ‘why did a setter fire?’"
    ],
    "strongSignals": [
      "Separates Property Lookup & Shadowing from lookalike APIs and can draw the mental model."
    ]
  }
})
