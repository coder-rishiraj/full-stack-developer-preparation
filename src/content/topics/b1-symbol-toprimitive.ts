import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Symbol.toPrimitive",
  "whatIsIt": "Symbol.toPrimitive is a method (hint) => primitive that overrides valueOf/toString for ToPrimitive. hint is 'number', 'string', or 'default'. Returning a non-primitive throws. This is the cleanest way to make an object work with +, ==, and templates predictably.",
  "whyExists": "valueOf vs toString order was easy to get wrong. One well-known symbol gives libraries a single conversion hook.",
  "mentalModel": "A custom receptionist who reads the hint on the visitor badge and hands out a number or a string.",
  "how": [
    "Implement one [Symbol.toPrimitive](hint) on the prototype.",
    "Switch on hint; default can match number or string as you design.",
    "Always return a primitive.",
    "Keep it pure — operators may call it more than once."
  ],
  "callout": {
    "title": "Watch for",
    "text": "== will still coerce; money == '$1.99' may not do what String(money) suggests depending on hint.",
    "variant": "warning"
  },
  "example": "const money = {\n  cents: 199,\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'string') return '$' + (this.cents / 100).toFixed(2);\n    return this.cents;\n  },\n};\nconsole.log(+money, String(money), money + 1);\nconsole.log(money == 199, money === 199);\n",
  "exampleCaption": "One toPrimitive hook for money",
  "internals": [
    "GetMethod(O, @@toPrimitive) then Call with hint.",
    "If the result is an Object, throw TypeError.",
    "Presence of @@toPrimitive skips OrdinaryToPrimitive entirely."
  ],
  "takeaways": [
    "Implement one [Symbol.toPrimitive](hint) on the prototype.",
    "Switch on hint; default can match number or string as you design.",
    "== will still coerce; money == '$1.99' may not do what String(money) suggests depending on hint.",
    "GetMethod(O, @@toPrimitive) then Call with hint."
  ],
  "revision": [
    "Symbol.toPrimitive: A custom receptionist who reads the hint on the visitor badge and hands out a number or a string.",
    "Implement one [Symbol.toPrimitive](hint) on the prototype.",
    "Switch on hint; default can match number or string as you design.",
    "Always return a primitive.",
    "Trap: == will still coerce; money == '$1.99' may not do what String(money) suggests depending on hint."
  ],
  "flashcards": [
    [
      "Symbol.toPrimitive",
      "Symbol.toPrimitive is a method (hint) => primitive that overrides valueOf/toString for ToPrimitive."
    ],
    [
      "Mental model",
      "A custom receptionist who reads the hint on the visitor badge and hands out a number or a string."
    ],
    [
      "Common trap",
      "== will still coerce; money == '$1.99' may not do what String(money) suggests depending on hint."
    ],
    [
      "Implement one [Symbol.toPrimitive](hint) on the prototype.",
      "Switch on hint; default can match number or string as you design."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Symbol.toPrimitive and where does a beginner first see it?",
      "answerHint": "Symbol.toPrimitive is a method (hint) => primitive that overrides valueOf/toString for ToPrimitive. hint is 'number', 'string', or 'default'. Returning a non-primitive throws. This is the cleanest way to make an object work with +, ==, and templates predictably."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Symbol.toPrimitive works and name the main pitfall.",
      "answerHint": "Implement one [Symbol.toPrimitive](hint) on the prototype. Switch on hint; default can match number or string as you design. Always return a primitive. Keep it pure — operators may call it more than once. Pitfall: == will still coerce; money == '$1.99' may not do what String(money) suggests depending on hint."
    },
    {
      "level": "advanced",
      "question": "How would you explain Symbol.toPrimitive at an interview, including engine/spec details?",
      "answerHint": "GetMethod(O, @@toPrimitive) then Call with hint. If the result is an Object, throw TypeError. Presence of @@toPrimitive skips OrdinaryToPrimitive entirely."
    }
  ],
  "pitfalls": [
    "== will still coerce; money == '$1.99' may not do what String(money) suggests depending on hint.",
    "Keep it pure — operators may call it more than once."
  ],
  "interview": {
    "expectations": [
      "Explain Symbol.toPrimitive without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "GetMethod(O, @@toPrimitive) then Call with hint."
    ],
    "commonQuestions": [
      "What is Symbol.toPrimitive?",
      "Why does JavaScript symbol.toprimitive behave this way?",
      "What is the classic Symbol.toPrimitive interview trap?"
    ],
    "traps": [
      "== will still coerce; money == '$1.99' may not do what String(money) suggests depending on hint."
    ],
    "misconceptions": [
      "valueOf vs toString order was easy to get wrong. One well-known symbol gives libraries a single conversion hook."
    ],
    "strongSignals": [
      "Separates Symbol.toPrimitive from lookalike APIs and can draw the mental model."
    ]
  }
})
