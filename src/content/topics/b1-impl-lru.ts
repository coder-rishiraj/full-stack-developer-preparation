import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement LRU Cache in JavaScript",
  "whatIsIt": "LRU cache: Map keeps insertion order. get: if has, delete and re-set to move to newest, return value. set: if has, refresh; if size==cap, delete map.keys().next().value (oldest); then set. O(1) average. Do not use an array.shift for large caps. Optional: TTL is extra.",
  "whyExists": "Caches in editors and APIs must evict. LRU is the standard interview cache with a clear invariant.",
  "mentalModel": "A guest list that re-stamps whoever you see. When the club is full, the oldest stamp at the door leaves.",
  "how": [
    "this.m = new Map(); this.cap = cap.",
    "get: if !has return; bump by delete+set.",
    "set: bump or evict first key then set.",
    "size: map.size.",
    "Do not iterate the whole map to find LRU."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using an Array to store order and indexOf on every get — O(n), not the expected O(1).",
    "variant": "warning"
  },
  "example": "class LRU {\n  constructor(cap) { this.cap = cap; this.m = new Map(); }\n  get(k) {\n    if (!this.m.has(k)) return undefined;\n    const v = this.m.get(k); this.m.delete(k); this.m.set(k, v); return v;\n  }\n  set(k, v) {\n    if (this.m.has(k)) this.m.delete(k);\n    else if (this.m.size === this.cap) this.m.delete(this.m.keys().next().value);\n    this.m.set(k, v);\n  }\n}\nconst l = new LRU(2);\nl.set('a', 1); l.set('b', 2); l.get('a'); l.set('c', 3);\nconsole.log(l.m.has('b'), [...l.m.keys()]);\n",
  "exampleCaption": "Map-order LRU: get bumps; set evicts oldest",
  "internals": [
    "JS Map is specified to be ordered by last set for new keys; delete+set moves to the end.",
    "A doubly linked list + hashmap is the classic non-JS writeup; Map is the JS-native equivalent.",
    "WeakMap cannot iterate keys, so it is the wrong structure for LRU eviction."
  ],
  "takeaways": [
    "this.m = new Map(); this.cap = cap.",
    "get: if !has return; bump by delete+set.",
    "Using an Array to store order and indexOf on every get — O(n), not the expected O(1).",
    "JS Map is specified to be ordered by last set for new keys; delete+set moves to the end."
  ],
  "revision": [
    "Implement LRU Cache in JavaScript: A guest list that re-stamps whoever you see. When the club is full, the oldest stamp at the door leaves.",
    "this.m = new Map(); this.cap = cap.",
    "get: if !has return; bump by delete+set.",
    "set: bump or evict first key then set.",
    "Trap: Using an Array to store order and indexOf on every get — O(n), not the expected O(1)."
  ],
  "flashcards": [
    [
      "Implement LRU Cache in JavaScript",
      "LRU cache: Map keeps insertion order."
    ],
    [
      "Mental model",
      "A guest list that re-stamps whoever you see. When the club is full, the oldest stamp at the door leaves."
    ],
    [
      "Common trap",
      "Using an Array to store order and indexOf on every get — O(n), not the expected O(1)."
    ],
    [
      "this.m = new Map(); this.cap = cap.",
      "get: if !has return; bump by delete+set."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement LRU Cache in JavaScript and where does a beginner first see it?",
      "answerHint": "LRU cache: Map keeps insertion order. get: if has, delete and re-set to move to newest, return value. set: if has, refresh; if size==cap, delete map.keys().next().value (oldest); then set. O(1) average. Do not use an array.shift for large caps. Optional: TTL is extra."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement LRU Cache in JavaScript works and name the main pitfall.",
      "answerHint": "this.m = new Map(); this.cap = cap. get: if !has return; bump by delete+set. set: bump or evict first key then set. size: map.size. Do not iterate the whole map to find LRU. Pitfall: Using an Array to store order and indexOf on every get — O(n), not the expected O(1)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement LRU Cache in JavaScript at an interview, including engine/spec details?",
      "answerHint": "JS Map is specified to be ordered by last set for new keys; delete+set moves to the end. A doubly linked list + hashmap is the classic non-JS writeup; Map is the JS-native equivalent. WeakMap cannot iterate keys, so it is the wrong structure for LRU eviction."
    }
  ],
  "pitfalls": [
    "Using an Array to store order and indexOf on every get — O(n), not the expected O(1).",
    "Do not iterate the whole map to find LRU."
  ],
  "interview": {
    "expectations": [
      "Explain Implement LRU Cache in JavaScript without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "JS Map is specified to be ordered by last set for new keys; delete+set moves to the end."
    ],
    "commonQuestions": [
      "What is Implement LRU Cache in JavaScript?",
      "Why does JavaScript implement lru cache in javascript behave this way?",
      "What is the classic Implement LRU Cache in JavaScript interview trap?"
    ],
    "traps": [
      "Using an Array to store order and indexOf on every get — O(n), not the expected O(1)."
    ],
    "misconceptions": [
      "Caches in editors and APIs must evict. LRU is the standard interview cache with a clear invariant."
    ],
    "strongSignals": [
      "Separates Implement LRU Cache in JavaScript from lookalike APIs and can draw the mental model."
    ]
  }
})
