import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Closures in React",
  "whatIsIt": "Each React function component call creates new consts and new function identities. Event handlers close over that render’s props/state. If you subscribe once (empty deps) with that handler, you keep the first render’s values. Fixes: deps, refs, or functional updates. useCallback changes identity when deps change.",
  "whyExists": "React’s render model is ‘call the function again’ while the DOM listener may be the old function. Closures are the bridge and the bug.",
  "mentalModel": "Render N is a new room with new sticky notes. A listener installed in render 1 still lives in room 1.",
  "how": [
    "List every value the effect/handler reads in the dependency array.",
    "useRef for the latest value if you must keep a stable subscriber.",
    "setCount(c => c+1) avoids needing count in the closure.",
    "Do not blame React for JS closures — it is the same language rule."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Empty dependency array + count in the handler = always the initial count.",
    "variant": "warning"
  },
  "example": "function fakeRender(count) {\n  const onClick = () => count;\n  return onClick;\n}\nconst first = fakeRender(0);\nconst second = fakeRender(1);\nconsole.log(first(), second());\nconst ref = { current: 0 };\nconst stable = () => ref.current;\nref.current = 2;\nconsole.log(stable());\n",
  "exampleCaption": "Per-render closures vs a mutable ref box",
  "internals": [
    "useRef returns the same object identity across renders; mutating current does not create a new binding.",
    "useEffect re-runs when deps change, replacing the subscribed function.",
    "Concurrent features can run renders without committing — another reason effects are the subscribe point."
  ],
  "takeaways": [
    "List every value the effect/handler reads in the dependency array.",
    "useRef for the latest value if you must keep a stable subscriber.",
    "Empty dependency array + count in the handler = always the initial count.",
    "useRef returns the same object identity across renders; mutating current does not create a new binding."
  ],
  "revision": [
    "Closures in React: Render N is a new room with new sticky notes. A listener installed in render 1 still lives in room 1.",
    "List every value the effect/handler reads in the dependency array.",
    "useRef for the latest value if you must keep a stable subscriber.",
    "setCount(c => c+1) avoids needing count in the closure.",
    "Trap: Empty dependency array + count in the handler = always the initial count."
  ],
  "flashcards": [
    [
      "Closures in React",
      "Each React function component call creates new consts and new function identities."
    ],
    [
      "Mental model",
      "Render N is a new room with new sticky notes. A listener installed in render 1 still lives in room 1."
    ],
    [
      "Common trap",
      "Empty dependency array + count in the handler = always the initial count."
    ],
    [
      "List every value the effect/handler reads in the dependency array.",
      "useRef for the latest value if you must keep a stable subscriber."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Closures in React and where does a beginner first see it?",
      "answerHint": "Each React function component call creates new consts and new function identities. Event handlers close over that render’s props/state. If you subscribe once (empty deps) with that handler, you keep the first render’s values. Fixes: deps, refs, or functional updates. useCallback changes identity when deps change."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Closures in React works and name the main pitfall.",
      "answerHint": "List every value the effect/handler reads in the dependency array. useRef for the latest value if you must keep a stable subscriber. setCount(c => c+1) avoids needing count in the closure. Do not blame React for JS closures — it is the same language rule. Pitfall: Empty dependency array + count in the handler = always the initial count."
    },
    {
      "level": "advanced",
      "question": "How would you explain Closures in React at an interview, including engine/spec details?",
      "answerHint": "useRef returns the same object identity across renders; mutating current does not create a new binding. useEffect re-runs when deps change, replacing the subscribed function. Concurrent features can run renders without committing — another reason effects are the subscribe point."
    }
  ],
  "pitfalls": [
    "Empty dependency array + count in the handler = always the initial count.",
    "Do not blame React for JS closures — it is the same language rule."
  ],
  "interview": {
    "expectations": [
      "Explain Closures in React without mixing it up with a nearby B1.12 — Closures topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "useRef returns the same object identity across renders; mutating current does not create a new binding."
    ],
    "commonQuestions": [
      "What is Closures in React?",
      "Why does JavaScript closures in react behave this way?",
      "What is the classic Closures in React interview trap?"
    ],
    "traps": [
      "Empty dependency array + count in the handler = always the initial count."
    ],
    "misconceptions": [
      "React’s render model is ‘call the function again’ while the DOM listener may be the old function. Closures are the bridge and the bug."
    ],
    "strongSignals": [
      "Separates Closures in React from lookalike APIs and can draw the mental model."
    ]
  }
})
