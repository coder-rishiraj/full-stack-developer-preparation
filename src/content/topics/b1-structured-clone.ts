import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "structuredClone",
  "whatIsIt": "structuredClone(value) deep-clones a large set of built-ins: plain objects, arrays, Date, Map, Set, ArrayBuffer, typed arrays, many errors. Functions, DOM nodes, and some internals throw. It supports a transfer list for moving ArrayBuffers. Cycles are preserved (unlike JSON).",
  "whyExists": "Workers needed a clone algorithm for postMessage. Exposing it to the same thread gave a correct deep clone without JSON loss.",
  "mentalModel": "The postMessage photocopier, callable in-process. If workers can send it, structuredClone can usually copy it.",
  "how": [
    "Use for snapshots of data, Maps, Dates, cyclic graphs.",
    "Do not clone functions or class instances with methods — you get data properties, prototype may be lost (plain objects).",
    "Transfer ArrayBuffers when you want to move, not copy.",
    "Catch DataCloneError for unsupported types."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Class instances clone as plain objects (prototype not kept) unless they are treated as ordinary objects with own fields only.",
    "variant": "warning"
  },
  "example": "const cyc = { n: 1 };\ncyc.self = cyc;\nconst copy = structuredClone(cyc);\nconsole.log(copy.n, copy.self === copy, copy !== cyc);\nconst d = structuredClone(new Date('2020-01-01'));\nconsole.log(d instanceof Date, d.toISOString());\ntry { structuredClone(() => {}); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Cycles and Date clone; functions fail",
  "internals": [
    "Structured clone is specified in HTML, not ECMA-262.",
    "It walks a graph with a memo to preserve cycles.",
    "Transferables are detached at the source after clone-with-transfer."
  ],
  "takeaways": [
    "Use for snapshots of data, Maps, Dates, cyclic graphs.",
    "Do not clone functions or class instances with methods — you get data properties, prototype may be lost (plain objects).",
    "Class instances clone as plain objects (prototype not kept) unless they are treated as ordinary objects with own fields only.",
    "Structured clone is specified in HTML, not ECMA-262."
  ],
  "revision": [
    "structuredClone: The postMessage photocopier, callable in-process. If workers can send it, structuredClone can usually copy it.",
    "Use for snapshots of data, Maps, Dates, cyclic graphs.",
    "Do not clone functions or class instances with methods — you get data properties, prototype may be lost (plain objects).",
    "Transfer ArrayBuffers when you want to move, not copy.",
    "Trap: Class instances clone as plain objects (prototype not kept) unless they are treated as ordinary objects with own fields only."
  ],
  "flashcards": [
    [
      "structuredClone",
      "structuredClone(value) deep-clones a large set of built-ins: plain objects, arrays, Date, Map, Set, ArrayBuffer, typed arrays, many errors."
    ],
    [
      "Mental model",
      "The postMessage photocopier, callable in-process. If workers can send it, structuredClone can usually copy it."
    ],
    [
      "Common trap",
      "Class instances clone as plain objects (prototype not kept) unless they are treated as ordinary objects with own fields only."
    ],
    [
      "Use for snapshots of data, Maps, Dates, cyclic graphs.",
      "Do not clone functions or class instances with methods — you get data properties, prototype may be lost (plain objects)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is structuredClone and where does a beginner first see it?",
      "answerHint": "structuredClone(value) deep-clones a large set of built-ins: plain objects, arrays, Date, Map, Set, ArrayBuffer, typed arrays, many errors. Functions, DOM nodes, and some internals throw. It supports a transfer list for moving ArrayBuffers. Cycles are preserved (unlike JSON)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how structuredClone works and name the main pitfall.",
      "answerHint": "Use for snapshots of data, Maps, Dates, cyclic graphs. Do not clone functions or class instances with methods — you get data properties, prototype may be lost (plain objects). Transfer ArrayBuffers when you want to move, not copy. Catch DataCloneError for unsupported types. Pitfall: Class instances clone as plain objects (prototype not kept) unless they are treated as ordinary objects with own fields only."
    },
    {
      "level": "advanced",
      "question": "How would you explain structuredClone at an interview, including engine/spec details?",
      "answerHint": "Structured clone is specified in HTML, not ECMA-262. It walks a graph with a memo to preserve cycles. Transferables are detached at the source after clone-with-transfer."
    }
  ],
  "pitfalls": [
    "Class instances clone as plain objects (prototype not kept) unless they are treated as ordinary objects with own fields only.",
    "Catch DataCloneError for unsupported types."
  ],
  "interview": {
    "expectations": [
      "Explain structuredClone without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Structured clone is specified in HTML, not ECMA-262."
    ],
    "commonQuestions": [
      "What is structuredClone?",
      "Why does JavaScript structuredclone behave this way?",
      "What is the classic structuredClone interview trap?"
    ],
    "traps": [
      "Class instances clone as plain objects (prototype not kept) unless they are treated as ordinary objects with own fields only."
    ],
    "misconceptions": [
      "Workers needed a clone algorithm for postMessage. Exposing it to the same thread gave a correct deep clone without JSON loss."
    ],
    "strongSignals": [
      "Separates structuredClone from lookalike APIs and can draw the mental model."
    ]
  }
})
