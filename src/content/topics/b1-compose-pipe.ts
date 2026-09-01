import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "compose / pipe",
  "whatIsIt": "compose(f,g)(x) is f(g(x)) — right to left. pipe(f,g)(x) is g(f(x)) — left to right, like a Unix pipe. Both are higher-order functions over unary functions. Async versions must return promises and await in order. Identity function is the empty pipe.",
  "whyExists": "Data transformation pipelines read better as a list of steps than nested calls. FP libraries standardized compose/pipe.",
  "mentalModel": "compose: Russian dolls (inside first). pipe: assembly line (first function is first station).",
  "how": [
    "Keep functions unary or use partial application.",
    "pipe is usually easier to read in application code.",
    "Do not compose functions with side-effect order surprises without documenting.",
    "Type the pipeline so steps’ output matches the next input."
  ],
  "callout": {
    "title": "Watch for",
    "text": "compose(f,g) vs pipe(f,g) reversed — the interview is which runs first.",
    "variant": "warning"
  },
  "example": "const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);\nconst pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);\nconst trim = (s) => s.trim();\nconst upper = (s) => s.toUpperCase();\nconst bang = (s) => s + '!';\nconsole.log(compose(bang, upper, trim)('  hi '));\nconsole.log(pipe(trim, upper, bang)('  hi '));\n",
  "exampleCaption": "compose right-to-left vs pipe left-to-right",
  "internals": [
    "reduce/reduceRight are just iteration; no special engine support.",
    "Each step’s return is the next Call’s argument.",
    "Async pipe is a sequential await in a for-loop, not Promise.all."
  ],
  "takeaways": [
    "Keep functions unary or use partial application.",
    "pipe is usually easier to read in application code.",
    "compose(f,g) vs pipe(f,g) reversed — the interview is which runs first.",
    "reduce/reduceRight are just iteration; no special engine support."
  ],
  "revision": [
    "compose / pipe: compose: Russian dolls (inside first). pipe: assembly line (first function is first station).",
    "Keep functions unary or use partial application.",
    "pipe is usually easier to read in application code.",
    "Do not compose functions with side-effect order surprises without documenting.",
    "Trap: compose(f,g) vs pipe(f,g) reversed — the interview is which runs first."
  ],
  "flashcards": [
    [
      "compose / pipe",
      "compose(f,g)(x) is f(g(x)) — right to left."
    ],
    [
      "Mental model",
      "compose: Russian dolls (inside first). pipe: assembly line (first function is first station)."
    ],
    [
      "Common trap",
      "compose(f,g) vs pipe(f,g) reversed — the interview is which runs first."
    ],
    [
      "Keep functions unary or use partial application.",
      "pipe is usually easier to read in application code."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is compose / pipe and where does a beginner first see it?",
      "answerHint": "compose(f,g)(x) is f(g(x)) — right to left. pipe(f,g)(x) is g(f(x)) — left to right, like a Unix pipe. Both are higher-order functions over unary functions. Async versions must return promises and await in order. Identity function is the empty pipe."
    },
    {
      "level": "intermediate",
      "question": "Walk through how compose / pipe works and name the main pitfall.",
      "answerHint": "Keep functions unary or use partial application. pipe is usually easier to read in application code. Do not compose functions with side-effect order surprises without documenting. Type the pipeline so steps’ output matches the next input. Pitfall: compose(f,g) vs pipe(f,g) reversed — the interview is which runs first."
    },
    {
      "level": "advanced",
      "question": "How would you explain compose / pipe at an interview, including engine/spec details?",
      "answerHint": "reduce/reduceRight are just iteration; no special engine support. Each step’s return is the next Call’s argument. Async pipe is a sequential await in a for-loop, not Promise.all."
    }
  ],
  "pitfalls": [
    "compose(f,g) vs pipe(f,g) reversed — the interview is which runs first.",
    "Type the pipeline so steps’ output matches the next input."
  ],
  "interview": {
    "expectations": [
      "Explain compose / pipe without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "reduce/reduceRight are just iteration; no special engine support."
    ],
    "commonQuestions": [
      "What is compose / pipe?",
      "Why does JavaScript compose / pipe behave this way?",
      "What is the classic compose / pipe interview trap?"
    ],
    "traps": [
      "compose(f,g) vs pipe(f,g) reversed — the interview is which runs first."
    ],
    "misconceptions": [
      "Data transformation pipelines read better as a list of steps than nested calls. FP libraries standardized compose/pipe."
    ],
    "strongSignals": [
      "Separates compose / pipe from lookalike APIs and can draw the mental model."
    ]
  }
})
