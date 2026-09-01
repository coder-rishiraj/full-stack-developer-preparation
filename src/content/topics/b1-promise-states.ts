import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Pending / Fulfilled / Rejected",
  "whatIsIt": "Pending: not settled. Fulfilled: has a value. Rejected: has a reason. Settled = fulfilled or rejected; it never un-settles. resolve(otherPromise) adopts that promise’s state (pending until then). resolve(thenable) may async-follow it. reject(x) does not wait. Fulfill with undefined if you resolve() with no arg.",
  "whyExists": "A three-state machine is enough for ‘not yet / ok / fail’ and forbids double settle bugs if implemented correctly.",
  "mentalModel": "A one-way street: pending → fulfilled XOR rejected. resolve on an already settled promise is ignored.",
  "how": [
    "Inspect with then; there is no .state in the spec for user code.",
    "Promise.resolve(x) wraps or adopts.",
    "Do not resolve and reject; first wins.",
    "Rejection reasons should be Errors."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Forever-pending promises (forgot to resolve) look like hangs — not rejections.",
    "variant": "warning"
  },
  "example": "const p = new Promise((resolve, reject) => {\n  resolve(1);\n  reject(new Error('ignored'));\n});\np.then((v) => console.log('v', v), (e) => console.log('e', e));\nconst pending = new Promise(() => {});\nconsole.log(typeof pending.then);\n",
  "exampleCaption": "First settle wins; forever-pending is possible",
  "internals": [
    "FulfillPromise / RejectPromise no-ops if not pending.",
    "Resolve walks thenables (PromiseResolveThenableJob) and can stay pending.",
    "No public getter for [[PromiseState]]."
  ],
  "takeaways": [
    "Inspect with then; there is no .state in the spec for user code.",
    "Promise.resolve(x) wraps or adopts.",
    "Forever-pending promises (forgot to resolve) look like hangs — not rejections.",
    "FulfillPromise / RejectPromise no-ops if not pending."
  ],
  "revision": [
    "Pending / Fulfilled / Rejected: A one-way street: pending → fulfilled XOR rejected. resolve on an already settled promise is ignored.",
    "Inspect with then; there is no .state in the spec for user code.",
    "Promise.resolve(x) wraps or adopts.",
    "Do not resolve and reject; first wins.",
    "Trap: Forever-pending promises (forgot to resolve) look like hangs — not rejections."
  ],
  "flashcards": [
    [
      "Pending / Fulfilled / Rejected",
      "Pending: not settled."
    ],
    [
      "Mental model",
      "A one-way street: pending → fulfilled XOR rejected. resolve on an already settled promise is ignored."
    ],
    [
      "Common trap",
      "Forever-pending promises (forgot to resolve) look like hangs — not rejections."
    ],
    [
      "Inspect with then; there is no .state in the spec for user code.",
      "Promise.resolve(x) wraps or adopts."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Pending / Fulfilled / Rejected and where does a beginner first see it?",
      "answerHint": "Pending: not settled. Fulfilled: has a value. Rejected: has a reason. Settled = fulfilled or rejected; it never un-settles. resolve(otherPromise) adopts that promise’s state (pending until then). resolve(thenable) may async-follow it. reject(x) does not wait. Fulfill with undefined if you resolve() with no arg."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Pending / Fulfilled / Rejected works and name the main pitfall.",
      "answerHint": "Inspect with then; there is no .state in the spec for user code. Promise.resolve(x) wraps or adopts. Do not resolve and reject; first wins. Rejection reasons should be Errors. Pitfall: Forever-pending promises (forgot to resolve) look like hangs — not rejections."
    },
    {
      "level": "advanced",
      "question": "How would you explain Pending / Fulfilled / Rejected at an interview, including engine/spec details?",
      "answerHint": "FulfillPromise / RejectPromise no-ops if not pending. Resolve walks thenables (PromiseResolveThenableJob) and can stay pending. No public getter for [[PromiseState]]."
    }
  ],
  "pitfalls": [
    "Forever-pending promises (forgot to resolve) look like hangs — not rejections.",
    "Rejection reasons should be Errors."
  ],
  "interview": {
    "expectations": [
      "Explain Pending / Fulfilled / Rejected without mixing it up with a nearby B1.29 — Promises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "FulfillPromise / RejectPromise no-ops if not pending."
    ],
    "commonQuestions": [
      "What is Pending / Fulfilled / Rejected?",
      "Why does JavaScript pending / fulfilled / rejected behave this way?",
      "What is the classic Pending / Fulfilled / Rejected interview trap?"
    ],
    "traps": [
      "Forever-pending promises (forgot to resolve) look like hangs — not rejections."
    ],
    "misconceptions": [
      "A three-state machine is enough for ‘not yet / ok / fail’ and forbids double settle bugs if implemented correctly."
    ],
    "strongSignals": [
      "Separates Pending / Fulfilled / Rejected from lookalike APIs and can draw the mental model."
    ]
  }
})
