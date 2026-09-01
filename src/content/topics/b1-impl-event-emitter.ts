import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement EventEmitter",
  "whatIsIt": "EventEmitter: map of event name → array of listeners. on/addListener pushes; off/removeListener splices the same function identity; emit calls a snapshot of the list (so off during emit is safe); once wraps and removes after fire. Do not inherit Node’s unless asked. Errors in listeners should not skip siblings (policy choice — document it).",
  "whyExists": "Pub/sub is the backbone of Node streams and many UI buses. Implementing it tests arrays, this, and snapshot iteration.",
  "mentalModel": "A dictionary of mailing lists. emit photocopies the list then phones each number so unsubscribing mid-broadcast is safe.",
  "how": [
    "this.table = new Map().",
    "on: get-or-create array, push fn.",
    "emit: [...list].forEach(fn => fn(...args)).",
    "off: filter !== fn.",
    "once: wrapper that offs then calls."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Iterating the live array while a listener unsubscribes — skipped listeners. Snapshot with slice.",
    "variant": "warning"
  },
  "example": "class Emitter {\n  #m = new Map();\n  on(ev, fn) { if (!this.#m.has(ev)) this.#m.set(ev, []); this.#m.get(ev).push(fn); return this; }\n  off(ev, fn) { const a = this.#m.get(ev); if (a) this.#m.set(ev, a.filter((f) => f !== fn)); }\n  emit(ev, ...args) { [...(this.#m.get(ev) || [])].forEach((f) => f(...args)); }\n  once(ev, fn) {\n    const w = (...a) => { this.off(ev, w); fn(...a); };\n    return this.on(ev, w);\n  }\n}\nconst e = new Emitter();\ne.once('x', (n) => console.log('once', n));\ne.emit('x', 1); e.emit('x', 2);\n",
  "exampleCaption": "Map of arrays; once wrapper; snapshot emit",
  "internals": [
    "Node EventEmitter is more (error event, maxListeners, prepend).",
    "Function identity is how off works — bind creates a new one.",
    "DOM EventTarget is a different API (capture, once option)."
  ],
  "takeaways": [
    "this.table = new Map().",
    "on: get-or-create array, push fn.",
    "Iterating the live array while a listener unsubscribes — skipped listeners. Snapshot with slice.",
    "Node EventEmitter is more (error event, maxListeners, prepend)."
  ],
  "revision": [
    "Implement EventEmitter: A dictionary of mailing lists. emit photocopies the list then phones each number so unsubscribing mid-broadcast is safe.",
    "this.table = new Map().",
    "on: get-or-create array, push fn.",
    "emit: [...list].forEach(fn => fn(...args)).",
    "Trap: Iterating the live array while a listener unsubscribes — skipped listeners. Snapshot with slice."
  ],
  "flashcards": [
    [
      "Implement EventEmitter",
      "EventEmitter: map of event name → array of listeners."
    ],
    [
      "Mental model",
      "A dictionary of mailing lists. emit photocopies the list then phones each number so unsubscribing mid-broadcast is safe."
    ],
    [
      "Common trap",
      "Iterating the live array while a listener unsubscribes — skipped listeners. Snapshot with slice."
    ],
    [
      "this.table = new Map().",
      "on: get-or-create array, push fn."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement EventEmitter and where does a beginner first see it?",
      "answerHint": "EventEmitter: map of event name → array of listeners. on/addListener pushes; off/removeListener splices the same function identity; emit calls a snapshot of the list (so off during emit is safe); once wraps and removes after fire. Do not inherit Node’s unless asked. Errors in listeners should not skip siblings (policy choice — document it)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement EventEmitter works and name the main pitfall.",
      "answerHint": "this.table = new Map(). on: get-or-create array, push fn. emit: [...list].forEach(fn => fn(...args)). off: filter !== fn. once: wrapper that offs then calls. Pitfall: Iterating the live array while a listener unsubscribes — skipped listeners. Snapshot with slice."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement EventEmitter at an interview, including engine/spec details?",
      "answerHint": "Node EventEmitter is more (error event, maxListeners, prepend). Function identity is how off works — bind creates a new one. DOM EventTarget is a different API (capture, once option)."
    }
  ],
  "pitfalls": [
    "Iterating the live array while a listener unsubscribes — skipped listeners. Snapshot with slice.",
    "once: wrapper that offs then calls."
  ],
  "interview": {
    "expectations": [
      "Explain Implement EventEmitter without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Node EventEmitter is more (error event, maxListeners, prepend)."
    ],
    "commonQuestions": [
      "What is Implement EventEmitter?",
      "Why does JavaScript implement eventemitter behave this way?",
      "What is the classic Implement EventEmitter interview trap?"
    ],
    "traps": [
      "Iterating the live array while a listener unsubscribes — skipped listeners. Snapshot with slice."
    ],
    "misconceptions": [
      "Pub/sub is the backbone of Node streams and many UI buses. Implementing it tests arrays, this, and snapshot iteration."
    ],
    "strongSignals": [
      "Separates Implement EventEmitter from lookalike APIs and can draw the mental model."
    ]
  }
})
