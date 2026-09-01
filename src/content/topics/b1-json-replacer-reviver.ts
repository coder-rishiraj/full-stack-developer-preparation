import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "replacer / reviver / toJSON",
  "whatIsIt": "replacer(key, value) is called for every property (and the root with key ''). Returning undefined omits the key. An array replacer whitelists keys. reviver(key, value) post-walks parse; returning undefined deletes the key. toJSON(key) on an object is called before replacer. Together they form a tiny protocol.",
  "whyExists": "Dates, BigInt, and redaction needed hooks without changing the JSON grammar.",
  "mentalModel": "stringify: object.toJSON then replacer as a filter. parse: reviver as a reconstructer, children first.",
  "how": [
    "Redact: if (key==='password') return undefined.",
    "Revive: if iso-date string, return new Date.",
    "Remember root call key ''.",
    "Array replacer cannot whitelist nested paths well."
  ],
  "callout": {
    "title": "Watch for",
    "text": "reviver on arrays sees indexes as string keys; easy to skip 0 as falsy if you write if (key).",
    "variant": "warning"
  },
  "example": "const obj = { a: 1, password: 'x', nest: { password: 'y', b: 2 } };\nconst t = JSON.stringify(obj, (k, v) => (k === 'password' ? undefined : v));\nconsole.log(t);\nconst parsed = JSON.parse(t, (k, v) => (k === 'a' ? v * 10 : v));\nconsole.log(parsed);\n",
  "exampleCaption": "replacer redacts password; reviver scales a",
  "internals": [
    "InternalizeJSONProperty applies reviver after children.",
    "replacer array uses a PropertyList of keys at each object (shallow names).",
    "toJSON is Get(value, 'toJSON') and Call if present."
  ],
  "takeaways": [
    "Redact: if (key==='password') return undefined.",
    "Revive: if iso-date string, return new Date.",
    "reviver on arrays sees indexes as string keys; easy to skip 0 as falsy if you write if (key).",
    "InternalizeJSONProperty applies reviver after children."
  ],
  "revision": [
    "replacer / reviver / toJSON: stringify: object.toJSON then replacer as a filter. parse: reviver as a reconstructer, children first.",
    "Redact: if (key==='password') return undefined.",
    "Revive: if iso-date string, return new Date.",
    "Remember root call key ''.",
    "Trap: reviver on arrays sees indexes as string keys; easy to skip 0 as falsy if you write if (key)."
  ],
  "flashcards": [
    [
      "replacer / reviver / toJSON",
      "replacer(key, value) is called for every property (and the root with key '')."
    ],
    [
      "Mental model",
      "stringify: object.toJSON then replacer as a filter. parse: reviver as a reconstructer, children first."
    ],
    [
      "Common trap",
      "reviver on arrays sees indexes as string keys; easy to skip 0 as falsy if you write if (key)."
    ],
    [
      "Redact: if (key==='password') return undefined.",
      "Revive: if iso-date string, return new Date."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is replacer / reviver / toJSON and where does a beginner first see it?",
      "answerHint": "replacer(key, value) is called for every property (and the root with key ''). Returning undefined omits the key. An array replacer whitelists keys. reviver(key, value) post-walks parse; returning undefined deletes the key. toJSON(key) on an object is called before replacer. Together they form a tiny protocol."
    },
    {
      "level": "intermediate",
      "question": "Walk through how replacer / reviver / toJSON works and name the main pitfall.",
      "answerHint": "Redact: if (key==='password') return undefined. Revive: if iso-date string, return new Date. Remember root call key ''. Array replacer cannot whitelist nested paths well. Pitfall: reviver on arrays sees indexes as string keys; easy to skip 0 as falsy if you write if (key)."
    },
    {
      "level": "advanced",
      "question": "How would you explain replacer / reviver / toJSON at an interview, including engine/spec details?",
      "answerHint": "InternalizeJSONProperty applies reviver after children. replacer array uses a PropertyList of keys at each object (shallow names). toJSON is Get(value, 'toJSON') and Call if present."
    }
  ],
  "pitfalls": [
    "reviver on arrays sees indexes as string keys; easy to skip 0 as falsy if you write if (key).",
    "Array replacer cannot whitelist nested paths well."
  ],
  "interview": {
    "expectations": [
      "Explain replacer / reviver / toJSON without mixing it up with a nearby B1.35 — JSON & Serialization topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "InternalizeJSONProperty applies reviver after children."
    ],
    "commonQuestions": [
      "What is replacer / reviver / toJSON?",
      "Why does JavaScript replacer / reviver / tojson behave this way?",
      "What is the classic replacer / reviver / toJSON interview trap?"
    ],
    "traps": [
      "reviver on arrays sees indexes as string keys; easy to skip 0 as falsy if you write if (key)."
    ],
    "misconceptions": [
      "Dates, BigInt, and redaction needed hooks without changing the JSON grammar."
    ],
    "strongSignals": [
      "Separates replacer / reviver / toJSON from lookalike APIs and can draw the mental model."
    ]
  }
})
