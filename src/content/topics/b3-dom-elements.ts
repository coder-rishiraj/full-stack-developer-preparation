import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "DOM Elements",
  "whatIsIt": "DOM elements are host objects implementing the Element/HTMLElement interfaces: a live tree of nodes (element, text, comment) under document. You create with document.createElement, query with querySelector/All, and insert with append/prepend/before/after. The tree is not a JS array; live NodeLists can change as the DOM changes. This is a Web API, not ECMAScript.",
  "whyExists": "HTML needed a programmable document. The DOM is that tree exposed to JS so UIs can update without full page reloads.",
  "mentalModel": "A live tree of boxes (elements) with attributes and kids. JS holds pointers into the tree; mutating the pointer’s node mutates what the user sees after the next paint.",
  "how": [
    "document.querySelector('#id') for one; querySelectorAll for a static NodeList from that API.",
    "createElement + append to build.",
    "textContent vs innerHTML (XSS).",
    "Do not copy DOM nodes with spread expecting elements to clone — use cloneNode.",
    "iframe has a different document."
  ],
  "callout": {
    "title": "Watch for",
    "text": "innerHTML with user strings is XSS. Prefer textContent or sanitizers.",
    "variant": "warning"
  },
  "example": "const el = document.createElement('button');\nel.textContent = 'Save';\nel.setAttribute('type', 'button');\ndocument.body?.append(el);\nconst found = document.querySelector('button');\nconsole.log(found?.textContent, found === el);\nel.remove();\n",
  "exampleCaption": "createElement, append, query, remove",
  "internals": [
    "Nodes are host objects; each has a wrapper in the JS heap.",
    "Live HTMLCollection vs static NodeList (querySelectorAll is static).",
    "The rendering pipeline (style/layout/paint) runs in the browser event loop, not in ECMA-262."
  ],
  "takeaways": [
    "document.querySelector('#id') for one; querySelectorAll for a static NodeList from that API.",
    "createElement + append to build.",
    "innerHTML with user strings is XSS. Prefer textContent or sanitizers.",
    "Nodes are host objects; each has a wrapper in the JS heap."
  ],
  "revision": [
    "DOM Elements: A live tree of boxes (elements) with attributes and kids. JS holds pointers into the tree; mutating the pointer’s node mutates what the user sees after the next paint.",
    "document.querySelector('#id') for one; querySelectorAll for a static NodeList from that API.",
    "createElement + append to build.",
    "textContent vs innerHTML (XSS).",
    "Trap: innerHTML with user strings is XSS. Prefer textContent or sanitizers."
  ],
  "flashcards": [
    [
      "DOM Elements",
      "DOM elements are host objects implementing the Element/HTMLElement interfaces: a live tree of nodes (element, text, comment) under document."
    ],
    [
      "Mental model",
      "A live tree of boxes (elements) with attributes and kids. JS holds pointers into the tree; mutating the pointer’s node mutates what the user sees after the next paint."
    ],
    [
      "Common trap",
      "innerHTML with user strings is XSS. Prefer textContent or sanitizers."
    ],
    [
      "document.querySelector('#id') for one; querySelectorAll for a static NodeList fr",
      "createElement + append to build."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is DOM Elements and where does a beginner first see it?",
      "answerHint": "DOM elements are host objects implementing the Element/HTMLElement interfaces: a live tree of nodes (element, text, comment) under document. You create with document.createElement, query with querySelector/All, and insert with append/prepend/before/after. The tree is not a JS array; live NodeLists can change as the DOM changes. This is a Web API, not ECMAScript."
    },
    {
      "level": "intermediate",
      "question": "Walk through how DOM Elements works and name the main pitfall.",
      "answerHint": "document.querySelector('#id') for one; querySelectorAll for a static NodeList from that API. createElement + append to build. textContent vs innerHTML (XSS). Do not copy DOM nodes with spread expecting elements to clone — use cloneNode. iframe has a different document. Pitfall: innerHTML with user strings is XSS. Prefer textContent or sanitizers."
    },
    {
      "level": "advanced",
      "question": "How would you explain DOM Elements at an interview, including engine/spec details?",
      "answerHint": "Nodes are host objects; each has a wrapper in the JS heap. Live HTMLCollection vs static NodeList (querySelectorAll is static). The rendering pipeline (style/layout/paint) runs in the browser event loop, not in ECMA-262."
    }
  ],
  "pitfalls": [
    "innerHTML with user strings is XSS. Prefer textContent or sanitizers.",
    "iframe has a different document."
  ],
  "interview": {
    "expectations": [
      "Explain DOM Elements without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Nodes are host objects; each has a wrapper in the JS heap."
    ],
    "commonQuestions": [
      "What is DOM Elements?",
      "Why does JavaScript dom elements behave this way?",
      "What is the classic DOM Elements interview trap?"
    ],
    "traps": [
      "innerHTML with user strings is XSS. Prefer textContent or sanitizers."
    ],
    "misconceptions": [
      "HTML needed a programmable document. The DOM is that tree exposed to JS so UIs can update without full page reloads."
    ],
    "strongSignals": [
      "Separates DOM Elements from lookalike APIs and can draw the mental model."
    ]
  }
})
