import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "String()",
  "whatIsIt": "String(x) (and template interpolation) convert using ToString: null becomes 'null', undefined 'undefined', numbers use decimal, objects go through ToPrimitive then ToString. String(obj) is not JSON. new String(x) boxes a string object — avoid it.",
  "whyExists": "Printing, hashing keys, and concatenation all need a text form. A single ToString algorithm keeps those consistent.",
  "mentalModel": "Every value can be asked ‘what is your label?’ That label is a primitive string, not a clone of the object.",
  "how": [
    "Use String(x) or `${x}` for labels and logs.",
    "Use JSON.stringify when you need structure.",
    "Do not rely on Array toString (join with commas) for serialization.",
    "Symbol throws in String() when used in templates without explicit String(sym)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "String({}) is '[object Object]' — it looks like a useful dump and is not.",
    "variant": "warning"
  },
  "example": "console.log(String(null), String(undefined), String(10));\nconsole.log(String([1, 2]), String({ a: 1 }));\nconsole.log(String(true), String(1n));\ntry { `${Symbol('k')}`; } catch (e) { console.log(e.name); }\nconsole.log(String(Symbol('k')));\n",
  "exampleCaption": "ToString of primitives, arrays, objects, symbols",
  "internals": [
    "OrdinaryToPrimitive hint string prefers toString then valueOf.",
    "Array.prototype.toString is join, which recursively ToString elements.",
    "Symbols throw in ToString unless they go through String() explicitly in some paths; templates throw."
  ],
  "takeaways": [
    "Use String(x) or `${x}` for labels and logs.",
    "Use JSON.stringify when you need structure.",
    "String({}) is '[object Object]' — it looks like a useful dump and is not.",
    "OrdinaryToPrimitive hint string prefers toString then valueOf."
  ],
  "revision": [
    "String(): Every value can be asked ‘what is your label?’ That label is a primitive string, not a clone of the object.",
    "Use String(x) or `${x}` for labels and logs.",
    "Use JSON.stringify when you need structure.",
    "Do not rely on Array toString (join with commas) for serialization.",
    "Trap: String({}) is '[object Object]' — it looks like a useful dump and is not."
  ],
  "flashcards": [
    [
      "String()",
      "String(x) (and template interpolation) convert using ToString: null becomes 'null', undefined 'undefined', numbers use decimal, objects go through ToPrimitive then ToString."
    ],
    [
      "Mental model",
      "Every value can be asked ‘what is your label?’ That label is a primitive string, not a clone of the object."
    ],
    [
      "Common trap",
      "String({}) is '[object Object]' — it looks like a useful dump and is not."
    ],
    [
      "Use String(x) or `${x}` for labels and logs.",
      "Use JSON.stringify when you need structure."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is String() and where does a beginner first see it?",
      "answerHint": "String(x) (and template interpolation) convert using ToString: null becomes 'null', undefined 'undefined', numbers use decimal, objects go through ToPrimitive then ToString. String(obj) is not JSON. new String(x) boxes a string object — avoid it."
    },
    {
      "level": "intermediate",
      "question": "Walk through how String() works and name the main pitfall.",
      "answerHint": "Use String(x) or `${x}` for labels and logs. Use JSON.stringify when you need structure. Do not rely on Array toString (join with commas) for serialization. Symbol throws in String() when used in templates without explicit String(sym). Pitfall: String({}) is '[object Object]' — it looks like a useful dump and is not."
    },
    {
      "level": "advanced",
      "question": "How would you explain String() at an interview, including engine/spec details?",
      "answerHint": "OrdinaryToPrimitive hint string prefers toString then valueOf. Array.prototype.toString is join, which recursively ToString elements. Symbols throw in ToString unless they go through String() explicitly in some paths; templates throw."
    }
  ],
  "pitfalls": [
    "String({}) is '[object Object]' — it looks like a useful dump and is not.",
    "Symbol throws in String() when used in templates without explicit String(sym)."
  ],
  "interview": {
    "expectations": [
      "Explain String() without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OrdinaryToPrimitive hint string prefers toString then valueOf."
    ],
    "commonQuestions": [
      "What is String()?",
      "Why does JavaScript string() behave this way?",
      "What is the classic String() interview trap?"
    ],
    "traps": [
      "String({}) is '[object Object]' — it looks like a useful dump and is not."
    ],
    "misconceptions": [
      "Printing, hashing keys, and concatenation all need a text form. A single ToString algorithm keeps those consistent."
    ],
    "strongSignals": [
      "Separates String() from lookalike APIs and can draw the mental model."
    ]
  }
})
