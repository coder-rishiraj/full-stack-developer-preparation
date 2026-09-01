import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "requestAnimationFrame",
  "whatIsIt": "requestAnimationFrame(callback) runs before the next paint with a high-res timestamp. Use it to mutate DOM/canvas once per frame. cancelAnimationFrame(id) stops a loop. It pauses in background tabs (often). Timestamp is not ‘16.67ms guaranteed.’ Pair with CSS transforms for cheap visual changes. This is the browser paint-aligned scheduler.",
  "whyExists": "setTimeout(16) is not vsync and drifts. rAF exists so animations sample once per refresh and stop wasting CPU when hidden.",
  "mentalModel": "The projector’s ‘next frame’ bell. You move the puppets, then the browser paints. If the tab is in a drawer, the bell may slow down.",
  "how": [
    "function loop(t) { draw(t); id = requestAnimationFrame(loop); }.",
    "Cancel on unmount.",
    "Measure DOM first, then write (avoid layout thrash).",
    "Do not rAF a network poll.",
    "Fallback to setTimeout only if rAF missing."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Starting a new rAF loop every scroll event without canceling — stacked loops burn CPU.",
    "variant": "warning"
  },
  "example": "let id = 0;\nfunction loop(ts) {\n  if (ts < 48) id = requestAnimationFrame(loop);\n  else console.log('done', ts);\n}\nid = requestAnimationFrame(loop);\n// cancelAnimationFrame(id);\n",
  "exampleCaption": "rAF chain until timestamp ≥ 48ms",
  "internals": [
    "HTML event loop: run animation frame callbacks, then render.",
    "Timestamp is time origin + elapsed (DOMHighResTimeStamp).",
    "Multiple callbacks in one frame share the same timestamp approximately."
  ],
  "takeaways": [
    "function loop(t) { draw(t); id = requestAnimationFrame(loop); }.",
    "Cancel on unmount.",
    "Starting a new rAF loop every scroll event without canceling — stacked loops burn CPU.",
    "HTML event loop: run animation frame callbacks, then render."
  ],
  "revision": [
    "requestAnimationFrame: The projector’s ‘next frame’ bell. You move the puppets, then the browser paints. If the tab is in a drawer, the bell may slow down.",
    "function loop(t) { draw(t); id = requestAnimationFrame(loop); }.",
    "Cancel on unmount.",
    "Measure DOM first, then write (avoid layout thrash).",
    "Trap: Starting a new rAF loop every scroll event without canceling — stacked loops burn CPU."
  ],
  "flashcards": [
    [
      "requestAnimationFrame",
      "requestAnimationFrame(callback) runs before the next paint with a high-res timestamp."
    ],
    [
      "Mental model",
      "The projector’s ‘next frame’ bell. You move the puppets, then the browser paints. If the tab is in a drawer, the bell may slow down."
    ],
    [
      "Common trap",
      "Starting a new rAF loop every scroll event without canceling — stacked loops burn CPU."
    ],
    [
      "function loop(t) { draw(t); id = requestAnimationFrame(loop); }.",
      "Cancel on unmount."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is requestAnimationFrame and where does a beginner first see it?",
      "answerHint": "requestAnimationFrame(callback) runs before the next paint with a high-res timestamp. Use it to mutate DOM/canvas once per frame. cancelAnimationFrame(id) stops a loop. It pauses in background tabs (often). Timestamp is not ‘16.67ms guaranteed.’ Pair with CSS transforms for cheap visual changes. This is the browser paint-aligned scheduler."
    },
    {
      "level": "intermediate",
      "question": "Walk through how requestAnimationFrame works and name the main pitfall.",
      "answerHint": "function loop(t) { draw(t); id = requestAnimationFrame(loop); }. Cancel on unmount. Measure DOM first, then write (avoid layout thrash). Do not rAF a network poll. Fallback to setTimeout only if rAF missing. Pitfall: Starting a new rAF loop every scroll event without canceling — stacked loops burn CPU."
    },
    {
      "level": "advanced",
      "question": "How would you explain requestAnimationFrame at an interview, including engine/spec details?",
      "answerHint": "HTML event loop: run animation frame callbacks, then render. Timestamp is time origin + elapsed (DOMHighResTimeStamp). Multiple callbacks in one frame share the same timestamp approximately."
    }
  ],
  "pitfalls": [
    "Starting a new rAF loop every scroll event without canceling — stacked loops burn CPU.",
    "Fallback to setTimeout only if rAF missing."
  ],
  "interview": {
    "expectations": [
      "Explain requestAnimationFrame without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HTML event loop: run animation frame callbacks, then render."
    ],
    "commonQuestions": [
      "What is requestAnimationFrame?",
      "Why does JavaScript requestanimationframe behave this way?",
      "What is the classic requestAnimationFrame interview trap?"
    ],
    "traps": [
      "Starting a new rAF loop every scroll event without canceling — stacked loops burn CPU."
    ],
    "misconceptions": [
      "setTimeout(16) is not vsync and drifts. rAF exists so animations sample once per refresh and stop wasting CPU when hidden."
    ],
    "strongSignals": [
      "Separates requestAnimationFrame from lookalike APIs and can draw the mental model."
    ]
  }
})
