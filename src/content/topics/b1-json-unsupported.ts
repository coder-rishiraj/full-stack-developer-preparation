import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Unsupported Values & Circular Refs",
  "whatIsIt": "Unsupported: functions, symbols, undefined (dropped in objects), BigInt (throws), cycles (throws), DOM nodes (become {}), Maps/Sets ({}), sparse holes→null in arrays, NaN/Infinity→null. Dates become strings via toJSON. These are the clone-via-JSON bugs.",
  "whyExists": "JSON’s type set is tiny on purpose for interoperability. JS values are bigger.",
  "mentalModel": "A tiny suitcase. What does not fit is left on the dock (dropped), turned into a postcard (Date), or gets the suitcase locked (throw).",
  "how": [
    "structuredClone for JS-rich graphs.",
    "Custom toJSON / replacer for BigInt.",
    "Detect cycles if you roll your own.",
    "Do not JSON-clone class instances expecting methods."
  ],
  "callout": {
    "title": "Watch for",
    "text": "stringify(window) or a DOM node can throw or produce giant useless graphs — don’t.",
    "variant": "warning"
  },
  "example": "try { JSON.stringify({ n: 1n }); } catch (e) { console.log(e.name); }\ntry { const a = {}; a.a = a; JSON.stringify(a); } catch (e) { console.log(e.name); }\nconsole.log(JSON.stringify({ m: new Map([[1, 2]]) }));\nconsole.log(JSON.stringify([, 1]));\n",
  "exampleCaption": "BigInt throw, cycle throw, Map {}, hole null",
  "internals": [
    "TypeError on BigInt and cycles in stringify.",
    "Ordinary objects only enumerate enumerable string keys.",
    "Map’s data is in internal slots, not enumerable properties."
  ],
  "takeaways": [
    "structuredClone for JS-rich graphs.",
    "Custom toJSON / replacer for BigInt.",
    "stringify(window) or a DOM node can throw or produce giant useless graphs — don’t.",
    "TypeError on BigInt and cycles in stringify."
  ],
  "revision": [
    "Unsupported Values & Circular Refs: A tiny suitcase. What does not fit is left on the dock (dropped), turned into a postcard (Date), or gets the suitcase locked (throw).",
    "structuredClone for JS-rich graphs.",
    "Custom toJSON / replacer for BigInt.",
    "Detect cycles if you roll your own.",
    "Trap: stringify(window) or a DOM node can throw or produce giant useless graphs — don’t."
  ],
  "flashcards": [
    [
      "Unsupported Values & Circular Refs",
      "Unsupported: functions, symbols, undefined (dropped in objects), BigInt (throws), cycles (throws), DOM nodes (become {}), Maps/Sets ({}), sparse holes→null in arrays, NaN/Infinity→null."
    ],
    [
      "Mental model",
      "A tiny suitcase. What does not fit is left on the dock (dropped), turned into a postcard (Date), or gets the suitcase locked (throw)."
    ],
    [
      "Common trap",
      "stringify(window) or a DOM node can throw or produce giant useless graphs — don’t."
    ],
    [
      "structuredClone for JS-rich graphs.",
      "Custom toJSON / replacer for BigInt."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Unsupported Values & Circular Refs and where does a beginner first see it?",
      "answerHint": "Unsupported: functions, symbols, undefined (dropped in objects), BigInt (throws), cycles (throws), DOM nodes (become {}), Maps/Sets ({}), sparse holes→null in arrays, NaN/Infinity→null. Dates become strings via toJSON. These are the clone-via-JSON bugs."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Unsupported Values & Circular Refs works and name the main pitfall.",
      "answerHint": "structuredClone for JS-rich graphs. Custom toJSON / replacer for BigInt. Detect cycles if you roll your own. Do not JSON-clone class instances expecting methods. Pitfall: stringify(window) or a DOM node can throw or produce giant useless graphs — don’t."
    },
    {
      "level": "advanced",
      "question": "How would you explain Unsupported Values & Circular Refs at an interview, including engine/spec details?",
      "answerHint": "TypeError on BigInt and cycles in stringify. Ordinary objects only enumerate enumerable string keys. Map’s data is in internal slots, not enumerable properties."
    }
  ],
  "pitfalls": [
    "stringify(window) or a DOM node can throw or produce giant useless graphs — don’t.",
    "Do not JSON-clone class instances expecting methods."
  ],
  "interview": {
    "expectations": [
      "Explain Unsupported Values & Circular Refs without mixing it up with a nearby B1.35 — JSON & Serialization topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "TypeError on BigInt and cycles in stringify."
    ],
    "commonQuestions": [
      "What is Unsupported Values & Circular Refs?",
      "Why does JavaScript unsupported values & circular refs behave this way?",
      "What is the classic Unsupported Values & Circular Refs interview trap?"
    ],
    "traps": [
      "stringify(window) or a DOM node can throw or produce giant useless graphs — don’t."
    ],
    "misconceptions": [
      "JSON’s type set is tiny on purpose for interoperability. JS values are bigger."
    ],
    "strongSignals": [
      "Separates Unsupported Values & Circular Refs from lookalike APIs and can draw the mental model."
    ]
  }
})
