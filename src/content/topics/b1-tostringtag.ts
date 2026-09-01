import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Symbol.toStringTag",
  "whatIsIt": "Symbol.toStringTag is a well-known symbol whose string value Object.prototype.toString reads to build '[object Tag]'. Built-ins set it (Map → 'Map'). You can set it on your objects for better debugging tags. It is not a security boundary — anyone can fake a tag.",
  "whyExists": "typeof is too coarse. DevTools and old duck-typing used Object.prototype.toString.call(x) to distinguish Map vs Object vs Date.",
  "mentalModel": "A name badge toString looks at when you call the default Object.prototype.toString, not when you JSON.stringify.",
  "how": [
    "Inspect with Object.prototype.toString.call(value).",
    "Set [Symbol.toStringTag]: 'MyType' on a prototype.",
    "Do not use the tag as an auth or integrity check.",
    "Prefer instanceof / Array.isArray / brand checks for logic."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Trusting '[object User]' from toString as proof of type — it is forgeable.",
    "variant": "warning"
  },
  "example": "const box = {\n  [Symbol.toStringTag]: 'Box',\n};\nconsole.log(Object.prototype.toString.call(box));\nconsole.log(Object.prototype.toString.call(new Map()));\nconsole.log(Object.prototype.toString.call([]));\nconsole.log(Object.prototype.toString.call(async function () {}));\n",
  "exampleCaption": "Custom and built-in toString tags",
  "internals": [
    "Object.prototype.toString uses @@toStringTag if present and is a string.",
    "Built-ins have default tags even without an own property in some cases (spec tables).",
    "Proxy can trap get for @@toStringTag and lie."
  ],
  "takeaways": [
    "Inspect with Object.prototype.toString.call(value).",
    "Set [Symbol.toStringTag]: 'MyType' on a prototype.",
    "Trusting '[object User]' from toString as proof of type — it is forgeable.",
    "Object.prototype.toString uses @@toStringTag if present and is a string."
  ],
  "revision": [
    "Symbol.toStringTag: A name badge toString looks at when you call the default Object.prototype.toString, not when you JSON.stringify.",
    "Inspect with Object.prototype.toString.call(value).",
    "Set [Symbol.toStringTag]: 'MyType' on a prototype.",
    "Do not use the tag as an auth or integrity check.",
    "Trap: Trusting '[object User]' from toString as proof of type — it is forgeable."
  ],
  "flashcards": [
    [
      "Symbol.toStringTag",
      "Symbol.toStringTag is a well-known symbol whose string value Object.prototype.toString reads to build '[object Tag]'."
    ],
    [
      "Mental model",
      "A name badge toString looks at when you call the default Object.prototype.toString, not when you JSON.stringify."
    ],
    [
      "Common trap",
      "Trusting '[object User]' from toString as proof of type — it is forgeable."
    ],
    [
      "Inspect with Object.prototype.toString.call(value).",
      "Set [Symbol.toStringTag]: 'MyType' on a prototype."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Symbol.toStringTag and where does a beginner first see it?",
      "answerHint": "Symbol.toStringTag is a well-known symbol whose string value Object.prototype.toString reads to build '[object Tag]'. Built-ins set it (Map → 'Map'). You can set it on your objects for better debugging tags. It is not a security boundary — anyone can fake a tag."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Symbol.toStringTag works and name the main pitfall.",
      "answerHint": "Inspect with Object.prototype.toString.call(value). Set [Symbol.toStringTag]: 'MyType' on a prototype. Do not use the tag as an auth or integrity check. Prefer instanceof / Array.isArray / brand checks for logic. Pitfall: Trusting '[object User]' from toString as proof of type — it is forgeable."
    },
    {
      "level": "advanced",
      "question": "How would you explain Symbol.toStringTag at an interview, including engine/spec details?",
      "answerHint": "Object.prototype.toString uses @@toStringTag if present and is a string. Built-ins have default tags even without an own property in some cases (spec tables). Proxy can trap get for @@toStringTag and lie."
    }
  ],
  "pitfalls": [
    "Trusting '[object User]' from toString as proof of type — it is forgeable.",
    "Prefer instanceof / Array.isArray / brand checks for logic."
  ],
  "interview": {
    "expectations": [
      "Explain Symbol.toStringTag without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Object.prototype.toString uses @@toStringTag if present and is a string."
    ],
    "commonQuestions": [
      "What is Symbol.toStringTag?",
      "Why does JavaScript symbol.tostringtag behave this way?",
      "What is the classic Symbol.toStringTag interview trap?"
    ],
    "traps": [
      "Trusting '[object User]' from toString as proof of type — it is forgeable."
    ],
    "misconceptions": [
      "typeof is too coarse. DevTools and old duck-typing used Object.prototype.toString.call(x) to distinguish Map vs Object vs Date."
    ],
    "strongSignals": [
      "Separates Symbol.toStringTag from lookalike APIs and can draw the mental model."
    ]
  }
})
