import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement deep clone / flatten / deep equality",
  "whatIsIt": "Deep clone: walk objects/arrays, copy into new containers, use a WeakMap of originals→copies to preserve cycles. Clone Date via new Date(ms), Map/Set by iterating, typed arrays via slice. Skip functions or throw. Flatten: recursive concat of nested arrays. Deep equal: same walk with SameValue and cycle maps. JSON is not an acceptable clone.",
  "whyExists": "structuredClone exists, but interviews want you to handle cycles and types by hand to prove graph traversal.",
  "mentalModel": "DFS/BFS of a graph. When you see a node already in the memo, reuse the copy (cycle). Flatten is clone of lists only. Equal is clone’s brother that returns boolean.",
  "how": [
    "if (seen.has(x)) return seen.get(x).",
    "Arrays: new array, then fill.",
    "Plain objects: Object.create(getPrototypeOf) or {}.",
    "Date/Map/Set special cases.",
    "deepEqual: if both seen, compare mapped pairs."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.parse(JSON.stringify) drops functions, dates-as-dates, maps, and throws on cycles.",
    "variant": "warning"
  },
  "example": "function deepClone(x, seen = new WeakMap()) {\n  if (x === null || typeof x !== 'object') return x;\n  if (seen.has(x)) return seen.get(x);\n  if (x instanceof Date) return new Date(x);\n  const c = Array.isArray(x) ? [] : {};\n  seen.set(x, c);\n  for (const k of Reflect.ownKeys(x)) c[k] = deepClone(x[k], seen);\n  return c;\n}\nfunction flatten(a) {\n  return a.reduce((acc, v) => acc.concat(Array.isArray(v) ? flatten(v) : v), []);\n}\nconst o = { n: 1 }; o.self = o;\nconst c = deepClone(o);\nconsole.log(c.n, c.self === c, c !== o, flatten([1, [2, [3]]]));\n",
  "exampleCaption": "Cycle-safe clone with WeakMap; recursive flatten",
  "internals": [
    "WeakMap memo is identity-based — correct for cycles.",
    "Reflect.ownKeys copies symbols too.",
    "Prototype: copying into {} loses class; mention structuredClone vs custom."
  ],
  "takeaways": [
    "if (seen.has(x)) return seen.get(x).",
    "Arrays: new array, then fill.",
    "JSON.parse(JSON.stringify) drops functions, dates-as-dates, maps, and throws on cycles.",
    "WeakMap memo is identity-based — correct for cycles."
  ],
  "revision": [
    "Implement deep clone / flatten / deep equality: DFS/BFS of a graph. When you see a node already in the memo, reuse the copy (cycle). Flatten is clone of lists only. Equal is clone’s brother that returns boolean.",
    "if (seen.has(x)) return seen.get(x).",
    "Arrays: new array, then fill.",
    "Plain objects: Object.create(getPrototypeOf) or {}.",
    "Trap: JSON.parse(JSON.stringify) drops functions, dates-as-dates, maps, and throws on cycles."
  ],
  "flashcards": [
    [
      "Implement deep clone / flatten / deep equality",
      "Deep clone: walk objects/arrays, copy into new containers, use a WeakMap of originals→copies to preserve cycles."
    ],
    [
      "Mental model",
      "DFS/BFS of a graph. When you see a node already in the memo, reuse the copy (cycle). Flatten is clone of lists only. Equal is clone’s brother that returns boolean."
    ],
    [
      "Common trap",
      "JSON.parse(JSON.stringify) drops functions, dates-as-dates, maps, and throws on cycles."
    ],
    [
      "if (seen.has(x)) return seen.get(x).",
      "Arrays: new array, then fill."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement deep clone / flatten / deep equality and where does a beginner first see it?",
      "answerHint": "Deep clone: walk objects/arrays, copy into new containers, use a WeakMap of originals→copies to preserve cycles. Clone Date via new Date(ms), Map/Set by iterating, typed arrays via slice. Skip functions or throw. Flatten: recursive concat of nested arrays. Deep equal: same walk with SameValue and cycle maps. JSON is not an acceptable clone."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement deep clone / flatten / deep equality works and name the main pitfall.",
      "answerHint": "if (seen.has(x)) return seen.get(x). Arrays: new array, then fill. Plain objects: Object.create(getPrototypeOf) or {}. Date/Map/Set special cases. deepEqual: if both seen, compare mapped pairs. Pitfall: JSON.parse(JSON.stringify) drops functions, dates-as-dates, maps, and throws on cycles."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement deep clone / flatten / deep equality at an interview, including engine/spec details?",
      "answerHint": "WeakMap memo is identity-based — correct for cycles. Reflect.ownKeys copies symbols too. Prototype: copying into {} loses class; mention structuredClone vs custom."
    }
  ],
  "pitfalls": [
    "JSON.parse(JSON.stringify) drops functions, dates-as-dates, maps, and throws on cycles.",
    "deepEqual: if both seen, compare mapped pairs."
  ],
  "interview": {
    "expectations": [
      "Explain Implement deep clone / flatten / deep equality without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "WeakMap memo is identity-based — correct for cycles."
    ],
    "commonQuestions": [
      "What is Implement deep clone / flatten / deep equality?",
      "Why does JavaScript implement deep clone / flatten / deep equality behave this way?",
      "What is the classic Implement deep clone / flatten / deep equality interview trap?"
    ],
    "traps": [
      "JSON.parse(JSON.stringify) drops functions, dates-as-dates, maps, and throws on cycles."
    ],
    "misconceptions": [
      "structuredClone exists, but interviews want you to handle cycles and types by hand to prove graph traversal."
    ],
    "strongSignals": [
      "Separates Implement deep clone / flatten / deep equality from lookalike APIs and can draw the mental model."
    ]
  }
})
