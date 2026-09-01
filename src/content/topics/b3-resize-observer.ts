import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Resize Observer",
  "whatIsIt": "ResizeObserver notifies when an Element’s content box (or border/device-pixel box) size changes, including first observe. Callback gets ResizeObserverEntry with contentRect / borderBoxSize. Better than window resize for component-level layout (charts, overflow). Avoid layout writes in the callback that resize the same element (loop notifications).",
  "whyExists": "window 'resize' missed CSS grid/flex children changing size. Elements needed their own size events.",
  "mentalModel": "A tape measure on a box that pings you when the numbers change — even if the window did not.",
  "how": [
    "new ResizeObserver(cb).observe(el, { box: 'border-box' }).",
    "unobserve/disconnect on unmount.",
    "Read sizes from the entry, not a fresh getBoundingClientRect storm if possible.",
    "Debounce extra work; the observer already batches.",
    "Watch for infinite resize loops."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Changing el.style in the callback based on width in a way that changes width again — notification loop (browser may error).",
    "variant": "warning"
  },
  "example": "const el = document.createElement('div');\nel.style.width = '100px';\nconst ro = new ResizeObserver((entries) => {\n  for (const e of entries) console.log(e.contentRect.width);\n});\ndocument.body?.append(el);\nro.observe(el);\nro.disconnect();\nel.remove();\n",
  "exampleCaption": "ResizeObserver on a div’s content box",
  "internals": [
    "Delivered as a resize observer “undelivered notifications” batch in the event loop.",
    "device-pixel-content-box is for canvas sharpness.",
    "SVG and tables have historically quirky box models."
  ],
  "takeaways": [
    "new ResizeObserver(cb).observe(el, { box: 'border-box' }).",
    "unobserve/disconnect on unmount.",
    "Changing el.style in the callback based on width in a way that changes width again — notification loop (browser may error).",
    "Delivered as a resize observer “undelivered notifications” batch in the event loop."
  ],
  "revision": [
    "Resize Observer: A tape measure on a box that pings you when the numbers change — even if the window did not.",
    "new ResizeObserver(cb).observe(el, { box: 'border-box' }).",
    "unobserve/disconnect on unmount.",
    "Read sizes from the entry, not a fresh getBoundingClientRect storm if possible.",
    "Trap: Changing el.style in the callback based on width in a way that changes width again — notification loop (browser may error)."
  ],
  "flashcards": [
    [
      "Resize Observer",
      "ResizeObserver notifies when an Element’s content box (or border/device-pixel box) size changes, including first observe."
    ],
    [
      "Mental model",
      "A tape measure on a box that pings you when the numbers change — even if the window did not."
    ],
    [
      "Common trap",
      "Changing el.style in the callback based on width in a way that changes width again — notification loop (browser may error)."
    ],
    [
      "new ResizeObserver(cb).observe(el, { box: 'border-box' }).",
      "unobserve/disconnect on unmount."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Resize Observer and where does a beginner first see it?",
      "answerHint": "ResizeObserver notifies when an Element’s content box (or border/device-pixel box) size changes, including first observe. Callback gets ResizeObserverEntry with contentRect / borderBoxSize. Better than window resize for component-level layout (charts, overflow). Avoid layout writes in the callback that resize the same element (loop notifications)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Resize Observer works and name the main pitfall.",
      "answerHint": "new ResizeObserver(cb).observe(el, { box: 'border-box' }). unobserve/disconnect on unmount. Read sizes from the entry, not a fresh getBoundingClientRect storm if possible. Debounce extra work; the observer already batches. Watch for infinite resize loops. Pitfall: Changing el.style in the callback based on width in a way that changes width again — notification loop (browser may error)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Resize Observer at an interview, including engine/spec details?",
      "answerHint": "Delivered as a resize observer “undelivered notifications” batch in the event loop. device-pixel-content-box is for canvas sharpness. SVG and tables have historically quirky box models."
    }
  ],
  "pitfalls": [
    "Changing el.style in the callback based on width in a way that changes width again — notification loop (browser may error).",
    "Watch for infinite resize loops."
  ],
  "interview": {
    "expectations": [
      "Explain Resize Observer without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Delivered as a resize observer “undelivered notifications” batch in the event loop."
    ],
    "commonQuestions": [
      "What is Resize Observer?",
      "Why does JavaScript resize observer behave this way?",
      "What is the classic Resize Observer interview trap?"
    ],
    "traps": [
      "Changing el.style in the callback based on width in a way that changes width again — notification loop (browser may error)."
    ],
    "misconceptions": [
      "window 'resize' missed CSS grid/flex children changing size. Elements needed their own size events."
    ],
    "strongSignals": [
      "Separates Resize Observer from lookalike APIs and can draw the mental model."
    ]
  }
})
