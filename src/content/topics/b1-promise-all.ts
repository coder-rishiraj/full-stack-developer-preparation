import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Promise.all",
  "whatIsIt": "Promise.all(iterable) fulfills with an array of results in input order when every input fulfills. The first rejection rejects all immediately (fail-fast). Non-promises are wrapped with Promise.resolve. It does not cancel siblings on failure.",
  "whyExists": "‘Load these N resources’ is the most common parallel join. Fail-fast matches ‘page cannot render without all.’",
  "mentalModel": "A group project: if one member fails, the project fails; grades still sit in seat-order when all succeed.",
  "how": [
    "map to promises then all.",
    "Handle the rejection and optionally still await others if you need cleanup.",
    "Empty array → resolved [].",
    "Do not all a huge unbounded map of jobs — limit concurrency."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Promise.all on a map that returns undefined (forgot return) fulfills with [undefined, …].",
    "variant": "warning"
  },
  "example": "const ps = [1, 2, 3].map((n) => Promise.resolve(n * 10));\nconsole.log(await Promise.all(ps));\ntry {\n  await Promise.all([Promise.resolve(1), Promise.reject(new Error('x'))]);\n} catch (e) { console.log(e.message); }\n",
  "exampleCaption": "all success array vs fail-fast reject",
  "internals": [
    "Each then records at its index; count down remaining.",
    "Reject short-circuits the result promise; others still settle in the background.",
    "Iterator of the argument is consumed up front."
  ],
  "takeaways": [
    "map to promises then all.",
    "Handle the rejection and optionally still await others if you need cleanup.",
    "Promise.all on a map that returns undefined (forgot return) fulfills with [undefined, …].",
    "Each then records at its index; count down remaining."
  ],
  "revision": [
    "Promise.all: A group project: if one member fails, the project fails; grades still sit in seat-order when all succeed.",
    "map to promises then all.",
    "Handle the rejection and optionally still await others if you need cleanup.",
    "Empty array → resolved [].",
    "Trap: Promise.all on a map that returns undefined (forgot return) fulfills with [undefined, …]."
  ],
  "flashcards": [
    [
      "Promise.all",
      "Promise.all(iterable) fulfills with an array of results in input order when every input fulfills."
    ],
    [
      "Mental model",
      "A group project: if one member fails, the project fails; grades still sit in seat-order when all succeed."
    ],
    [
      "Common trap",
      "Promise.all on a map that returns undefined (forgot return) fulfills with [undefined, …]."
    ],
    [
      "map to promises then all.",
      "Handle the rejection and optionally still await others if you need cleanup."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Promise.all and where does a beginner first see it?",
      "answerHint": "Promise.all(iterable) fulfills with an array of results in input order when every input fulfills. The first rejection rejects all immediately (fail-fast). Non-promises are wrapped with Promise.resolve. It does not cancel siblings on failure."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Promise.all works and name the main pitfall.",
      "answerHint": "map to promises then all. Handle the rejection and optionally still await others if you need cleanup. Empty array → resolved []. Do not all a huge unbounded map of jobs — limit concurrency. Pitfall: Promise.all on a map that returns undefined (forgot return) fulfills with [undefined, …]."
    },
    {
      "level": "advanced",
      "question": "How would you explain Promise.all at an interview, including engine/spec details?",
      "answerHint": "Each then records at its index; count down remaining. Reject short-circuits the result promise; others still settle in the background. Iterator of the argument is consumed up front."
    }
  ],
  "pitfalls": [
    "Promise.all on a map that returns undefined (forgot return) fulfills with [undefined, …].",
    "Do not all a huge unbounded map of jobs — limit concurrency."
  ],
  "interview": {
    "expectations": [
      "Explain Promise.all without mixing it up with a nearby B1.29 — Promises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Each then records at its index; count down remaining."
    ],
    "commonQuestions": [
      "What is Promise.all?",
      "Why does JavaScript promise.all behave this way?",
      "What is the classic Promise.all interview trap?"
    ],
    "traps": [
      "Promise.all on a map that returns undefined (forgot return) fulfills with [undefined, …]."
    ],
    "misconceptions": [
      "‘Load these N resources’ is the most common parallel join. Fail-fast matches ‘page cannot render without all.’"
    ],
    "strongSignals": [
      "Separates Promise.all from lookalike APIs and can draw the mental model."
    ]
  }
})
