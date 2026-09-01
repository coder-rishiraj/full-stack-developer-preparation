import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "push / pop / shift / unshift",
  "whatIsIt": "push adds at the end; pop removes the end. unshift adds at the front; shift removes the front. Front operations are O(n) because indexes must slide. push/pop are O(1) amortized. They return length (push/unshift) or the removed element (pop/shift). They mutate.",
  "whyExists": "Stacks (push/pop) and queues (push/shift) are built from these four. Arrays expose both ends.",
  "mentalModel": "A line of people: push/pop at the tail is cheap; shift/unshift at the head makes everyone change numbers.",
  "how": [
    "Stack: push/pop.",
    "Queue: use a dedicated deque if shift is hot.",
    "unshift(...items) like push can take many args.",
    "Empty pop/shift returns undefined."
  ],
  "callout": {
    "title": "Watch for",
    "text": "push returns a number, so arr = arr.push(x) replaces the array with a length.",
    "variant": "warning"
  },
  "example": "const stack = [];\nstack.push(1, 2);\nconsole.log(stack.pop(), stack);\nconst q = [1, 2, 3];\nconsole.log(q.shift(), q);\nq.unshift(0);\nconsole.log(q);\nconsole.log([].pop());\n",
  "exampleCaption": "Stack push/pop vs queue shift/unshift",
  "internals": [
    "unshift/shift update every index — specified as a loop.",
    "length is adjusted; holes move with indexes.",
    "Multiple args to push are appended in order."
  ],
  "takeaways": [
    "Stack: push/pop.",
    "Queue: use a dedicated deque if shift is hot.",
    "push returns a number, so arr = arr.push(x) replaces the array with a length.",
    "unshift/shift update every index — specified as a loop."
  ],
  "revision": [
    "push / pop / shift / unshift: A line of people: push/pop at the tail is cheap; shift/unshift at the head makes everyone change numbers.",
    "Stack: push/pop.",
    "Queue: use a dedicated deque if shift is hot.",
    "unshift(...items) like push can take many args.",
    "Trap: push returns a number, so arr = arr.push(x) replaces the array with a length."
  ],
  "flashcards": [
    [
      "push / pop / shift / unshift",
      "push adds at the end; pop removes the end."
    ],
    [
      "Mental model",
      "A line of people: push/pop at the tail is cheap; shift/unshift at the head makes everyone change numbers."
    ],
    [
      "Common trap",
      "push returns a number, so arr = arr.push(x) replaces the array with a length."
    ],
    [
      "Stack: push/pop.",
      "Queue: use a dedicated deque if shift is hot."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is push / pop / shift / unshift and where does a beginner first see it?",
      "answerHint": "push adds at the end; pop removes the end. unshift adds at the front; shift removes the front. Front operations are O(n) because indexes must slide. push/pop are O(1) amortized. They return length (push/unshift) or the removed element (pop/shift). They mutate."
    },
    {
      "level": "intermediate",
      "question": "Walk through how push / pop / shift / unshift works and name the main pitfall.",
      "answerHint": "Stack: push/pop. Queue: use a dedicated deque if shift is hot. unshift(...items) like push can take many args. Empty pop/shift returns undefined. Pitfall: push returns a number, so arr = arr.push(x) replaces the array with a length."
    },
    {
      "level": "advanced",
      "question": "How would you explain push / pop / shift / unshift at an interview, including engine/spec details?",
      "answerHint": "unshift/shift update every index — specified as a loop. length is adjusted; holes move with indexes. Multiple args to push are appended in order."
    }
  ],
  "pitfalls": [
    "push returns a number, so arr = arr.push(x) replaces the array with a length.",
    "Empty pop/shift returns undefined."
  ],
  "interview": {
    "expectations": [
      "Explain push / pop / shift / unshift without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "unshift/shift update every index — specified as a loop."
    ],
    "commonQuestions": [
      "What is push / pop / shift / unshift?",
      "Why does JavaScript push / pop / shift / unshift behave this way?",
      "What is the classic push / pop / shift / unshift interview trap?"
    ],
    "traps": [
      "push returns a number, so arr = arr.push(x) replaces the array with a length."
    ],
    "misconceptions": [
      "Stacks (push/pop) and queues (push/shift) are built from these four. Arrays expose both ends."
    ],
    "strongSignals": [
      "Separates push / pop / shift / unshift from lookalike APIs and can draw the mental model."
    ]
  }
})
