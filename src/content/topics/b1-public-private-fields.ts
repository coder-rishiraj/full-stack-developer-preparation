import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Public / Private Fields",
  "whatIsIt": "Public fields (n = 1) install own properties on each instance after construction (after super in subclasses). Private fields (#n) are accessed only inside the class body; they are not props you can obj['#n']. Each class has its own private names. They are not inherited as accessible #n in subclasses without their own declaration.",
  "whyExists": "Closures hid privates per instance with extra functions. #fields keep methods on the prototype while hiding state.",
  "mentalModel": "Public fields: own properties. #fields: a side table keyed by the instance, only the class’s code has the key.",
  "how": [
    "Use # for secrets; public fields for data.",
    "Do not try to reflect # with Object.keys — they will not appear.",
    "Check with #n in obj inside the class.",
    "Avoid arrow class fields if you need the method on the prototype (they bind per instance)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.stringify and spread skip private fields — clones lose secrets (good) and also cannot copy them even if you wanted to.",
    "variant": "warning"
  },
  "example": "class Vault {\n  #pin = '0000';\n  publicNote = 'ok';\n  check(pin) { return pin === this.#pin; }\n  static hasPin(v) { return #pin in v; }\n}\nconst v = new Vault();\nconsole.log(v.publicNote, v.check('0000'), v.check('1'));\nconsole.log(Object.keys(v), Vault.hasPin(v));\n",
  "exampleCaption": "Private #pin vs public field; in-check",
  "internals": [
    "Private identifiers are unique per class evaluation (Private Name records).",
    "PrivateBrandCheck throws TypeError if the instance lacks the brand.",
    "Public fields: DefineField after construction."
  ],
  "takeaways": [
    "Use # for secrets; public fields for data.",
    "Do not try to reflect # with Object.keys — they will not appear.",
    "JSON.stringify and spread skip private fields — clones lose secrets (good) and also cannot copy them even if you wanted to.",
    "Private identifiers are unique per class evaluation (Private Name records)."
  ],
  "revision": [
    "Public / Private Fields: Public fields: own properties. #fields: a side table keyed by the instance, only the class’s code has the key.",
    "Use # for secrets; public fields for data.",
    "Do not try to reflect # with Object.keys — they will not appear.",
    "Check with #n in obj inside the class.",
    "Trap: JSON.stringify and spread skip private fields — clones lose secrets (good) and also cannot copy them even if you wanted to."
  ],
  "flashcards": [
    [
      "Public / Private Fields",
      "Public fields (n = 1) install own properties on each instance after construction (after super in subclasses)."
    ],
    [
      "Mental model",
      "Public fields: own properties. #fields: a side table keyed by the instance, only the class’s code has the key."
    ],
    [
      "Common trap",
      "JSON.stringify and spread skip private fields — clones lose secrets (good) and also cannot copy them even if you wanted to."
    ],
    [
      "Use # for secrets; public fields for data.",
      "Do not try to reflect # with Object.keys — they will not appear."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Public / Private Fields and where does a beginner first see it?",
      "answerHint": "Public fields (n = 1) install own properties on each instance after construction (after super in subclasses). Private fields (#n) are accessed only inside the class body; they are not props you can obj['#n']. Each class has its own private names. They are not inherited as accessible #n in subclasses without their own declaration."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Public / Private Fields works and name the main pitfall.",
      "answerHint": "Use # for secrets; public fields for data. Do not try to reflect # with Object.keys — they will not appear. Check with #n in obj inside the class. Avoid arrow class fields if you need the method on the prototype (they bind per instance). Pitfall: JSON.stringify and spread skip private fields — clones lose secrets (good) and also cannot copy them even if you wanted to."
    },
    {
      "level": "advanced",
      "question": "How would you explain Public / Private Fields at an interview, including engine/spec details?",
      "answerHint": "Private identifiers are unique per class evaluation (Private Name records). PrivateBrandCheck throws TypeError if the instance lacks the brand. Public fields: DefineField after construction."
    }
  ],
  "pitfalls": [
    "JSON.stringify and spread skip private fields — clones lose secrets (good) and also cannot copy them even if you wanted to.",
    "Avoid arrow class fields if you need the method on the prototype (they bind per instance)."
  ],
  "interview": {
    "expectations": [
      "Explain Public / Private Fields without mixing it up with a nearby B1.17 — Classes & OOP topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Private identifiers are unique per class evaluation (Private Name records)."
    ],
    "commonQuestions": [
      "What is Public / Private Fields?",
      "Why does JavaScript public / private fields behave this way?",
      "What is the classic Public / Private Fields interview trap?"
    ],
    "traps": [
      "JSON.stringify and spread skip private fields — clones lose secrets (good) and also cannot copy them even if you wanted to."
    ],
    "misconceptions": [
      "Closures hid privates per instance with extra functions. #fields keep methods on the prototype while hiding state."
    ],
    "strongSignals": [
      "Separates Public / Private Fields from lookalike APIs and can draw the mental model."
    ]
  }
})
