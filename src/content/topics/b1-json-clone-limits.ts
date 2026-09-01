import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Why JSON Cloning Is Problematic",
  "whatIsIt": "JSON.parse(JSON.stringify(x)) drops undefined, functions, symbols, and prototype. Dates become ISO strings (then stay strings after parse). NaN/Infinity become null. Maps/Sets become {}. Cycles throw. Keys are sorted only by stringify’s enumeration, not a canonical map. It is not a deep clone of JS values.",
  "whyExists": "JSON is an interchange format, not a JS memory dump. Using it as clone is a hack that quietly loses types.",
  "mentalModel": "A fax machine that only sends a subset of JS. What cannot be faxed disappears or mutates.",
  "how": [
    "Do not JSON-clone application state with Dates/Maps.",
    "Use structuredClone or a typed serializer.",
    "undefined in arrays becomes null in JSON.stringify.",
    "toJSON on objects customizes stringify."
  ],
  "callout": {
    "title": "Watch for",
    "text": "After JSON clone, a Date is a string — date methods throw or coerce wrongly.",
    "variant": "warning"
  },
  "example": "const o = {\n  a: undefined,\n  d: new Date('2020-01-01'),\n  m: new Map([[1, 2]]),\n  n: NaN,\n};\nconsole.log(JSON.stringify(o));\nconsole.log(JSON.parse(JSON.stringify({ arr: [undefined, 1] })));\ntry { const c = {}; c.self = c; JSON.stringify(c); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "JSON.stringify losses: Date, Map, undefined, cycles",
  "internals": [
    "SerializeJSONProperty skips undefined in objects, nulls holes in arrays.",
    "Date.prototype.toJSON uses toISOString.",
    "Cycle detection throws TypeError."
  ],
  "takeaways": [
    "Do not JSON-clone application state with Dates/Maps.",
    "Use structuredClone or a typed serializer.",
    "After JSON clone, a Date is a string — date methods throw or coerce wrongly.",
    "SerializeJSONProperty skips undefined in objects, nulls holes in arrays."
  ],
  "revision": [
    "Why JSON Cloning Is Problematic: A fax machine that only sends a subset of JS. What cannot be faxed disappears or mutates.",
    "Do not JSON-clone application state with Dates/Maps.",
    "Use structuredClone or a typed serializer.",
    "undefined in arrays becomes null in JSON.stringify.",
    "Trap: After JSON clone, a Date is a string — date methods throw or coerce wrongly."
  ],
  "flashcards": [
    [
      "Why JSON Cloning Is Problematic",
      "JSON.parse(JSON.stringify(x)) drops undefined, functions, symbols, and prototype."
    ],
    [
      "Mental model",
      "A fax machine that only sends a subset of JS. What cannot be faxed disappears or mutates."
    ],
    [
      "Common trap",
      "After JSON clone, a Date is a string — date methods throw or coerce wrongly."
    ],
    [
      "Do not JSON-clone application state with Dates/Maps.",
      "Use structuredClone or a typed serializer."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Why JSON Cloning Is Problematic and where does a beginner first see it?",
      "answerHint": "JSON.parse(JSON.stringify(x)) drops undefined, functions, symbols, and prototype. Dates become ISO strings (then stay strings after parse). NaN/Infinity become null. Maps/Sets become {}. Cycles throw. Keys are sorted only by stringify’s enumeration, not a canonical map. It is not a deep clone of JS values."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Why JSON Cloning Is Problematic works and name the main pitfall.",
      "answerHint": "Do not JSON-clone application state with Dates/Maps. Use structuredClone or a typed serializer. undefined in arrays becomes null in JSON.stringify. toJSON on objects customizes stringify. Pitfall: After JSON clone, a Date is a string — date methods throw or coerce wrongly."
    },
    {
      "level": "advanced",
      "question": "How would you explain Why JSON Cloning Is Problematic at an interview, including engine/spec details?",
      "answerHint": "SerializeJSONProperty skips undefined in objects, nulls holes in arrays. Date.prototype.toJSON uses toISOString. Cycle detection throws TypeError."
    }
  ],
  "pitfalls": [
    "After JSON clone, a Date is a string — date methods throw or coerce wrongly.",
    "toJSON on objects customizes stringify."
  ],
  "interview": {
    "expectations": [
      "Explain Why JSON Cloning Is Problematic without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "SerializeJSONProperty skips undefined in objects, nulls holes in arrays."
    ],
    "commonQuestions": [
      "What is Why JSON Cloning Is Problematic?",
      "Why does JavaScript why json cloning is problematic behave this way?",
      "What is the classic Why JSON Cloning Is Problematic interview trap?"
    ],
    "traps": [
      "After JSON clone, a Date is a string — date methods throw or coerce wrongly."
    ],
    "misconceptions": [
      "JSON is an interchange format, not a JS memory dump. Using it as clone is a hack that quietly loses types."
    ],
    "strongSignals": [
      "Separates Why JSON Cloning Is Problematic from lookalike APIs and can draw the mental model."
    ]
  }
})
