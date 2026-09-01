import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Symbol.iterator",
  "whatIsIt": "Symbol.iterator is the well-known symbol key for the method that returns an iterator. Array.prototype[Symbol.iterator] is the same as .values(). Objects are not iterable by default — spreading {} throws. You add [Symbol.iterator] to make a type work with for-of.",
  "whyExists": "A unique key that cannot collide with a user method named iterator. Well-known symbols are the protocol hooks.",
  "mentalModel": "The official doorbell labeled ‘please give me a cursor.’",
  "how": [
    "obj[Symbol.iterator] = function* () { ... }.",
    "Do not stringify this key — JSON drops it.",
    "Array.from uses this protocol when present.",
    "querySelectorAll lists are iterable in modern browsers."
  ],
  "callout": {
    "title": "Watch for",
    "text": "{...obj} object spread does NOT use Symbol.iterator — it copies properties. [...obj] does.",
    "variant": "warning"
  },
  "example": "const range = {\n  from: 1,\n  to: 3,\n  [Symbol.iterator]: function* () {\n    for (let i = this.from; i <= this.to; i++) yield i;\n  },\n};\nconsole.log([...range]);\ntry { console.log([...{ a: 1 }]); } catch (e) { console.log(e.name); }\nconsole.log(typeof [][Symbol.iterator]);\n",
  "exampleCaption": "Custom @@iterator vs plain object spread error",
  "internals": [
    "GetMethod(obj, @@iterator).",
    "Array spread vs object spread are different operations.",
    "The symbol is the same per realm as other well-known symbols."
  ],
  "takeaways": [
    "obj[Symbol.iterator] = function* () { ... }.",
    "Do not stringify this key — JSON drops it.",
    "{...obj} object spread does NOT use Symbol.iterator — it copies properties. [...obj] does.",
    "GetMethod(obj, @@iterator)."
  ],
  "revision": [
    "Symbol.iterator: The official doorbell labeled ‘please give me a cursor.’",
    "obj[Symbol.iterator] = function* () { ... }.",
    "Do not stringify this key — JSON drops it.",
    "Array.from uses this protocol when present.",
    "Trap: {...obj} object spread does NOT use Symbol.iterator — it copies properties. [...obj] does."
  ],
  "flashcards": [
    [
      "Symbol.iterator",
      "Symbol.iterator is the well-known symbol key for the method that returns an iterator."
    ],
    [
      "Mental model",
      "The official doorbell labeled ‘please give me a cursor.’"
    ],
    [
      "Common trap",
      "{...obj} object spread does NOT use Symbol.iterator — it copies properties. [...obj] does."
    ],
    [
      "obj[Symbol.iterator] = function* () { ... }.",
      "Do not stringify this key — JSON drops it."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Symbol.iterator and where does a beginner first see it?",
      "answerHint": "Symbol.iterator is the well-known symbol key for the method that returns an iterator. Array.prototype[Symbol.iterator] is the same as .values(). Objects are not iterable by default — spreading {} throws. You add [Symbol.iterator] to make a type work with for-of."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Symbol.iterator works and name the main pitfall.",
      "answerHint": "obj[Symbol.iterator] = function* () { ... }. Do not stringify this key — JSON drops it. Array.from uses this protocol when present. querySelectorAll lists are iterable in modern browsers. Pitfall: {...obj} object spread does NOT use Symbol.iterator — it copies properties. [...obj] does."
    },
    {
      "level": "advanced",
      "question": "How would you explain Symbol.iterator at an interview, including engine/spec details?",
      "answerHint": "GetMethod(obj, @@iterator). Array spread vs object spread are different operations. The symbol is the same per realm as other well-known symbols."
    }
  ],
  "pitfalls": [
    "{...obj} object spread does NOT use Symbol.iterator — it copies properties. [...obj] does.",
    "querySelectorAll lists are iterable in modern browsers."
  ],
  "interview": {
    "expectations": [
      "Explain Symbol.iterator without mixing it up with a nearby B1.21 — Iterables, Iterators & Generators topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "GetMethod(obj, @@iterator)."
    ],
    "commonQuestions": [
      "What is Symbol.iterator?",
      "Why does JavaScript symbol.iterator behave this way?",
      "What is the classic Symbol.iterator interview trap?"
    ],
    "traps": [
      "{...obj} object spread does NOT use Symbol.iterator — it copies properties. [...obj] does."
    ],
    "misconceptions": [
      "A unique key that cannot collide with a user method named iterator. Well-known symbols are the protocol hooks."
    ],
    "strongSignals": [
      "Separates Symbol.iterator from lookalike APIs and can draw the mental model."
    ]
  }
})
