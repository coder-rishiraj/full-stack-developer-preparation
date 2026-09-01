import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Run-to-Completion",
  "whatIsIt": "Run-to-completion means a JS task finishes its synchronous work before any other JS on that thread runs. No other event handler interleaves your for-loop. await yields, ending the current job. Shared variables are safe from parallel JS threads (unless Workers post). Long tasks delay everyone else.",
  "whyExists": "Without preemptive threads, you avoid data races in the language. The cost is jank if a task is long.",
  "mentalModel": "The bartender finishes your whole cocktail before taking the next order. A long recipe makes the line wait.",
  "how": [
    "Keep tasks short (chunk work, requestAnimationFrame, workers).",
    "You will not see another handler mutate state mid-loop on the same thread.",
    "Workers are other threads with copies/messages, not shared objects (except SAB).",
    "await is the polite yield."
  ],
  "callout": {
    "title": "Watch for",
    "text": "SharedArrayBuffer + Atomics is the exception — true parallel mutation is possible there.",
    "variant": "warning"
  },
  "example": "let n = 0;\nsetTimeout(() => { n = 99; }, 0);\nfor (let i = 0; i < 1e6; i++) n += 1;\nconsole.log('after loop', n);\nqueueMicrotask(() => console.log('micro', n));\n",
  "exampleCaption": "The loop finishes before the timeout can set n=99",
  "internals": [
    "A task is an atomic script execution from the host’s point of view.",
    "Microtasks still run-to-completion individually, chained after the task.",
    "Web Workers have their own loops and heaps."
  ],
  "takeaways": [
    "Keep tasks short (chunk work, requestAnimationFrame, workers).",
    "You will not see another handler mutate state mid-loop on the same thread.",
    "SharedArrayBuffer + Atomics is the exception — true parallel mutation is possible there.",
    "A task is an atomic script execution from the host’s point of view."
  ],
  "revision": [
    "Run-to-Completion: The bartender finishes your whole cocktail before taking the next order. A long recipe makes the line wait.",
    "Keep tasks short (chunk work, requestAnimationFrame, workers).",
    "You will not see another handler mutate state mid-loop on the same thread.",
    "Workers are other threads with copies/messages, not shared objects (except SAB).",
    "Trap: SharedArrayBuffer + Atomics is the exception — true parallel mutation is possible there."
  ],
  "flashcards": [
    [
      "Run-to-Completion",
      "Run-to-completion means a JS task finishes its synchronous work before any other JS on that thread runs."
    ],
    [
      "Mental model",
      "The bartender finishes your whole cocktail before taking the next order. A long recipe makes the line wait."
    ],
    [
      "Common trap",
      "SharedArrayBuffer + Atomics is the exception — true parallel mutation is possible there."
    ],
    [
      "Keep tasks short (chunk work, requestAnimationFrame, workers).",
      "You will not see another handler mutate state mid-loop on the same thread."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Run-to-Completion and where does a beginner first see it?",
      "answerHint": "Run-to-completion means a JS task finishes its synchronous work before any other JS on that thread runs. No other event handler interleaves your for-loop. await yields, ending the current job. Shared variables are safe from parallel JS threads (unless Workers post). Long tasks delay everyone else."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Run-to-Completion works and name the main pitfall.",
      "answerHint": "Keep tasks short (chunk work, requestAnimationFrame, workers). You will not see another handler mutate state mid-loop on the same thread. Workers are other threads with copies/messages, not shared objects (except SAB). await is the polite yield. Pitfall: SharedArrayBuffer + Atomics is the exception — true parallel mutation is possible there."
    },
    {
      "level": "advanced",
      "question": "How would you explain Run-to-Completion at an interview, including engine/spec details?",
      "answerHint": "A task is an atomic script execution from the host’s point of view. Microtasks still run-to-completion individually, chained after the task. Web Workers have their own loops and heaps."
    }
  ],
  "pitfalls": [
    "SharedArrayBuffer + Atomics is the exception — true parallel mutation is possible there.",
    "await is the polite yield."
  ],
  "interview": {
    "expectations": [
      "Explain Run-to-Completion without mixing it up with a nearby B1.26 — Event Loop topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "A task is an atomic script execution from the host’s point of view."
    ],
    "commonQuestions": [
      "What is Run-to-Completion?",
      "Why does JavaScript run-to-completion behave this way?",
      "What is the classic Run-to-Completion interview trap?"
    ],
    "traps": [
      "SharedArrayBuffer + Atomics is the exception — true parallel mutation is possible there."
    ],
    "misconceptions": [
      "Without preemptive threads, you avoid data races in the language. The cost is jank if a task is long."
    ],
    "strongSignals": [
      "Separates Run-to-Completion from lookalike APIs and can draw the mental model."
    ]
  }
})
