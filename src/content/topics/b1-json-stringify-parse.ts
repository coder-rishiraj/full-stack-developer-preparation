import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "JSON.stringify / parse",
  "whatIsIt": "stringify(value, replacer, space) produces text; parse(text, reviver) produces values. stringify skips undefined in objects, turns array holes/undefined into null, throws on cycles, and calls toJSON. parse throws SyntaxError on junk. space pretty-prints. replacer can be an array of allowed keys.",
  "whyExists": "The pair is the standard serialization API in the language (JSON object).",
  "mentalModel": "stringify walks → text. parse text → walk with reviver. They are not perfect inverses.",
  "how": [
    "Pretty: JSON.stringify(obj, null, 2).",
    "Do not stringify BigInt without a replacer.",
    "parse only JSON text, not JS.",
    "Use reviver to revive dates from ISO strings if you choose that protocol."
  ],
  "callout": {
    "title": "Watch for",
    "text": "parse then stringify is not identity — key order, undefined, and numbers may change.",
    "variant": "warning"
  },
  "example": "const obj = { a: 1, b: [2, undefined], d: new Date('2020-01-01T00:00:00Z') };\nconsole.log(JSON.stringify(obj));\nconst t = JSON.stringify({ x: 1, y: 2 }, ['x'], 2);\nconsole.log(t);\nconst n = JSON.parse('{\"d\":\"2020-01-01\"}', (k, v) => (k === 'd' ? new Date(v) : v));\nconsole.log(n.d instanceof Date);\n",
  "exampleCaption": "stringify skips, toJSON Date, replacer keys, reviver Date",
  "internals": [
    "SerializeJSONObject / SerializeJSONArray.",
    "toJSON is invoked with the key.",
    "reviver is a post-order walk (children first)."
  ],
  "takeaways": [
    "Pretty: JSON.stringify(obj, null, 2).",
    "Do not stringify BigInt without a replacer.",
    "parse then stringify is not identity — key order, undefined, and numbers may change.",
    "SerializeJSONObject / SerializeJSONArray."
  ],
  "revision": [
    "JSON.stringify / parse: stringify walks → text. parse text → walk with reviver. They are not perfect inverses.",
    "Pretty: JSON.stringify(obj, null, 2).",
    "Do not stringify BigInt without a replacer.",
    "parse only JSON text, not JS.",
    "Trap: parse then stringify is not identity — key order, undefined, and numbers may change."
  ],
  "flashcards": [
    [
      "JSON.stringify / parse",
      "stringify(value, replacer, space) produces text; parse(text, reviver) produces values."
    ],
    [
      "Mental model",
      "stringify walks → text. parse text → walk with reviver. They are not perfect inverses."
    ],
    [
      "Common trap",
      "parse then stringify is not identity — key order, undefined, and numbers may change."
    ],
    [
      "Pretty: JSON.stringify(obj, null, 2).",
      "Do not stringify BigInt without a replacer."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is JSON.stringify / parse and where does a beginner first see it?",
      "answerHint": "stringify(value, replacer, space) produces text; parse(text, reviver) produces values. stringify skips undefined in objects, turns array holes/undefined into null, throws on cycles, and calls toJSON. parse throws SyntaxError on junk. space pretty-prints. replacer can be an array of allowed keys."
    },
    {
      "level": "intermediate",
      "question": "Walk through how JSON.stringify / parse works and name the main pitfall.",
      "answerHint": "Pretty: JSON.stringify(obj, null, 2). Do not stringify BigInt without a replacer. parse only JSON text, not JS. Use reviver to revive dates from ISO strings if you choose that protocol. Pitfall: parse then stringify is not identity — key order, undefined, and numbers may change."
    },
    {
      "level": "advanced",
      "question": "How would you explain JSON.stringify / parse at an interview, including engine/spec details?",
      "answerHint": "SerializeJSONObject / SerializeJSONArray. toJSON is invoked with the key. reviver is a post-order walk (children first)."
    }
  ],
  "pitfalls": [
    "parse then stringify is not identity — key order, undefined, and numbers may change.",
    "Use reviver to revive dates from ISO strings if you choose that protocol."
  ],
  "interview": {
    "expectations": [
      "Explain JSON.stringify / parse without mixing it up with a nearby B1.35 — JSON & Serialization topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "SerializeJSONObject / SerializeJSONArray."
    ],
    "commonQuestions": [
      "What is JSON.stringify / parse?",
      "Why does JavaScript json.stringify / parse behave this way?",
      "What is the classic JSON.stringify / parse interview trap?"
    ],
    "traps": [
      "parse then stringify is not identity — key order, undefined, and numbers may change."
    ],
    "misconceptions": [
      "The pair is the standard serialization API in the language (JSON object)."
    ],
    "strongSignals": [
      "Separates JSON.stringify / parse from lookalike APIs and can draw the mental model."
    ]
  }
})
