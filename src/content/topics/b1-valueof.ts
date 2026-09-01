import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "valueOf()",
  "whatIsIt": "valueOf is a method objects can provide to suggest a primitive, usually a number. Built-ins: Date.valueOf is timestamp, Number objects unwrap. Object.prototype.valueOf returns the object itself, which is useless for ToPrimitive until toString runs. Unary plus and numeric comparisons prefer valueOf when the hint is number.",
  "whyExists": "Boxed numbers and dates needed to participate in arithmetic without calling extra APIs.",
  "mentalModel": "‘If you need a number from me, here it is.’ If I hand back another object, the engine keeps asking.",
  "how": [
    "Return a primitive from valueOf.",
    "Prefer Symbol.toPrimitive in new code for clarity.",
    "Do not use valueOf for formatted display — that is toString.",
    "Remember JSON.stringify does not call valueOf (it uses toJSON/toString rules)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Expecting JSON.stringify to use valueOf — it will not, so you get {} or toJSON instead.",
    "variant": "warning"
  },
  "example": "const counter = {\n  n: 3,\n  valueOf() { return this.n; },\n  toString() { return '#' + this.n; },\n};\nconsole.log(+counter, String(counter), counter + 1);\nconsole.log(Object.prototype.valueOf.call(counter) === counter);\n",
  "exampleCaption": "valueOf for math vs toString for display",
  "internals": [
    "OrdinaryToPrimitive Get(O, 'valueOf') and Call if callable.",
    "Date.prototype[@@toPrimitive] customizes hint default.",
    "valueOf on primitives via autoboxing returns the primitive data."
  ],
  "takeaways": [
    "Return a primitive from valueOf.",
    "Prefer Symbol.toPrimitive in new code for clarity.",
    "Expecting JSON.stringify to use valueOf — it will not, so you get {} or toJSON instead.",
    "OrdinaryToPrimitive Get(O, 'valueOf') and Call if callable."
  ],
  "revision": [
    "valueOf(): ‘If you need a number from me, here it is.’ If I hand back another object, the engine keeps asking.",
    "Return a primitive from valueOf.",
    "Prefer Symbol.toPrimitive in new code for clarity.",
    "Do not use valueOf for formatted display — that is toString.",
    "Trap: Expecting JSON.stringify to use valueOf — it will not, so you get {} or toJSON instead."
  ],
  "flashcards": [
    [
      "valueOf()",
      "valueOf is a method objects can provide to suggest a primitive, usually a number."
    ],
    [
      "Mental model",
      "‘If you need a number from me, here it is.’ If I hand back another object, the engine keeps asking."
    ],
    [
      "Common trap",
      "Expecting JSON.stringify to use valueOf — it will not, so you get {} or toJSON instead."
    ],
    [
      "Return a primitive from valueOf.",
      "Prefer Symbol.toPrimitive in new code for clarity."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is valueOf() and where does a beginner first see it?",
      "answerHint": "valueOf is a method objects can provide to suggest a primitive, usually a number. Built-ins: Date.valueOf is timestamp, Number objects unwrap. Object.prototype.valueOf returns the object itself, which is useless for ToPrimitive until toString runs. Unary plus and numeric comparisons prefer valueOf when the hint is number."
    },
    {
      "level": "intermediate",
      "question": "Walk through how valueOf() works and name the main pitfall.",
      "answerHint": "Return a primitive from valueOf. Prefer Symbol.toPrimitive in new code for clarity. Do not use valueOf for formatted display — that is toString. Remember JSON.stringify does not call valueOf (it uses toJSON/toString rules). Pitfall: Expecting JSON.stringify to use valueOf — it will not, so you get {} or toJSON instead."
    },
    {
      "level": "advanced",
      "question": "How would you explain valueOf() at an interview, including engine/spec details?",
      "answerHint": "OrdinaryToPrimitive Get(O, 'valueOf') and Call if callable. Date.prototype[@@toPrimitive] customizes hint default. valueOf on primitives via autoboxing returns the primitive data."
    }
  ],
  "pitfalls": [
    "Expecting JSON.stringify to use valueOf — it will not, so you get {} or toJSON instead.",
    "Remember JSON.stringify does not call valueOf (it uses toJSON/toString rules)."
  ],
  "interview": {
    "expectations": [
      "Explain valueOf() without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OrdinaryToPrimitive Get(O, 'valueOf') and Call if callable."
    ],
    "commonQuestions": [
      "What is valueOf()?",
      "Why does JavaScript valueof() behave this way?",
      "What is the classic valueOf() interview trap?"
    ],
    "traps": [
      "Expecting JSON.stringify to use valueOf — it will not, so you get {} or toJSON instead."
    ],
    "misconceptions": [
      "Boxed numbers and dates needed to participate in arithmetic without calling extra APIs."
    ],
    "strongSignals": [
      "Separates valueOf() from lookalike APIs and can draw the mental model."
    ]
  }
})
