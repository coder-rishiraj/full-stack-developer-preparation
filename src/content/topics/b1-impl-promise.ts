import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement a Promise",
  "whatIsIt": "A toy Promise: store state, value, and arrays of onF/onR. The executor runs sync with resolve/reject that settle once and then drain queues via queueMicrotask. then always returns a new MyPromise; wrap callback results (thenable adopt). catch/finally can be then sugar. This is hard; handle throw in executor and in then callbacks.",
  "whyExists": "‘Write Promise’ is the senior async interview. It proves microtasks, thenable assimilation, and once-settle.",
  "mentalModel": "A state machine plus two mailing lists. resolve mails the success list on the next microtask. then always cuts a new box chained to this one.",
  "how": [
    "pending|fulfilled|rejected, locked after first settle.",
    "queueMicrotask to run handlers.",
    "then: if already settled, still queue async.",
    "If handler returns a thenable, adopt it.",
    "throw in handler → reject next."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Calling then handlers synchronously in resolve — Promises must always be async (tests check a then after resolve still runs later).",
    "variant": "warning"
  },
  "example": "class P {\n  #s = 'pending'; #v; #ok = []; #no = [];\n  constructor(ex) {\n    const settle = (s, v) => { if (this.#s !== 'pending') return; this.#s = s; this.#v = v; queueMicrotask(() => (s === 'fulfilled' ? this.#ok : this.#no).forEach((f) => f(v))); };\n    try { ex((v) => settle('fulfilled', v), (e) => settle('rejected', e)); } catch (e) { settle('rejected', e); }\n  }\n  then(onF, onR) {\n    return new P((res, rej) => {\n      const wrap = (fn, pass) => (v) => { try { const r = fn ? fn(v) : pass(v); res(r); } catch (e) { rej(e); } };\n      const ok = wrap(onF, (v) => v), no = wrap(onR, (e) => { throw e; });\n      if (this.#s === 'fulfilled') queueMicrotask(() => ok(this.#v));\n      else if (this.#s === 'rejected') queueMicrotask(() => no(this.#v));\n      else { this.#ok.push(ok); this.#no.push(no); }\n    });\n  }\n}\nconst p = new P((r) => r(1));\np.then((n) => n + 1).then((n) => console.log(n));\n",
  "exampleCaption": "Minimal Promise: microtask then chain",
  "internals": [
    "A+ spec: then must be async; 2.2.4.",
    "Thenable assimilation is the hardest part (thenable that calls both resolve and reject).",
    "Real engines optimize native promises in C++."
  ],
  "takeaways": [
    "pending|fulfilled|rejected, locked after first settle.",
    "queueMicrotask to run handlers.",
    "Calling then handlers synchronously in resolve — Promises must always be async (tests check a then after resolve still runs later).",
    "A+ spec: then must be async; 2.2.4."
  ],
  "revision": [
    "Implement a Promise: A state machine plus two mailing lists. resolve mails the success list on the next microtask. then always cuts a new box chained to this one.",
    "pending|fulfilled|rejected, locked after first settle.",
    "queueMicrotask to run handlers.",
    "then: if already settled, still queue async.",
    "Trap: Calling then handlers synchronously in resolve — Promises must always be async (tests check a then after resolve still runs later)."
  ],
  "flashcards": [
    [
      "Implement a Promise",
      "A toy Promise: store state, value, and arrays of onF/onR."
    ],
    [
      "Mental model",
      "A state machine plus two mailing lists. resolve mails the success list on the next microtask. then always cuts a new box chained to this one."
    ],
    [
      "Common trap",
      "Calling then handlers synchronously in resolve — Promises must always be async (tests check a then after resolve still runs later)."
    ],
    [
      "pending|fulfilled|rejected, locked after first settle.",
      "queueMicrotask to run handlers."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement a Promise and where does a beginner first see it?",
      "answerHint": "A toy Promise: store state, value, and arrays of onF/onR. The executor runs sync with resolve/reject that settle once and then drain queues via queueMicrotask. then always returns a new MyPromise; wrap callback results (thenable adopt). catch/finally can be then sugar. This is hard; handle throw in executor and in then callbacks."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement a Promise works and name the main pitfall.",
      "answerHint": "pending|fulfilled|rejected, locked after first settle. queueMicrotask to run handlers. then: if already settled, still queue async. If handler returns a thenable, adopt it. throw in handler → reject next. Pitfall: Calling then handlers synchronously in resolve — Promises must always be async (tests check a then after resolve still runs later)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement a Promise at an interview, including engine/spec details?",
      "answerHint": "A+ spec: then must be async; 2.2.4. Thenable assimilation is the hardest part (thenable that calls both resolve and reject). Real engines optimize native promises in C++."
    }
  ],
  "pitfalls": [
    "Calling then handlers synchronously in resolve — Promises must always be async (tests check a then after resolve still runs later).",
    "throw in handler → reject next."
  ],
  "interview": {
    "expectations": [
      "Explain Implement a Promise without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "A+ spec: then must be async; 2.2.4."
    ],
    "commonQuestions": [
      "What is Implement a Promise?",
      "Why does JavaScript implement a promise behave this way?",
      "What is the classic Implement a Promise interview trap?"
    ],
    "traps": [
      "Calling then handlers synchronously in resolve — Promises must always be async (tests check a then after resolve still runs later)."
    ],
    "misconceptions": [
      "‘Write Promise’ is the senior async interview. It proves microtasks, thenable assimilation, and once-settle."
    ],
    "strongSignals": [
      "Separates Implement a Promise from lookalike APIs and can draw the mental model."
    ]
  }
})
