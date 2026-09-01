import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Custom Events",
  "whatIsIt": "CustomEvent lets you dispatch named events with a detail payload: new CustomEvent('cart:add', { detail: { id }, bubbles: true }). Listeners use addEventListener('cart:add', e => e.detail). Use for loosely coupled components on the DOM tree. Native Event also works without detail. They do not cross iframe/realms without more plumbing.",
  "whyExists": "Components needed a pub/sub that rides the same capture/bubble path as clicks, without a global event bus import.",
  "mentalModel": "A homemade letter with a detail pocket, mailed through the DOM tree if bubbles is true.",
  "how": [
    "new CustomEvent(name, { detail, bubbles, cancelable }).",
    "element.dispatchEvent(ev).",
    "Listen on a common ancestor for bubbled custom events.",
    "Do not use for cross-tab (use BroadcastChannel).",
    "Name with a namespace prefix to avoid clashing with future HTML events."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Forgetting bubbles: true and listening on document — the event never gets there.",
    "variant": "warning"
  },
  "example": "const host = document.createElement('div');\nhost.addEventListener('cart:add', (e) => console.log(e.detail.id));\nhost.dispatchEvent(new CustomEvent('cart:add', { detail: { id: 7 }, bubbles: true }));\ndocument.body?.append(host);\nhost.remove();\n",
  "exampleCaption": "CustomEvent with detail on a host element",
  "internals": [
    "CustomEvent.detail is specified in the DOM spec.",
    "dispatchEvent runs listeners synchronously on the current stack.",
    "composed: true is needed to cross shadow DOM."
  ],
  "takeaways": [
    "new CustomEvent(name, { detail, bubbles, cancelable }).",
    "element.dispatchEvent(ev).",
    "Forgetting bubbles: true and listening on document — the event never gets there.",
    "CustomEvent.detail is specified in the DOM spec."
  ],
  "revision": [
    "Custom Events: A homemade letter with a detail pocket, mailed through the DOM tree if bubbles is true.",
    "new CustomEvent(name, { detail, bubbles, cancelable }).",
    "element.dispatchEvent(ev).",
    "Listen on a common ancestor for bubbled custom events.",
    "Trap: Forgetting bubbles: true and listening on document — the event never gets there."
  ],
  "flashcards": [
    [
      "Custom Events",
      "CustomEvent lets you dispatch named events with a detail payload: new CustomEvent('cart:add', { detail: { id }, bubbles: true })."
    ],
    [
      "Mental model",
      "A homemade letter with a detail pocket, mailed through the DOM tree if bubbles is true."
    ],
    [
      "Common trap",
      "Forgetting bubbles: true and listening on document — the event never gets there."
    ],
    [
      "new CustomEvent(name, { detail, bubbles, cancelable }).",
      "element.dispatchEvent(ev)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Custom Events and where does a beginner first see it?",
      "answerHint": "CustomEvent lets you dispatch named events with a detail payload: new CustomEvent('cart:add', { detail: { id }, bubbles: true }). Listeners use addEventListener('cart:add', e => e.detail). Use for loosely coupled components on the DOM tree. Native Event also works without detail. They do not cross iframe/realms without more plumbing."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Custom Events works and name the main pitfall.",
      "answerHint": "new CustomEvent(name, { detail, bubbles, cancelable }). element.dispatchEvent(ev). Listen on a common ancestor for bubbled custom events. Do not use for cross-tab (use BroadcastChannel). Name with a namespace prefix to avoid clashing with future HTML events. Pitfall: Forgetting bubbles: true and listening on document — the event never gets there."
    },
    {
      "level": "advanced",
      "question": "How would you explain Custom Events at an interview, including engine/spec details?",
      "answerHint": "CustomEvent.detail is specified in the DOM spec. dispatchEvent runs listeners synchronously on the current stack. composed: true is needed to cross shadow DOM."
    }
  ],
  "pitfalls": [
    "Forgetting bubbles: true and listening on document — the event never gets there.",
    "Name with a namespace prefix to avoid clashing with future HTML events."
  ],
  "interview": {
    "expectations": [
      "Explain Custom Events without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "CustomEvent.detail is specified in the DOM spec."
    ],
    "commonQuestions": [
      "What is Custom Events?",
      "Why does JavaScript custom events behave this way?",
      "What is the classic Custom Events interview trap?"
    ],
    "traps": [
      "Forgetting bubbles: true and listening on document — the event never gets there."
    ],
    "misconceptions": [
      "Components needed a pub/sub that rides the same capture/bubble path as clicks, without a global event bus import."
    ],
    "strongSignals": [
      "Separates Custom Events from lookalike APIs and can draw the mental model."
    ]
  }
})
