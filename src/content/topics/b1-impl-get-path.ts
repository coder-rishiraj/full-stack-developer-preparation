import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement get(object, path)",
  "whatIsIt": "get(object, path) reads a nested path like 'a.b[0].c' or ['a','b',0,'c'] and returns undefined if any step is nullish (or a default). Implement by splitting the path, walking with a loop, not eval. Do not use lodash.get — write the walk. Optional prototype pollution: skip __proto__ keys if the interviewer cares.",
  "whyExists": "Config objects are nested. A safe walker is safer than eval('obj.'+path) and is a standard utility interview.",
  "mentalModel": "A flashlight along a hallway of doors. If a door is missing or null, stop and return undefined (or default).",
  "how": [
    "Normalize path to an array of keys.",
    "Split on . and [n] with a small parser or regex.",
    "for (const k of keys) { if (cur==null) return def; cur = cur[k]; }",
    "Return default only if the walk failed, not if the value is 0.",
    "Refuse __proto__ / constructor if implementing safely."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Returning default when the value is 0 or '' — only missing/undefined should default (define your contract).",
    "variant": "warning"
  },
  "example": "function get(obj, path, def) {\n  const keys = Array.isArray(path)\n    ? path\n    : String(path).replace(/\\[/g, '.').replace(/\\]/g, '').split('.').filter(Boolean);\n  let cur = obj;\n  for (const k of keys) {\n    if (k === '__proto__' || k === 'constructor') return def;\n    if (cur == null) return def;\n    cur = cur[k];\n  }\n  return cur === undefined ? def : cur;\n}\nconsole.log(get({ a: { b: [ { c: 1 } ] } }, 'a.b[0].c'));\nconsole.log(get({}, 'a.b', 3), get({ a: 0 }, 'a', 3));\n",
  "exampleCaption": "Walk a.b[0].c; default vs legitimate 0",
  "internals": [
    "eval is a security hole and a wrong tool.",
    "Bracket paths are still property keys (strings).",
    "Prototype pollution via path '__proto__.x' is a real get/set utility CVE class."
  ],
  "takeaways": [
    "Normalize path to an array of keys.",
    "Split on . and [n] with a small parser or regex.",
    "Returning default when the value is 0 or '' — only missing/undefined should default (define your contract).",
    "eval is a security hole and a wrong tool."
  ],
  "revision": [
    "Implement get(object, path): A flashlight along a hallway of doors. If a door is missing or null, stop and return undefined (or default).",
    "Normalize path to an array of keys.",
    "Split on . and [n] with a small parser or regex.",
    "for (const k of keys) { if (cur==null) return def; cur = cur[k]; }",
    "Trap: Returning default when the value is 0 or '' — only missing/undefined should default (define your contract)."
  ],
  "flashcards": [
    [
      "Implement get(object, path)",
      "get(object, path) reads a nested path like 'a.b[0].c' or ['a','b',0,'c'] and returns undefined if any step is nullish (or a default)."
    ],
    [
      "Mental model",
      "A flashlight along a hallway of doors. If a door is missing or null, stop and return undefined (or default)."
    ],
    [
      "Common trap",
      "Returning default when the value is 0 or '' — only missing/undefined should default (define your contract)."
    ],
    [
      "Normalize path to an array of keys.",
      "Split on . and [n] with a small parser or regex."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement get(object, path) and where does a beginner first see it?",
      "answerHint": "get(object, path) reads a nested path like 'a.b[0].c' or ['a','b',0,'c'] and returns undefined if any step is nullish (or a default). Implement by splitting the path, walking with a loop, not eval. Do not use lodash.get — write the walk. Optional prototype pollution: skip __proto__ keys if the interviewer cares."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement get(object, path) works and name the main pitfall.",
      "answerHint": "Normalize path to an array of keys. Split on . and [n] with a small parser or regex. for (const k of keys) { if (cur==null) return def; cur = cur[k]; } Return default only if the walk failed, not if the value is 0. Refuse __proto__ / constructor if implementing safely. Pitfall: Returning default when the value is 0 or '' — only missing/undefined should default (define your contract)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement get(object, path) at an interview, including engine/spec details?",
      "answerHint": "eval is a security hole and a wrong tool. Bracket paths are still property keys (strings). Prototype pollution via path '__proto__.x' is a real get/set utility CVE class."
    }
  ],
  "pitfalls": [
    "Returning default when the value is 0 or '' — only missing/undefined should default (define your contract).",
    "Refuse __proto__ / constructor if implementing safely."
  ],
  "interview": {
    "expectations": [
      "Explain Implement get(object, path) without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "eval is a security hole and a wrong tool."
    ],
    "commonQuestions": [
      "What is Implement get(object, path)?",
      "Why does JavaScript implement get(object, path) behave this way?",
      "What is the classic Implement get(object, path) interview trap?"
    ],
    "traps": [
      "Returning default when the value is 0 or '' — only missing/undefined should default (define your contract)."
    ],
    "misconceptions": [
      "Config objects are nested. A safe walker is safer than eval('obj.'+path) and is a standard utility interview."
    ],
    "strongSignals": [
      "Separates Implement get(object, path) from lookalike APIs and can draw the mental model."
    ]
  }
})
