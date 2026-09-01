import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "AbortController (Browser)",
  "whatIsIt": "In the browser, AbortController.abort() cancels fetch, streams, and addEventListener({signal}). AbortError (DOMException) is what fetch rejects with. One signal can be passed to many APIs. AbortSignal.timeout(ms) and any(signals) exist in newer browsers. This is the Web API; language-level cooperative cancel is the same token.",
  "whyExists": "SPA navigations and typeahead needed to cancel in-flight HTTP and listeners with one standard object.",
  "mentalModel": "A shared kill switch. Flip it; fetch aborts, listeners detach, your loops should check aborted.",
  "how": [
    "New controller per request generation.",
    "Pass signal into fetch and addEventListener.",
    "abort() in route unmount.",
    "if (signal.aborted) return before heavy work.",
    "timeout: AbortSignal.timeout(5000) or race your own."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Reusing one controller for the lifetime of the app — the first abort kills all future fetches using that signal.",
    "variant": "warning"
  },
  "example": "const c = new AbortController();\ndocument.addEventListener('click', () => console.log('click'), { signal: c.signal });\nfetch('/x', { signal: c.signal }).catch((e) => console.log(e.name));\nc.abort();\nconsole.log(c.signal.aborted);\n",
  "exampleCaption": "One abort drops a listener and a fetch",
  "internals": [
    "AbortSignal is an EventTarget; abort sets aborted and reason.",
    "Fetch aborts the underlying network as specified.",
    "Listener option signal unregisters on abort."
  ],
  "takeaways": [
    "New controller per request generation.",
    "Pass signal into fetch and addEventListener.",
    "Reusing one controller for the lifetime of the app — the first abort kills all future fetches using that signal.",
    "AbortSignal is an EventTarget; abort sets aborted and reason."
  ],
  "revision": [
    "AbortController (Browser): A shared kill switch. Flip it; fetch aborts, listeners detach, your loops should check aborted.",
    "New controller per request generation.",
    "Pass signal into fetch and addEventListener.",
    "abort() in route unmount.",
    "Trap: Reusing one controller for the lifetime of the app — the first abort kills all future fetches using that signal."
  ],
  "flashcards": [
    [
      "AbortController (Browser)",
      "In the browser, AbortController.abort() cancels fetch, streams, and addEventListener({signal})."
    ],
    [
      "Mental model",
      "A shared kill switch. Flip it; fetch aborts, listeners detach, your loops should check aborted."
    ],
    [
      "Common trap",
      "Reusing one controller for the lifetime of the app — the first abort kills all future fetches using that signal."
    ],
    [
      "New controller per request generation.",
      "Pass signal into fetch and addEventListener."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is AbortController (Browser) and where does a beginner first see it?",
      "answerHint": "In the browser, AbortController.abort() cancels fetch, streams, and addEventListener({signal}). AbortError (DOMException) is what fetch rejects with. One signal can be passed to many APIs. AbortSignal.timeout(ms) and any(signals) exist in newer browsers. This is the Web API; language-level cooperative cancel is the same token."
    },
    {
      "level": "intermediate",
      "question": "Walk through how AbortController (Browser) works and name the main pitfall.",
      "answerHint": "New controller per request generation. Pass signal into fetch and addEventListener. abort() in route unmount. if (signal.aborted) return before heavy work. timeout: AbortSignal.timeout(5000) or race your own. Pitfall: Reusing one controller for the lifetime of the app — the first abort kills all future fetches using that signal."
    },
    {
      "level": "advanced",
      "question": "How would you explain AbortController (Browser) at an interview, including engine/spec details?",
      "answerHint": "AbortSignal is an EventTarget; abort sets aborted and reason. Fetch aborts the underlying network as specified. Listener option signal unregisters on abort."
    }
  ],
  "pitfalls": [
    "Reusing one controller for the lifetime of the app — the first abort kills all future fetches using that signal.",
    "timeout: AbortSignal.timeout(5000) or race your own."
  ],
  "interview": {
    "expectations": [
      "Explain AbortController (Browser) without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "AbortSignal is an EventTarget; abort sets aborted and reason."
    ],
    "commonQuestions": [
      "What is AbortController (Browser)?",
      "Why does JavaScript abortcontroller (browser) behave this way?",
      "What is the classic AbortController (Browser) interview trap?"
    ],
    "traps": [
      "Reusing one controller for the lifetime of the app — the first abort kills all future fetches using that signal."
    ],
    "misconceptions": [
      "SPA navigations and typeahead needed to cancel in-flight HTTP and listeners with one standard object."
    ],
    "strongSignals": [
      "Separates AbortController (Browser) from lookalike APIs and can draw the mental model."
    ]
  }
})
