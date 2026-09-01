import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Object-to-Primitive Conversion",
  "whatIsIt": "ToPrimitive turns an object into a primitive for operators (+, ==, <, Number()). It asks @@toPrimitive if present, else valueOf then toString (or the reverse for a string hint). If the result is still an object, TypeError. Dates historically prefer string hints for +.",
  "whyExists": "Operators are defined on primitives. Objects must nominate a primitive stand-in so + and == can proceed.",
  "mentalModel": "The engine asks the object: ‘Give me a number-ish or string-ish atom.’ First successful primitive wins.",
  "how": [
    "Implement Symbol.toPrimitive when you need one hook for all hints.",
    "Otherwise valueOf for numeric objects, toString for printable ones.",
    "Avoid objects whose valueOf returns another object.",
    "Do not rely on default Object valueOf (returns the object itself) plus toString."
  ],
  "callout": {
    "title": "Watch for",
    "text": "An object with valueOf returning {} falls through to toString; if that also fails, operators throw TypeError.",
    "variant": "warning"
  },
  "example": "const n = {\n  [Symbol.toPrimitive](hint) {\n    console.log('hint', hint);\n    return hint === 'string' ? 'box' : 10;\n  },\n};\nconsole.log(+n, `${n}`, n + 1);\n",
  "exampleCaption": "Symbol.toPrimitive choosing by hint",
  "internals": [
    "OrdinaryToPrimitive order depends on hint: number → valueOf, toString; string → reverse.",
    "hint default is number except for Date (string) and when @@toPrimitive is used with 'default'.",
    "ToPrimitive is invoked from ToNumber/ToString/ToPropertyKey as needed."
  ],
  "takeaways": [
    "Implement Symbol.toPrimitive when you need one hook for all hints.",
    "Otherwise valueOf for numeric objects, toString for printable ones.",
    "An object with valueOf returning {} falls through to toString; if that also fails, operators throw TypeError.",
    "OrdinaryToPrimitive order depends on hint: number → valueOf, toString; string → reverse."
  ],
  "revision": [
    "Object-to-Primitive Conversion: The engine asks the object: ‘Give me a number-ish or string-ish atom.’ First successful primitive wins.",
    "Implement Symbol.toPrimitive when you need one hook for all hints.",
    "Otherwise valueOf for numeric objects, toString for printable ones.",
    "Avoid objects whose valueOf returns another object.",
    "Trap: An object with valueOf returning {} falls through to toString; if that also fails, operators throw TypeError."
  ],
  "flashcards": [
    [
      "Object-to-Primitive Conversion",
      "ToPrimitive turns an object into a primitive for operators (+, ==, <, Number())."
    ],
    [
      "Mental model",
      "The engine asks the object: ‘Give me a number-ish or string-ish atom.’ First successful primitive wins."
    ],
    [
      "Common trap",
      "An object with valueOf returning {} falls through to toString; if that also fails, operators throw TypeError."
    ],
    [
      "Implement Symbol.toPrimitive when you need one hook for all hints.",
      "Otherwise valueOf for numeric objects, toString for printable ones."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Object-to-Primitive Conversion and where does a beginner first see it?",
      "answerHint": "ToPrimitive turns an object into a primitive for operators (+, ==, <, Number()). It asks @@toPrimitive if present, else valueOf then toString (or the reverse for a string hint). If the result is still an object, TypeError. Dates historically prefer string hints for +."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Object-to-Primitive Conversion works and name the main pitfall.",
      "answerHint": "Implement Symbol.toPrimitive when you need one hook for all hints. Otherwise valueOf for numeric objects, toString for printable ones. Avoid objects whose valueOf returns another object. Do not rely on default Object valueOf (returns the object itself) plus toString. Pitfall: An object with valueOf returning {} falls through to toString; if that also fails, operators throw TypeError."
    },
    {
      "level": "advanced",
      "question": "How would you explain Object-to-Primitive Conversion at an interview, including engine/spec details?",
      "answerHint": "OrdinaryToPrimitive order depends on hint: number → valueOf, toString; string → reverse. hint default is number except for Date (string) and when @@toPrimitive is used with 'default'. ToPrimitive is invoked from ToNumber/ToString/ToPropertyKey as needed."
    }
  ],
  "pitfalls": [
    "An object with valueOf returning {} falls through to toString; if that also fails, operators throw TypeError.",
    "Do not rely on default Object valueOf (returns the object itself) plus toString."
  ],
  "interview": {
    "expectations": [
      "Explain Object-to-Primitive Conversion without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OrdinaryToPrimitive order depends on hint: number → valueOf, toString; string → reverse."
    ],
    "commonQuestions": [
      "What is Object-to-Primitive Conversion?",
      "Why does JavaScript object-to-primitive conversion behave this way?",
      "What is the classic Object-to-Primitive Conversion interview trap?"
    ],
    "traps": [
      "An object with valueOf returning {} falls through to toString; if that also fails, operators throw TypeError."
    ],
    "misconceptions": [
      "Operators are defined on primitives. Objects must nominate a primitive stand-in so + and == can proceed."
    ],
    "strongSignals": [
      "Separates Object-to-Primitive Conversion from lookalike APIs and can draw the mental model."
    ]
  }
})
