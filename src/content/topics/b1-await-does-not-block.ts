import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Why await Does Not Block the Runtime",
  "whatIsIt": "await yields the thread: the async function’s remainder is scheduled (microtask after a native promise). Other events, rendering, and other functions can run while you wait. A busy while() before await does block. await is not a kernel sleep that stops the process; Node can still exit if nothing else is pending.",
  "whyExists": "If await blocked the isolate, a single fetch would freeze the page. Yielding is the whole reason async exists.",
  "mentalModel": "You leave the counter; someone else is served; when your food is ready you come back. A tight loop is you never leaving.",
  "how": [
    "You can still freeze the page with sync CPU, not with await fetch.",
    "Workers for CPU; await for I/O.",
    "Do not spin-wait on a flag.",
    "In Node, keep a handle (server, timer) if you need the process alive."
  ],
  "callout": {
    "title": "Watch for",
    "text": "while(!done) {} waiting for a timeout to set done — the timeout never runs; you blocked the loop.",
    "variant": "warning"
  },
  "example": "console.log('A');\nconst p = Promise.resolve().then(() => console.log('C'));\nawait p;\nconsole.log('D');\nsetTimeout(() => console.log('E'), 0);\nconsole.log('B-ish after await of microtask');\n",
  "exampleCaption": "await yields; other jobs can run around it",
  "internals": [
    "Await: promise then jobs resume the async function via Resume.",
    "The stack of the original caller of the async function already continued (got a Promise).",
    "Host can paint between tasks, not in the middle of your sync CPU."
  ],
  "takeaways": [
    "You can still freeze the page with sync CPU, not with await fetch.",
    "Workers for CPU; await for I/O.",
    "while(!done) {} waiting for a timeout to set done — the timeout never runs; you blocked the loop.",
    "Await: promise then jobs resume the async function via Resume."
  ],
  "revision": [
    "Why await Does Not Block the Runtime: You leave the counter; someone else is served; when your food is ready you come back. A tight loop is you never leaving.",
    "You can still freeze the page with sync CPU, not with await fetch.",
    "Workers for CPU; await for I/O.",
    "Do not spin-wait on a flag.",
    "Trap: while(!done) {} waiting for a timeout to set done — the timeout never runs; you blocked the loop."
  ],
  "flashcards": [
    [
      "Why await Does Not Block the Runtime",
      "await yields the thread: the async function’s remainder is scheduled (microtask after a native promise)."
    ],
    [
      "Mental model",
      "You leave the counter; someone else is served; when your food is ready you come back. A tight loop is you never leaving."
    ],
    [
      "Common trap",
      "while(!done) {} waiting for a timeout to set done — the timeout never runs; you blocked the loop."
    ],
    [
      "You can still freeze the page with sync CPU, not with await fetch.",
      "Workers for CPU; await for I/O."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Why await Does Not Block the Runtime and where does a beginner first see it?",
      "answerHint": "await yields the thread: the async function’s remainder is scheduled (microtask after a native promise). Other events, rendering, and other functions can run while you wait. A busy while() before await does block. await is not a kernel sleep that stops the process; Node can still exit if nothing else is pending."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Why await Does Not Block the Runtime works and name the main pitfall.",
      "answerHint": "You can still freeze the page with sync CPU, not with await fetch. Workers for CPU; await for I/O. Do not spin-wait on a flag. In Node, keep a handle (server, timer) if you need the process alive. Pitfall: while(!done) {} waiting for a timeout to set done — the timeout never runs; you blocked the loop."
    },
    {
      "level": "advanced",
      "question": "How would you explain Why await Does Not Block the Runtime at an interview, including engine/spec details?",
      "answerHint": "Await: promise then jobs resume the async function via Resume. The stack of the original caller of the async function already continued (got a Promise). Host can paint between tasks, not in the middle of your sync CPU."
    }
  ],
  "pitfalls": [
    "while(!done) {} waiting for a timeout to set done — the timeout never runs; you blocked the loop.",
    "In Node, keep a handle (server, timer) if you need the process alive."
  ],
  "interview": {
    "expectations": [
      "Explain Why await Does Not Block the Runtime without mixing it up with a nearby B1.30 — Async/Await topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Await: promise then jobs resume the async function via Resume."
    ],
    "commonQuestions": [
      "What is Why await Does Not Block the Runtime?",
      "Why does JavaScript why await does not block the runtime behave this way?",
      "What is the classic Why await Does Not Block the Runtime interview trap?"
    ],
    "traps": [
      "while(!done) {} waiting for a timeout to set done — the timeout never runs; you blocked the loop."
    ],
    "misconceptions": [
      "If await blocked the isolate, a single fetch would freeze the page. Yielding is the whole reason async exists."
    ],
    "strongSignals": [
      "Separates Why await Does Not Block the Runtime from lookalike APIs and can draw the mental model."
    ]
  }
})
