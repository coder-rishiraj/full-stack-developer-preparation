import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Stale Closures",
  "whatIsIt": "A stale closure is a function that still sees an old binding value you thought had moved on — common when an effect subscribed once with a callback that closed over props/state from the first render. The binding is not stale; you captured yesterday’s environment. Refs or resubscribe fix it.",
  "whyExists": "UI frameworks re-run functions with new locals, but event listeners may still hold the old inner function. That mismatch is ‘stale props.’",
  "mentalModel": "You changed the billboard, but the photographer still has last week’s Polaroid in their backpack.",
  "how": [
    "Re-register listeners when values change, or read from a ref/object that is mutated.",
    "Include dependencies in effect dependency arrays.",
    "Do not assume a setInterval callback sees the latest React state variable.",
    "Prefer functional setState (n => n+1) to avoid needing the latest n in the closure."
  ],
  "callout": {
    "title": "Watch for",
    "text": "In React, the live-binding mental model fails because each render has new const state — the old handler still has the old const.",
    "variant": "warning"
  },
  "example": "function makeTicker() {\n  let n = 0;\n  const tick = () => n;\n  const bump = () => { n += 1; };\n  return { tick, bump };\n}\nconst t = makeTicker();\nconsole.log(t.tick());\nt.bump();\nconsole.log(t.tick()); // live binding — not stale\nlet snap = 0;\nconst stale = () => snap;\nsnap = 5;\nconsole.log(stale());\n",
  "exampleCaption": "Live closed-over let vs a copied snapshot in another variable",
  "internals": [
    "Each function object has one [[Environment]]; it does not auto-update to a newer render’s environment.",
    "React state consts are new bindings per render function invocation.",
    "Refs work by mutating .current on a stable object the closure already points at."
  ],
  "takeaways": [
    "Re-register listeners when values change, or read from a ref/object that is mutated.",
    "Include dependencies in effect dependency arrays.",
    "In React, the live-binding mental model fails because each render has new const state — the old handler still has the old const.",
    "Each function object has one [[Environment]]; it does not auto-update to a newer render’s environment."
  ],
  "revision": [
    "Stale Closures: You changed the billboard, but the photographer still has last week’s Polaroid in their backpack.",
    "Re-register listeners when values change, or read from a ref/object that is mutated.",
    "Include dependencies in effect dependency arrays.",
    "Do not assume a setInterval callback sees the latest React state variable.",
    "Trap: In React, the live-binding mental model fails because each render has new const state — the old handler still has the old const."
  ],
  "flashcards": [
    [
      "Stale Closures",
      "A stale closure is a function that still sees an old binding value you thought had moved on — common when an effect subscribed once with a callback that closed over props/state from the first render."
    ],
    [
      "Mental model",
      "You changed the billboard, but the photographer still has last week’s Polaroid in their backpack."
    ],
    [
      "Common trap",
      "In React, the live-binding mental model fails because each render has new const state — the old handler still has the old const."
    ],
    [
      "Re-register listeners when values change, or read from a ref/object that is muta",
      "Include dependencies in effect dependency arrays."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Stale Closures and where does a beginner first see it?",
      "answerHint": "A stale closure is a function that still sees an old binding value you thought had moved on — common when an effect subscribed once with a callback that closed over props/state from the first render. The binding is not stale; you captured yesterday’s environment. Refs or resubscribe fix it."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Stale Closures works and name the main pitfall.",
      "answerHint": "Re-register listeners when values change, or read from a ref/object that is mutated. Include dependencies in effect dependency arrays. Do not assume a setInterval callback sees the latest React state variable. Prefer functional setState (n => n+1) to avoid needing the latest n in the closure. Pitfall: In React, the live-binding mental model fails because each render has new const state — the old handler still has the old const."
    },
    {
      "level": "advanced",
      "question": "How would you explain Stale Closures at an interview, including engine/spec details?",
      "answerHint": "Each function object has one [[Environment]]; it does not auto-update to a newer render’s environment. React state consts are new bindings per render function invocation. Refs work by mutating .current on a stable object the closure already points at."
    }
  ],
  "pitfalls": [
    "In React, the live-binding mental model fails because each render has new const state — the old handler still has the old const.",
    "Prefer functional setState (n => n+1) to avoid needing the latest n in the closure."
  ],
  "interview": {
    "expectations": [
      "Explain Stale Closures without mixing it up with a nearby B1.12 — Closures topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Each function object has one [[Environment]]; it does not auto-update to a newer render’s environment."
    ],
    "commonQuestions": [
      "What is Stale Closures?",
      "Why does JavaScript stale closures behave this way?",
      "What is the classic Stale Closures interview trap?"
    ],
    "traps": [
      "In React, the live-binding mental model fails because each render has new const state — the old handler still has the old const."
    ],
    "misconceptions": [
      "UI frameworks re-run functions with new locals, but event listeners may still hold the old inner function. That mismatch is ‘stale props.’"
    ],
    "strongSignals": [
      "Separates Stale Closures from lookalike APIs and can draw the mental model."
    ]
  }
})
