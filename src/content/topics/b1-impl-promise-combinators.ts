import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement Promise.all / allSettled / race",
  "whatIsIt": "Implement all: counter remaining, array of results by index, reject on first reject. allSettled: never reject the outer (for promise inputs); store {status,value|reason}. race: first settle wins, empty stays pending. Do not use the built-in combinators. Wrap non-promises with Promise.resolve.",
  "whyExists": "Combinators are the standard concurrency interview after ‘what is a promise.’ Index-stability vs finish-order is the point.",
  "mentalModel": "Attach then to every input. all fills a seating chart. race slams the door on first finish. allSettled waits for every seat to have a card.",
  "how": [
    "Convert inputs to an array (iterable).",
    "Promise.resolve each item.",
    "all: if reject, reject outer once (guard).",
    "allSettled: increment done until n.",
    "race: no remaining count needed; first then/catch on the outer resolve/reject."
  ],
  "callout": {
    "title": "Watch for",
    "text": "all that pushes in completion order instead of assigning out[i] — order bugs.",
    "variant": "warning"
  },
  "example": "function all(iter) {\n  const xs = [...iter];\n  return new Promise((resolve, reject) => {\n    if (!xs.length) return resolve([]);\n    const out = []; let left = xs.length;\n    xs.forEach((p, i) => Promise.resolve(p).then((v) => { out[i] = v; if (--left === 0) resolve(out); }, reject));\n  });\n}\nfunction race(iter) {\n  const xs = [...iter];\n  return new Promise((resolve, reject) => {\n    xs.forEach((p) => Promise.resolve(p).then(resolve, reject));\n  });\n}\nconsole.log(await all([1, Promise.resolve(2)]));\nconsole.log(await race([new Promise(() => {}), Promise.resolve('w')]));\n",
  "exampleCaption": "all preserves index; race takes first settle",
  "internals": [
    "Spec still lets losing promises reject unhandled if you do not attach empty catches — mention it.",
    "Empty race never resolves — your impl should match.",
    "allSettled should not fail-fast."
  ],
  "takeaways": [
    "Convert inputs to an array (iterable).",
    "Promise.resolve each item.",
    "all that pushes in completion order instead of assigning out[i] — order bugs.",
    "Spec still lets losing promises reject unhandled if you do not attach empty catches — mention it."
  ],
  "revision": [
    "Implement Promise.all / allSettled / race: Attach then to every input. all fills a seating chart. race slams the door on first finish. allSettled waits for every seat to have a card.",
    "Convert inputs to an array (iterable).",
    "Promise.resolve each item.",
    "all: if reject, reject outer once (guard).",
    "Trap: all that pushes in completion order instead of assigning out[i] — order bugs."
  ],
  "flashcards": [
    [
      "Implement Promise.all / allSettled / race",
      "Implement all: counter remaining, array of results by index, reject on first reject."
    ],
    [
      "Mental model",
      "Attach then to every input. all fills a seating chart. race slams the door on first finish. allSettled waits for every seat to have a card."
    ],
    [
      "Common trap",
      "all that pushes in completion order instead of assigning out[i] — order bugs."
    ],
    [
      "Convert inputs to an array (iterable).",
      "Promise.resolve each item."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement Promise.all / allSettled / race and where does a beginner first see it?",
      "answerHint": "Implement all: counter remaining, array of results by index, reject on first reject. allSettled: never reject the outer (for promise inputs); store {status,value|reason}. race: first settle wins, empty stays pending. Do not use the built-in combinators. Wrap non-promises with Promise.resolve."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement Promise.all / allSettled / race works and name the main pitfall.",
      "answerHint": "Convert inputs to an array (iterable). Promise.resolve each item. all: if reject, reject outer once (guard). allSettled: increment done until n. race: no remaining count needed; first then/catch on the outer resolve/reject. Pitfall: all that pushes in completion order instead of assigning out[i] — order bugs."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement Promise.all / allSettled / race at an interview, including engine/spec details?",
      "answerHint": "Spec still lets losing promises reject unhandled if you do not attach empty catches — mention it. Empty race never resolves — your impl should match. allSettled should not fail-fast."
    }
  ],
  "pitfalls": [
    "all that pushes in completion order instead of assigning out[i] — order bugs.",
    "race: no remaining count needed; first then/catch on the outer resolve/reject."
  ],
  "interview": {
    "expectations": [
      "Explain Implement Promise.all / allSettled / race without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Spec still lets losing promises reject unhandled if you do not attach empty catches — mention it."
    ],
    "commonQuestions": [
      "What is Implement Promise.all / allSettled / race?",
      "Why does JavaScript implement promise.all / allsettled / race behave this way?",
      "What is the classic Implement Promise.all / allSettled / race interview trap?"
    ],
    "traps": [
      "all that pushes in completion order instead of assigning out[i] — order bugs."
    ],
    "misconceptions": [
      "Combinators are the standard concurrency interview after ‘what is a promise.’ Index-stability vs finish-order is the point."
    ],
    "strongSignals": [
      "Separates Implement Promise.all / allSettled / race from lookalike APIs and can draw the mental model."
    ]
  }
})
