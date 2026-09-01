import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "addEventListener",
  "whatIsIt": "addEventListener(type, listener, options) registers a callback on an EventTarget (element, document, window, xhr). The browser calls it with an Event when that event fires. options: capture, once, passive, signal. removeEventListener needs the same function identity and capture flag. Events propagate capture→target→bubble unless stopped.",
  "whyExists": "Clicks, input, and load are the original reason JS is in the browser. The listener list is how the page reacts without polling.",
  "mentalModel": "A mailbox on the node. The browser delivers Event letters down from window (capture) then back up (bubble). once is a self-stamped envelope.",
  "how": [
    "addEventListener('click', fn) not onclick = if you need many handlers.",
    "Keep fn identity for remove, or pass { signal } from AbortController.",
    "event.preventDefault() vs stopPropagation().",
    "passive: true on touch/wheel for scroll performance.",
    "this in a classic function listener is the currentTarget."
  ],
  "callout": {
    "title": "Watch for",
    "text": "removeEventListener('click', fn.bind(this)) never removes the original — different identity.",
    "variant": "warning"
  },
  "example": "const btn = document.createElement('button');\nconst ac = new AbortController();\nfunction onClick(e) { console.log(e.type, e.currentTarget === btn); }\nbtn.addEventListener('click', onClick, { signal: ac.signal });\nbtn.dispatchEvent(new Event('click'));\nac.abort();\n",
  "exampleCaption": "Listener with AbortSignal; dispatchEvent for a test click",
  "internals": [
    "EventTarget listener lists in the DOM spec.",
    "dispatchEvent is synchronous; the rest of the event loop waits.",
    "Synthetic events vs trusted user events (isTrusted)."
  ],
  "takeaways": [
    "addEventListener('click', fn) not onclick = if you need many handlers.",
    "Keep fn identity for remove, or pass { signal } from AbortController.",
    "removeEventListener('click', fn.bind(this)) never removes the original — different identity.",
    "EventTarget listener lists in the DOM spec."
  ],
  "revision": [
    "addEventListener: A mailbox on the node. The browser delivers Event letters down from window (capture) then back up (bubble). once is a self-stamped envelope.",
    "addEventListener('click', fn) not onclick = if you need many handlers.",
    "Keep fn identity for remove, or pass { signal } from AbortController.",
    "event.preventDefault() vs stopPropagation().",
    "Trap: removeEventListener('click', fn.bind(this)) never removes the original — different identity."
  ],
  "flashcards": [
    [
      "addEventListener",
      "addEventListener(type, listener, options) registers a callback on an EventTarget (element, document, window, xhr)."
    ],
    [
      "Mental model",
      "A mailbox on the node. The browser delivers Event letters down from window (capture) then back up (bubble). once is a self-stamped envelope."
    ],
    [
      "Common trap",
      "removeEventListener('click', fn.bind(this)) never removes the original — different identity."
    ],
    [
      "addEventListener('click', fn) not onclick = if you need many handlers.",
      "Keep fn identity for remove, or pass { signal } from AbortController."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is addEventListener and where does a beginner first see it?",
      "answerHint": "addEventListener(type, listener, options) registers a callback on an EventTarget (element, document, window, xhr). The browser calls it with an Event when that event fires. options: capture, once, passive, signal. removeEventListener needs the same function identity and capture flag. Events propagate capture→target→bubble unless stopped."
    },
    {
      "level": "intermediate",
      "question": "Walk through how addEventListener works and name the main pitfall.",
      "answerHint": "addEventListener('click', fn) not onclick = if you need many handlers. Keep fn identity for remove, or pass { signal } from AbortController. event.preventDefault() vs stopPropagation(). passive: true on touch/wheel for scroll performance. this in a classic function listener is the currentTarget. Pitfall: removeEventListener('click', fn.bind(this)) never removes the original — different identity."
    },
    {
      "level": "advanced",
      "question": "How would you explain addEventListener at an interview, including engine/spec details?",
      "answerHint": "EventTarget listener lists in the DOM spec. dispatchEvent is synchronous; the rest of the event loop waits. Synthetic events vs trusted user events (isTrusted)."
    }
  ],
  "pitfalls": [
    "removeEventListener('click', fn.bind(this)) never removes the original — different identity.",
    "this in a classic function listener is the currentTarget."
  ],
  "interview": {
    "expectations": [
      "Explain addEventListener without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "EventTarget listener lists in the DOM spec."
    ],
    "commonQuestions": [
      "What is addEventListener?",
      "Why does JavaScript addeventlistener behave this way?",
      "What is the classic addEventListener interview trap?"
    ],
    "traps": [
      "removeEventListener('click', fn.bind(this)) never removes the original — different identity."
    ],
    "misconceptions": [
      "Clicks, input, and load are the original reason JS is in the browser. The listener list is how the page reacts without polling."
    ],
    "strongSignals": [
      "Separates addEventListener from lookalike APIs and can draw the mental model."
    ]
  }
})
