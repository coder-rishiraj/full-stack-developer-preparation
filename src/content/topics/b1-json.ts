import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "JSON vs JavaScript Objects",
  "whatIsIt": "JSON is a text format: objects, arrays, strings, numbers, true/false/null. It is not JavaScript: no functions, comments, undefined, dates, or trailing commas (strict). Keys are strings. JS object literals are a superset. JSON.parse of untrusted text can still be huge (DoS) but does not eval code.",
  "whyExists": "The web needed a language-independent interchange lighter than XML. Crockford subset JS and named it JSON.",
  "mentalModel": "A faxable subset of object notation. If it cannot live in JSON, stringify will drop, null, or throw.",
  "how": [
    "JSON.parse / stringify at boundaries.",
    "Do not eval JSON.",
    "Validate schema of untrusted JSON.",
    "Remember parse numbers are IEEE doubles."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.parse('9007199254740993') rounds the id — keep big ids as strings in JSON.",
    "variant": "warning"
  },
  "example": "const text = '{\"a\":1,\"b\":null}';\nconst obj = JSON.parse(text);\nconsole.log(obj, JSON.stringify(obj));\ntry { JSON.parse('{a:1}'); } catch (e) { console.log(e.name); }\nconsole.log(JSON.stringify({ u: undefined, f() {}, n: NaN }));\n",
  "exampleCaption": "Valid JSON vs JS-literal and stringify drops",
  "internals": [
    "JSON grammar is in ECMA-404 / the spec’s JSON.parse.",
    "eval is not used; a dedicated parser.",
    "reviver walks the tree after parse."
  ],
  "takeaways": [
    "JSON.parse / stringify at boundaries.",
    "Do not eval JSON.",
    "JSON.parse('9007199254740993') rounds the id — keep big ids as strings in JSON.",
    "JSON grammar is in ECMA-404 / the spec’s JSON.parse."
  ],
  "revision": [
    "JSON vs JavaScript Objects: A faxable subset of object notation. If it cannot live in JSON, stringify will drop, null, or throw.",
    "JSON.parse / stringify at boundaries.",
    "Do not eval JSON.",
    "Validate schema of untrusted JSON.",
    "Trap: JSON.parse('9007199254740993') rounds the id — keep big ids as strings in JSON."
  ],
  "flashcards": [
    [
      "JSON vs JavaScript Objects",
      "JSON is a text format: objects, arrays, strings, numbers, true/false/null."
    ],
    [
      "Mental model",
      "A faxable subset of object notation. If it cannot live in JSON, stringify will drop, null, or throw."
    ],
    [
      "Common trap",
      "JSON.parse('9007199254740993') rounds the id — keep big ids as strings in JSON."
    ],
    [
      "JSON.parse / stringify at boundaries.",
      "Do not eval JSON."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is JSON vs JavaScript Objects and where does a beginner first see it?",
      "answerHint": "JSON is a text format: objects, arrays, strings, numbers, true/false/null. It is not JavaScript: no functions, comments, undefined, dates, or trailing commas (strict). Keys are strings. JS object literals are a superset. JSON.parse of untrusted text can still be huge (DoS) but does not eval code."
    },
    {
      "level": "intermediate",
      "question": "Walk through how JSON vs JavaScript Objects works and name the main pitfall.",
      "answerHint": "JSON.parse / stringify at boundaries. Do not eval JSON. Validate schema of untrusted JSON. Remember parse numbers are IEEE doubles. Pitfall: JSON.parse('9007199254740993') rounds the id — keep big ids as strings in JSON."
    },
    {
      "level": "advanced",
      "question": "How would you explain JSON vs JavaScript Objects at an interview, including engine/spec details?",
      "answerHint": "JSON grammar is in ECMA-404 / the spec’s JSON.parse. eval is not used; a dedicated parser. reviver walks the tree after parse."
    }
  ],
  "pitfalls": [
    "JSON.parse('9007199254740993') rounds the id — keep big ids as strings in JSON.",
    "Remember parse numbers are IEEE doubles."
  ],
  "interview": {
    "expectations": [
      "Explain JSON vs JavaScript Objects without mixing it up with a nearby B1.35 — JSON & Serialization topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "JSON grammar is in ECMA-404 / the spec’s JSON.parse."
    ],
    "commonQuestions": [
      "What is JSON vs JavaScript Objects?",
      "Why does JavaScript json vs javascript objects behave this way?",
      "What is the classic JSON vs JavaScript Objects interview trap?"
    ],
    "traps": [
      "JSON.parse('9007199254740993') rounds the id — keep big ids as strings in JSON."
    ],
    "misconceptions": [
      "The web needed a language-independent interchange lighter than XML. Crockford subset JS and named it JSON."
    ],
    "strongSignals": [
      "Separates JSON vs JavaScript Objects from lookalike APIs and can draw the mental model."
    ]
  }
})
