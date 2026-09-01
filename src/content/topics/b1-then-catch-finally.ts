import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": ".then / .catch / .finally",
  "whatIsIt": "then(onF, onR) returns a new promise. catch(fn) is then(undefined, fn). finally(fn) runs on settle, passes through the original value/reason unless fn throws/rejects. If onF returns a value, the next promise fulfills with it; if it throws, the next rejects. Returning a promise adopts it.",
  "whyExists": "Chaining needed a new promise per step so errors can skip to the next onR. finally is for cleanup that should not swallow the result.",
  "mentalModel": "Each then is a station. Success cars take the onF track; error cars take onR. finally is a toll both pay, then continue as they were.",
  "how": [
    "return inside then to pass values down.",
    "throw or return Promise.reject to go to the next catch.",
    "finally for stopLoading(); do not return unless you mean to override.",
    "then() with no args still waits a microtask."
  ],
  "callout": {
    "title": "Watch for",
    "text": "finally(() => { return 0 }) replaces a fulfilled value with 0 — usually accidental.",
    "variant": "warning"
  },
  "example": "Promise.resolve(1)\n  .then((n) => n + 1)\n  .then((n) => { throw new Error('x' + n); })\n  .catch((e) => e.message)\n  .finally(() => console.log('done'))\n  .then(console.log);\n",
  "exampleCaption": "then transform, throw, catch, finally passthrough",
  "internals": [
    "Promise.prototype.then uses PerformPromiseThen, creating a new PromiseCapability.",
    "finally uses then with functions that rethrow/return original.",
    "onF/onR not functions: identity / thrower defaults."
  ],
  "takeaways": [
    "return inside then to pass values down.",
    "throw or return Promise.reject to go to the next catch.",
    "finally(() => { return 0 }) replaces a fulfilled value with 0 — usually accidental.",
    "Promise.prototype.then uses PerformPromiseThen, creating a new PromiseCapability."
  ],
  "revision": [
    ".then / .catch / .finally: Each then is a station. Success cars take the onF track; error cars take onR. finally is a toll both pay, then continue as they were.",
    "return inside then to pass values down.",
    "throw or return Promise.reject to go to the next catch.",
    "finally for stopLoading(); do not return unless you mean to override.",
    "Trap: finally(() => { return 0 }) replaces a fulfilled value with 0 — usually accidental."
  ],
  "flashcards": [
    [
      ".then / .catch / .finally",
      "then(onF, onR) returns a new promise."
    ],
    [
      "Mental model",
      "Each then is a station. Success cars take the onF track; error cars take onR. finally is a toll both pay, then continue as they were."
    ],
    [
      "Common trap",
      "finally(() => { return 0 }) replaces a fulfilled value with 0 — usually accidental."
    ],
    [
      "return inside then to pass values down.",
      "throw or return Promise.reject to go to the next catch."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is .then / .catch / .finally and where does a beginner first see it?",
      "answerHint": "then(onF, onR) returns a new promise. catch(fn) is then(undefined, fn). finally(fn) runs on settle, passes through the original value/reason unless fn throws/rejects. If onF returns a value, the next promise fulfills with it; if it throws, the next rejects. Returning a promise adopts it."
    },
    {
      "level": "intermediate",
      "question": "Walk through how .then / .catch / .finally works and name the main pitfall.",
      "answerHint": "return inside then to pass values down. throw or return Promise.reject to go to the next catch. finally for stopLoading(); do not return unless you mean to override. then() with no args still waits a microtask. Pitfall: finally(() => { return 0 }) replaces a fulfilled value with 0 — usually accidental."
    },
    {
      "level": "advanced",
      "question": "How would you explain .then / .catch / .finally at an interview, including engine/spec details?",
      "answerHint": "Promise.prototype.then uses PerformPromiseThen, creating a new PromiseCapability. finally uses then with functions that rethrow/return original. onF/onR not functions: identity / thrower defaults."
    }
  ],
  "pitfalls": [
    "finally(() => { return 0 }) replaces a fulfilled value with 0 — usually accidental.",
    "then() with no args still waits a microtask."
  ],
  "interview": {
    "expectations": [
      "Explain .then / .catch / .finally without mixing it up with a nearby B1.29 — Promises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Promise.prototype.then uses PerformPromiseThen, creating a new PromiseCapability."
    ],
    "commonQuestions": [
      "What is .then / .catch / .finally?",
      "Why does JavaScript .then / .catch / .finally behave this way?",
      "What is the classic .then / .catch / .finally interview trap?"
    ],
    "traps": [
      "finally(() => { return 0 }) replaces a fulfilled value with 0 — usually accidental."
    ],
    "misconceptions": [
      "Chaining needed a new promise per step so errors can skip to the next onR. finally is for cleanup that should not swallow the result."
    ],
    "strongSignals": [
      "Separates .then / .catch / .finally from lookalike APIs and can draw the mental model."
    ]
  }
})
