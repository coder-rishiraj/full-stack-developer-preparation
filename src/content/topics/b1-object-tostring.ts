import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "toString()",
  "whatIsIt": "Object.prototype.toString produces '[object Type]' using @@toStringTag. Instance toString overrides (Array join, Function source, Date locale) run instead when you String(obj) or concat. You usually override toString for readable logs, not for the [object Object] tag.",
  "whyExists": "Debugging and concatenation needed a fallback text for objects. Arrays chose join; generic objects chose the tag.",
  "mentalModel": "If + wants a string and valueOf failed, toString is the next doorbell.",
  "how": [
    "Override toString to return a primitive string.",
    "Use Object.prototype.toString.call for the tag.",
    "Do not parse '[object Object]' as useful data.",
    "Functions’ toString may reveal source; do not use it as a security check."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Logging an object with a throwing toString crashes DevTools formatters and template literals.",
    "variant": "warning"
  },
  "example": "const user = {\n  name: 'Ada',\n  toString() { return this.name; },\n};\nconsole.log('hi ' + user);\nconsole.log(Object.prototype.toString.call(user));\nconsole.log([1, 2].toString());\nconsole.log((function add(a, b) { return a + b; }).toString().includes('return'));\n",
  "exampleCaption": "Custom toString vs default tag vs Array join",
  "internals": [
    "ToString on objects is ToPrimitive(string) then ToString of that primitive.",
    "Array.prototype.toString is join with comma, recursive.",
    "Function toString is implementation-defined source or native code placeholder."
  ],
  "takeaways": [
    "Override toString to return a primitive string.",
    "Use Object.prototype.toString.call for the tag.",
    "Logging an object with a throwing toString crashes DevTools formatters and template literals.",
    "ToString on objects is ToPrimitive(string) then ToString of that primitive."
  ],
  "revision": [
    "toString(): If + wants a string and valueOf failed, toString is the next doorbell.",
    "Override toString to return a primitive string.",
    "Use Object.prototype.toString.call for the tag.",
    "Do not parse '[object Object]' as useful data.",
    "Trap: Logging an object with a throwing toString crashes DevTools formatters and template literals."
  ],
  "flashcards": [
    [
      "toString()",
      "Object.prototype.toString produces '[object Type]' using @@toStringTag."
    ],
    [
      "Mental model",
      "If + wants a string and valueOf failed, toString is the next doorbell."
    ],
    [
      "Common trap",
      "Logging an object with a throwing toString crashes DevTools formatters and template literals."
    ],
    [
      "Override toString to return a primitive string.",
      "Use Object.prototype.toString.call for the tag."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is toString() and where does a beginner first see it?",
      "answerHint": "Object.prototype.toString produces '[object Type]' using @@toStringTag. Instance toString overrides (Array join, Function source, Date locale) run instead when you String(obj) or concat. You usually override toString for readable logs, not for the [object Object] tag."
    },
    {
      "level": "intermediate",
      "question": "Walk through how toString() works and name the main pitfall.",
      "answerHint": "Override toString to return a primitive string. Use Object.prototype.toString.call for the tag. Do not parse '[object Object]' as useful data. Functions’ toString may reveal source; do not use it as a security check. Pitfall: Logging an object with a throwing toString crashes DevTools formatters and template literals."
    },
    {
      "level": "advanced",
      "question": "How would you explain toString() at an interview, including engine/spec details?",
      "answerHint": "ToString on objects is ToPrimitive(string) then ToString of that primitive. Array.prototype.toString is join with comma, recursive. Function toString is implementation-defined source or native code placeholder."
    }
  ],
  "pitfalls": [
    "Logging an object with a throwing toString crashes DevTools formatters and template literals.",
    "Functions’ toString may reveal source; do not use it as a security check."
  ],
  "interview": {
    "expectations": [
      "Explain toString() without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ToString on objects is ToPrimitive(string) then ToString of that primitive."
    ],
    "commonQuestions": [
      "What is toString()?",
      "Why does JavaScript tostring() behave this way?",
      "What is the classic toString() interview trap?"
    ],
    "traps": [
      "Logging an object with a throwing toString crashes DevTools formatters and template literals."
    ],
    "misconceptions": [
      "Debugging and concatenation needed a fallback text for objects. Arrays chose join; generic objects chose the tag."
    ],
    "strongSignals": [
      "Separates toString() from lookalike APIs and can draw the mental model."
    ]
  }
})
