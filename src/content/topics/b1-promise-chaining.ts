import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Promise Chaining",
  "whatIsIt": "Each then returns a distinct promise. A returned primitive fulfills the next. A returned promise makes the next wait. Errors skip later onF until an onR. Flattening: return innerPromise, do not wrap extra. Branching: two then on the same promise are independent forks, not a chain.",
  "whyExists": "Sequential async with error bubbling is the point of promises vs nested callbacks.",
  "mentalModel": "A railway: return a promise to add a bridge. Two thens on one promise are two trains from the same station.",
  "how": [
    "Chain: p.then(a).then(b).",
    "Fork: p.then(a); p.then(b) — both see p’s result, order is then-registration FIFO.",
    "Do not forget to return the inner promise.",
    "async/await is chain sugar."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Missing return: .then(() => { fetch(...) }) fulfills with undefined, not the fetch result.",
    "variant": "warning"
  },
  "example": "const p = Promise.resolve(1);\np.then((n) => n + 1).then((n) => console.log('chain', n));\np.then((n) => console.log('fork', n));\nPromise.resolve(2)\n  .then(() => Promise.resolve(3))\n  .then((n) => console.log('flat', n));\n",
  "exampleCaption": "Chain vs fork vs flattening a returned promise",
  "internals": [
    "Each then installs a reaction on the original and creates a new promise.",
    "Jobs for multiple thens on one promise run in registration order.",
    "ReturnIfAbrupt in the reaction job rejects the next promise."
  ],
  "takeaways": [
    "Chain: p.then(a).then(b).",
    "Fork: p.then(a); p.then(b) — both see p’s result, order is then-registration FIFO.",
    "Missing return: .then(() => { fetch(...) }) fulfills with undefined, not the fetch result.",
    "Each then installs a reaction on the original and creates a new promise."
  ],
  "revision": [
    "Promise Chaining: A railway: return a promise to add a bridge. Two thens on one promise are two trains from the same station.",
    "Chain: p.then(a).then(b).",
    "Fork: p.then(a); p.then(b) — both see p’s result, order is then-registration FIFO.",
    "Do not forget to return the inner promise.",
    "Trap: Missing return: .then(() => { fetch(...) }) fulfills with undefined, not the fetch result."
  ],
  "flashcards": [
    [
      "Promise Chaining",
      "Each then returns a distinct promise."
    ],
    [
      "Mental model",
      "A railway: return a promise to add a bridge. Two thens on one promise are two trains from the same station."
    ],
    [
      "Common trap",
      "Missing return: .then(() => { fetch(...) }) fulfills with undefined, not the fetch result."
    ],
    [
      "Chain: p.then(a).then(b).",
      "Fork: p.then(a); p.then(b) — both see p’s result, order is then-registration FIFO."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Promise Chaining and where does a beginner first see it?",
      "answerHint": "Each then returns a distinct promise. A returned primitive fulfills the next. A returned promise makes the next wait. Errors skip later onF until an onR. Flattening: return innerPromise, do not wrap extra. Branching: two then on the same promise are independent forks, not a chain."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Promise Chaining works and name the main pitfall.",
      "answerHint": "Chain: p.then(a).then(b). Fork: p.then(a); p.then(b) — both see p’s result, order is then-registration FIFO. Do not forget to return the inner promise. async/await is chain sugar. Pitfall: Missing return: .then(() => { fetch(...) }) fulfills with undefined, not the fetch result."
    },
    {
      "level": "advanced",
      "question": "How would you explain Promise Chaining at an interview, including engine/spec details?",
      "answerHint": "Each then installs a reaction on the original and creates a new promise. Jobs for multiple thens on one promise run in registration order. ReturnIfAbrupt in the reaction job rejects the next promise."
    }
  ],
  "pitfalls": [
    "Missing return: .then(() => { fetch(...) }) fulfills with undefined, not the fetch result.",
    "async/await is chain sugar."
  ],
  "interview": {
    "expectations": [
      "Explain Promise Chaining without mixing it up with a nearby B1.29 — Promises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Each then installs a reaction on the original and creates a new promise."
    ],
    "commonQuestions": [
      "What is Promise Chaining?",
      "Why does JavaScript promise chaining behave this way?",
      "What is the classic Promise Chaining interview trap?"
    ],
    "traps": [
      "Missing return: .then(() => { fetch(...) }) fulfills with undefined, not the fetch result."
    ],
    "misconceptions": [
      "Sequential async with error bubbling is the point of promises vs nested callbacks."
    ],
    "strongSignals": [
      "Separates Promise Chaining from lookalike APIs and can draw the mental model."
    ]
  }
})
