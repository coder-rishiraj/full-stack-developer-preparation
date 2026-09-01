import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Async Debugging",
  "whatIsIt": "Async debugging: DevTools can stitch async stacks (await, then, timeout). Pause on uncaught exceptions and on Promise rejections. Network tab shows fetch. ‘async’ call stacks are a debugger feature — the engine stack was empty between jobs. console.time around awaits measures wall clock, not CPU.",
  "whyExists": "The hard bugs are ‘wrong order of jobs,’ not a single sync stack. Tooling had to show the logical chain.",
  "mentalModel": "A photo album of stacks glued by the debugger, even though each job started from an empty JS stack.",
  "how": [
    "Enable async stack traces.",
    "Pause on rejected promises.",
    "Name your functions so async stacks are readable.",
    "Trace seq numbers for stale responses."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Reading only the top frame after await — you miss which caller scheduled the async function.",
    "variant": "warning"
  },
  "example": "async function load() {\n  await Promise.resolve();\n  throw new Error('after await');\n}\nload().catch((e) => console.log(e.stack));\n",
  "exampleCaption": "Stack after await — host may show async frames",
  "internals": [
    "V8 async stack captures the initiating stack when the promise is created/awaited.",
    "Unhandled rejection breakpoint is a host debugger hook.",
    "Microtask vs task is visible as separate traces without stitching."
  ],
  "takeaways": [
    "Enable async stack traces.",
    "Pause on rejected promises.",
    "Reading only the top frame after await — you miss which caller scheduled the async function.",
    "V8 async stack captures the initiating stack when the promise is created/awaited."
  ],
  "revision": [
    "Async Debugging: A photo album of stacks glued by the debugger, even though each job started from an empty JS stack.",
    "Enable async stack traces.",
    "Pause on rejected promises.",
    "Name your functions so async stacks are readable.",
    "Trap: Reading only the top frame after await — you miss which caller scheduled the async function."
  ],
  "flashcards": [
    [
      "Async Debugging",
      "Async debugging: DevTools can stitch async stacks (await, then, timeout)."
    ],
    [
      "Mental model",
      "A photo album of stacks glued by the debugger, even though each job started from an empty JS stack."
    ],
    [
      "Common trap",
      "Reading only the top frame after await — you miss which caller scheduled the async function."
    ],
    [
      "Enable async stack traces.",
      "Pause on rejected promises."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Async Debugging and where does a beginner first see it?",
      "answerHint": "Async debugging: DevTools can stitch async stacks (await, then, timeout). Pause on uncaught exceptions and on Promise rejections. Network tab shows fetch. ‘async’ call stacks are a debugger feature — the engine stack was empty between jobs. console.time around awaits measures wall clock, not CPU."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Async Debugging works and name the main pitfall.",
      "answerHint": "Enable async stack traces. Pause on rejected promises. Name your functions so async stacks are readable. Trace seq numbers for stale responses. Pitfall: Reading only the top frame after await — you miss which caller scheduled the async function."
    },
    {
      "level": "advanced",
      "question": "How would you explain Async Debugging at an interview, including engine/spec details?",
      "answerHint": "V8 async stack captures the initiating stack when the promise is created/awaited. Unhandled rejection breakpoint is a host debugger hook. Microtask vs task is visible as separate traces without stitching."
    }
  ],
  "pitfalls": [
    "Reading only the top frame after await — you miss which caller scheduled the async function.",
    "Trace seq numbers for stale responses."
  ],
  "interview": {
    "expectations": [
      "Explain Async Debugging without mixing it up with a nearby B1.33 — Debugging topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "V8 async stack captures the initiating stack when the promise is created/awaited."
    ],
    "commonQuestions": [
      "What is Async Debugging?",
      "Why does JavaScript async debugging behave this way?",
      "What is the classic Async Debugging interview trap?"
    ],
    "traps": [
      "Reading only the top frame after await — you miss which caller scheduled the async function."
    ],
    "misconceptions": [
      "The hard bugs are ‘wrong order of jobs,’ not a single sync stack. Tooling had to show the logical chain."
    ],
    "strongSignals": [
      "Separates Async Debugging from lookalike APIs and can draw the mental model."
    ]
  }
})
