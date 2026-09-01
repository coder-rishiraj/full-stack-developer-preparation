import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Inline Scripts",
  "whatIsIt": "Inline scripts are JS source sitting between <script> tags in HTML. They run immediately when the parser reaches them (unless type=module). They can see DOM nodes parsed so far, and they historically used document.write during parse.",
  "whyExists": "Tiny snippets (boot config, critical path) need zero extra HTTP request. Inline also lets servers inject per-request values.",
  "mentalModel": "The HTML file itself is the JS file for a moment. Whatever nodes exist above the tag already exist; nodes below do not yet.",
  "how": [
    "Place inline scripts after the DOM they need, or wait for DOMContentLoaded.",
    "Avoid huge inline bundles: they skip cache and block parsing.",
    "Content-Security-Policy often bans inline unless you use hashes/nonces.",
    "type=module inline still defers and is strict-mode."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Referencing an element defined later in the HTML yields null — the parser has not created that node yet.",
    "variant": "warning"
  },
  "example": "// Imagine this lives in index.html after <h1>\nconst h1 = document.querySelector('h1');\nconsole.log(h1 ? h1.textContent : 'h1 not parsed yet');\nconst later = document.querySelector('footer');\nconsole.log(later); // null if footer is below this script",
  "exampleCaption": "Inline script sees DOM above it only",
  "internals": [
    "Parser-inserted classic scripts run in the document’s classic script context.",
    "Inline module scripts are still unique per element; they do not share a URL module map entry like src modules.",
    "CSP script-src must allow the exact hash of inline source or a nonce on the tag."
  ],
  "takeaways": [
    "Place inline scripts after the DOM they need, or wait for DOMContentLoaded.",
    "Avoid huge inline bundles: they skip cache and block parsing.",
    "Referencing an element defined later in the HTML yields null — the parser has not created that node yet.",
    "Parser-inserted classic scripts run in the document’s classic script context."
  ],
  "revision": [
    "Inline Scripts: The HTML file itself is the JS file for a moment. Whatever nodes exist above the tag already exist; nodes below do not yet.",
    "Place inline scripts after the DOM they need, or wait for DOMContentLoaded.",
    "Avoid huge inline bundles: they skip cache and block parsing.",
    "Content-Security-Policy often bans inline unless you use hashes/nonces.",
    "Trap: Referencing an element defined later in the HTML yields null — the parser has not created that node yet."
  ],
  "flashcards": [
    [
      "Inline Scripts",
      "Inline scripts are JS source sitting between <script> tags in HTML."
    ],
    [
      "Mental model",
      "The HTML file itself is the JS file for a moment. Whatever nodes exist above the tag already exist; nodes below do not yet."
    ],
    [
      "Common trap",
      "Referencing an element defined later in the HTML yields null — the parser has not created that node yet."
    ],
    [
      "Place inline scripts after the DOM they need, or wait for DOMContentLoaded.",
      "Avoid huge inline bundles: they skip cache and block parsing."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Inline Scripts and where does a beginner first see it?",
      "answerHint": "Inline scripts are JS source sitting between <script> tags in HTML. They run immediately when the parser reaches them (unless type=module). They can see DOM nodes parsed so far, and they historically used document.write during parse."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Inline Scripts works and name the main pitfall.",
      "answerHint": "Place inline scripts after the DOM they need, or wait for DOMContentLoaded. Avoid huge inline bundles: they skip cache and block parsing. Content-Security-Policy often bans inline unless you use hashes/nonces. type=module inline still defers and is strict-mode. Pitfall: Referencing an element defined later in the HTML yields null — the parser has not created that node yet."
    },
    {
      "level": "advanced",
      "question": "How would you explain Inline Scripts at an interview, including engine/spec details?",
      "answerHint": "Parser-inserted classic scripts run in the document’s classic script context. Inline module scripts are still unique per element; they do not share a URL module map entry like src modules. CSP script-src must allow the exact hash of inline source or a nonce on the tag."
    }
  ],
  "pitfalls": [
    "Referencing an element defined later in the HTML yields null — the parser has not created that node yet.",
    "type=module inline still defers and is strict-mode."
  ],
  "interview": {
    "expectations": [
      "Explain Inline Scripts without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Parser-inserted classic scripts run in the document’s classic script context."
    ],
    "commonQuestions": [
      "What is Inline Scripts?",
      "Why does JavaScript inline scripts behave this way?",
      "What is the classic Inline Scripts interview trap?"
    ],
    "traps": [
      "Referencing an element defined later in the HTML yields null — the parser has not created that node yet."
    ],
    "misconceptions": [
      "Tiny snippets (boot config, critical path) need zero extra HTTP request. Inline also lets servers inject per-request values."
    ],
    "strongSignals": [
      "Separates Inline Scripts from lookalike APIs and can draw the mental model."
    ]
  }
})
