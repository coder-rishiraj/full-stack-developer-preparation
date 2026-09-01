import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Map vs Object",
  "whatIsIt": "Objects: string/symbol keys, prototypes, JSON, literals. Map: any keys, size, no accidental proto keys, better frequent add/delete. Object is the right ‘struct.’ Map is the right ‘dictionary with unknown keys.’ Object.keys vs map.keys() differ; JSON loves objects.",
  "whyExists": "For years objects were fake maps. ES2015 added Map so we could stop using objects as hash tables of arbitrary keys.",
  "mentalModel": "Object = labeled record / JSON shape. Map = hashmap. If the keys come from the user, Map (or null-proto object) is safer.",
  "how": [
    "Config/records: object literals.",
    "Caches keyed by object: Map or WeakMap.",
    "Do not JSON.stringify a Map expecting entries.",
    "Counting keys: map.size vs Object.keys(o).length (enumerable only)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "for (const k in map) does not iterate Map entries — map is an object with no enumerable data keys.",
    "variant": "warning"
  },
  "example": "const o = { a: 1 };\nconst m = new Map([['a', 1]]);\nconsole.log(o.a, m.get('a'), m.size, Object.keys(o).length);\nconsole.log(JSON.stringify(o), JSON.stringify(m));\nconst userKey = '__proto__';\no[userKey] = { x: 1 };\nconsole.log(({}).x);\n",
  "exampleCaption": "JSON and size; object __proto__ hazard sketch",
  "internals": [
    "Object [[Get]] vs MapPrototypeGet looking at [[MapData]].",
    "Objects inherit Object.prototype unless create(null).",
    "Map’s size is an accessor on the prototype reading the internal count."
  ],
  "takeaways": [
    "Config/records: object literals.",
    "Caches keyed by object: Map or WeakMap.",
    "for (const k in map) does not iterate Map entries — map is an object with no enumerable data keys.",
    "Object [[Get]] vs MapPrototypeGet looking at [[MapData]]."
  ],
  "revision": [
    "Map vs Object: Object = labeled record / JSON shape. Map = hashmap. If the keys come from the user, Map (or null-proto object) is safer.",
    "Config/records: object literals.",
    "Caches keyed by object: Map or WeakMap.",
    "Do not JSON.stringify a Map expecting entries.",
    "Trap: for (const k in map) does not iterate Map entries — map is an object with no enumerable data keys."
  ],
  "flashcards": [
    [
      "Map vs Object",
      "Objects: string/symbol keys, prototypes, JSON, literals."
    ],
    [
      "Mental model",
      "Object = labeled record / JSON shape. Map = hashmap. If the keys come from the user, Map (or null-proto object) is safer."
    ],
    [
      "Common trap",
      "for (const k in map) does not iterate Map entries — map is an object with no enumerable data keys."
    ],
    [
      "Config/records: object literals.",
      "Caches keyed by object: Map or WeakMap."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Map vs Object and where does a beginner first see it?",
      "answerHint": "Objects: string/symbol keys, prototypes, JSON, literals. Map: any keys, size, no accidental proto keys, better frequent add/delete. Object is the right ‘struct.’ Map is the right ‘dictionary with unknown keys.’ Object.keys vs map.keys() differ; JSON loves objects."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Map vs Object works and name the main pitfall.",
      "answerHint": "Config/records: object literals. Caches keyed by object: Map or WeakMap. Do not JSON.stringify a Map expecting entries. Counting keys: map.size vs Object.keys(o).length (enumerable only). Pitfall: for (const k in map) does not iterate Map entries — map is an object with no enumerable data keys."
    },
    {
      "level": "advanced",
      "question": "How would you explain Map vs Object at an interview, including engine/spec details?",
      "answerHint": "Object [[Get]] vs MapPrototypeGet looking at [[MapData]]. Objects inherit Object.prototype unless create(null). Map’s size is an accessor on the prototype reading the internal count."
    }
  ],
  "pitfalls": [
    "for (const k in map) does not iterate Map entries — map is an object with no enumerable data keys.",
    "Counting keys: map.size vs Object.keys(o).length (enumerable only)."
  ],
  "interview": {
    "expectations": [
      "Explain Map vs Object without mixing it up with a nearby B1.19 — Maps, Sets & Weak Collections topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Object [[Get]] vs MapPrototypeGet looking at [[MapData]]."
    ],
    "commonQuestions": [
      "What is Map vs Object?",
      "Why does JavaScript map vs object behave this way?",
      "What is the classic Map vs Object interview trap?"
    ],
    "traps": [
      "for (const k in map) does not iterate Map entries — map is an object with no enumerable data keys."
    ],
    "misconceptions": [
      "For years objects were fake maps. ES2015 added Map so we could stop using objects as hash tables of arbitrary keys."
    ],
    "strongSignals": [
      "Separates Map vs Object from lookalike APIs and can draw the mental model."
    ]
  }
})
