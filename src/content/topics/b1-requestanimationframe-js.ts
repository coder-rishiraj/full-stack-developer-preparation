import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "requestAnimationFrame (Language View)",
  "whatIsIt": "From the language’s view, requestAnimationFrame(cb) is a host function that schedules cb before the next repaint with a timestamp. It is a different queue from timeouts (animation frame callbacks). In Node it may be missing or polyfilled. This topic is the scheduling idea; the browser paint pipeline is B3.",
  "whyExists": "Timers are not vsync-aligned. rAF exists so JS can mutate the DOM once per frame without overproducing.",
  "mentalModel": "‘Call me when you are about to paint.’ Not ‘call me in 16ms’ exactly.",
  "how": [
    "Schedule the next frame at the end of cb for loops.",
    "cancelAnimationFrame(id) on stop.",
    "Do not do heavy CPU in rAF — you miss frames.",
    "Feature-detect in non-browser runtimes."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using setTimeout(16) as fake rAF — it drifts and is not paint-aligned.",
    "variant": "warning"
  },
  "example": "let id;\nfunction loop(ts) {\n  console.log('frame', ts);\n  if (ts < 100) id = requestAnimationFrame(loop);\n}\nif (typeof requestAnimationFrame === 'function') {\n  id = requestAnimationFrame(loop);\n} else {\n  console.log('no rAF in this host');\n}\n",
  "exampleCaption": "rAF loop with timestamp; host may lack it",
  "internals": [
    "HTML: animation frame callbacks run before rendering in the event loop.",
    "Timestamp is DOMHighResTimeStamp relative to time origin.",
    "Multiple rAFs in one frame all run in that frame’s callback list."
  ],
  "takeaways": [
    "Schedule the next frame at the end of cb for loops.",
    "cancelAnimationFrame(id) on stop.",
    "Using setTimeout(16) as fake rAF — it drifts and is not paint-aligned.",
    "HTML: animation frame callbacks run before rendering in the event loop."
  ],
  "revision": [
    "requestAnimationFrame (Language View): ‘Call me when you are about to paint.’ Not ‘call me in 16ms’ exactly.",
    "Schedule the next frame at the end of cb for loops.",
    "cancelAnimationFrame(id) on stop.",
    "Do not do heavy CPU in rAF — you miss frames.",
    "Trap: Using setTimeout(16) as fake rAF — it drifts and is not paint-aligned."
  ],
  "flashcards": [
    [
      "requestAnimationFrame (Language View)",
      "From the language’s view, requestAnimationFrame(cb) is a host function that schedules cb before the next repaint with a timestamp."
    ],
    [
      "Mental model",
      "‘Call me when you are about to paint.’ Not ‘call me in 16ms’ exactly."
    ],
    [
      "Common trap",
      "Using setTimeout(16) as fake rAF — it drifts and is not paint-aligned."
    ],
    [
      "Schedule the next frame at the end of cb for loops.",
      "cancelAnimationFrame(id) on stop."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is requestAnimationFrame (Language View) and where does a beginner first see it?",
      "answerHint": "From the language’s view, requestAnimationFrame(cb) is a host function that schedules cb before the next repaint with a timestamp. It is a different queue from timeouts (animation frame callbacks). In Node it may be missing or polyfilled. This topic is the scheduling idea; the browser paint pipeline is B3."
    },
    {
      "level": "intermediate",
      "question": "Walk through how requestAnimationFrame (Language View) works and name the main pitfall.",
      "answerHint": "Schedule the next frame at the end of cb for loops. cancelAnimationFrame(id) on stop. Do not do heavy CPU in rAF — you miss frames. Feature-detect in non-browser runtimes. Pitfall: Using setTimeout(16) as fake rAF — it drifts and is not paint-aligned."
    },
    {
      "level": "advanced",
      "question": "How would you explain requestAnimationFrame (Language View) at an interview, including engine/spec details?",
      "answerHint": "HTML: animation frame callbacks run before rendering in the event loop. Timestamp is DOMHighResTimeStamp relative to time origin. Multiple rAFs in one frame all run in that frame’s callback list."
    }
  ],
  "pitfalls": [
    "Using setTimeout(16) as fake rAF — it drifts and is not paint-aligned.",
    "Feature-detect in non-browser runtimes."
  ],
  "interview": {
    "expectations": [
      "Explain requestAnimationFrame (Language View) without mixing it up with a nearby B1.27 — Timers & Scheduling topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HTML: animation frame callbacks run before rendering in the event loop."
    ],
    "commonQuestions": [
      "What is requestAnimationFrame (Language View)?",
      "Why does JavaScript requestanimationframe (language view) behave this way?",
      "What is the classic requestAnimationFrame (Language View) interview trap?"
    ],
    "traps": [
      "Using setTimeout(16) as fake rAF — it drifts and is not paint-aligned."
    ],
    "misconceptions": [
      "Timers are not vsync-aligned. rAF exists so JS can mutate the DOM once per frame without overproducing."
    ],
    "strongSignals": [
      "Separates requestAnimationFrame (Language View) from lookalike APIs and can draw the mental model."
    ]
  }
})
