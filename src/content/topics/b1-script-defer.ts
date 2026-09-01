import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "script defer",
  "whatIsIt": "defer downloads a classic script in parallel, then runs it after the document is fully parsed, in document order relative to other deferred scripts. DOMContentLoaded waits for deferred scripts. Modules behave similarly by default without the attribute.",
  "whyExists": "Apps need the full DOM and a stable order between files, without blocking the parser the way a naked src script does.",
  "mentalModel": "Download now, wait until the HTML is a complete tree, then run the queue in tag order — like boarding after the plane is fully loaded.",
  "how": [
    "Put defer on classic app scripts in <head>.",
    "They run before DOMContentLoaded, after parse.",
    "Order is preserved among deferred classic scripts.",
    "type=module is deferred automatically; extra defer is redundant."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Mixing a blocking script in the middle of deferred scripts still creates surprising order; keep one strategy.",
    "variant": "warning"
  },
  "example": "document.addEventListener('DOMContentLoaded', () => {\n  console.log('DOMContentLoaded — deferred scripts already ran');\n});\nconsole.log('deferred script, document is parsed:', document.body != null);\nconsole.log(document.querySelectorAll('section').length);",
  "exampleCaption": "A deferred script sees the full DOM",
  "internals": [
    "Deferred scripts run after parsing, before the DOMContentLoaded event is fired.",
    "The spec maintains an ordered list of scripts that will execute when parsing completes.",
    "defer on inline classic scripts is ignored — there is nothing to fetch."
  ],
  "takeaways": [
    "Put defer on classic app scripts in <head>.",
    "They run before DOMContentLoaded, after parse.",
    "Mixing a blocking script in the middle of deferred scripts still creates surprising order; keep one strategy.",
    "Deferred scripts run after parsing, before the DOMContentLoaded event is fired."
  ],
  "revision": [
    "script defer: Download now, wait until the HTML is a complete tree, then run the queue in tag order — like boarding after the plane is fully loaded.",
    "Put defer on classic app scripts in <head>.",
    "They run before DOMContentLoaded, after parse.",
    "Order is preserved among deferred classic scripts.",
    "Trap: Mixing a blocking script in the middle of deferred scripts still creates surprising order; keep one strategy."
  ],
  "flashcards": [
    [
      "script defer",
      "defer downloads a classic script in parallel, then runs it after the document is fully parsed, in document order relative to other deferred scripts."
    ],
    [
      "Mental model",
      "Download now, wait until the HTML is a complete tree, then run the queue in tag order — like boarding after the plane is fully loaded."
    ],
    [
      "Common trap",
      "Mixing a blocking script in the middle of deferred scripts still creates surprising order; keep one strategy."
    ],
    [
      "Put defer on classic app scripts in <head>.",
      "They run before DOMContentLoaded, after parse."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is script defer and where does a beginner first see it?",
      "answerHint": "defer downloads a classic script in parallel, then runs it after the document is fully parsed, in document order relative to other deferred scripts. DOMContentLoaded waits for deferred scripts. Modules behave similarly by default without the attribute."
    },
    {
      "level": "intermediate",
      "question": "Walk through how script defer works and name the main pitfall.",
      "answerHint": "Put defer on classic app scripts in <head>. They run before DOMContentLoaded, after parse. Order is preserved among deferred classic scripts. type=module is deferred automatically; extra defer is redundant. Pitfall: Mixing a blocking script in the middle of deferred scripts still creates surprising order; keep one strategy."
    },
    {
      "level": "advanced",
      "question": "How would you explain script defer at an interview, including engine/spec details?",
      "answerHint": "Deferred scripts run after parsing, before the DOMContentLoaded event is fired. The spec maintains an ordered list of scripts that will execute when parsing completes. defer on inline classic scripts is ignored — there is nothing to fetch."
    }
  ],
  "pitfalls": [
    "Mixing a blocking script in the middle of deferred scripts still creates surprising order; keep one strategy.",
    "type=module is deferred automatically; extra defer is redundant."
  ],
  "interview": {
    "expectations": [
      "Explain script defer without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Deferred scripts run after parsing, before the DOMContentLoaded event is fired."
    ],
    "commonQuestions": [
      "What is script defer?",
      "Why does JavaScript script defer behave this way?",
      "What is the classic script defer interview trap?"
    ],
    "traps": [
      "Mixing a blocking script in the middle of deferred scripts still creates surprising order; keep one strategy."
    ],
    "misconceptions": [
      "Apps need the full DOM and a stable order between files, without blocking the parser the way a naked src script does."
    ],
    "strongSignals": [
      "Separates script defer from lookalike APIs and can draw the mental model."
    ]
  }
})
