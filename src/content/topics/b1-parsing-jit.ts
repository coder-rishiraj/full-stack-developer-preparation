import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Parsing, AST, Interpreter, JIT",
  "whatIsIt": "Source is parsed to an AST then bytecode (or similar). An interpreter runs bytecode. Hot functions are JIT-compiled to machine code with type assumptions. If assumptions fail, the engine deoptimizes back to bytecode. Syntax errors happen at parse; TypeErrors at run.",
  "whyExists": "Start-up wants fast parse+interpret; long-running code wants machine code. JIT is the compromise.",
  "mentalModel": "First performance: careful reading (parse). Then walking (interpret). Then sprinting (JIT) until a pothole (deopt).",
  "how": [
    "Avoid eval/Function() — extra parse, harder optimize.",
    "Keep types stable in hot functions.",
    "Parse errors vs runtime errors are different stages.",
    "Huge functions can be harder to optimize."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using eval to ‘optimize’ config — you pay parse every time and lose optimizations.",
    "variant": "warning"
  },
  "example": "function hot(x) { return x + 1; }\nlet s = 0;\nfor (let i = 0; i < 1e5; i++) s = hot(s);\nconsole.log(s);\ntry { eval('function ('); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Warm a function; eval parse error",
  "internals": [
    "Early errors at parse; runtime errors during evaluation.",
    "Deoptimization: type feedback no longer matches.",
    "Lazy parsing / inner-function skipping in V8 for start-up."
  ],
  "takeaways": [
    "Avoid eval/Function() — extra parse, harder optimize.",
    "Keep types stable in hot functions.",
    "Using eval to ‘optimize’ config — you pay parse every time and lose optimizations.",
    "Early errors at parse; runtime errors during evaluation."
  ],
  "revision": [
    "Parsing, AST, Interpreter, JIT: First performance: careful reading (parse). Then walking (interpret). Then sprinting (JIT) until a pothole (deopt).",
    "Avoid eval/Function() — extra parse, harder optimize.",
    "Keep types stable in hot functions.",
    "Parse errors vs runtime errors are different stages.",
    "Trap: Using eval to ‘optimize’ config — you pay parse every time and lose optimizations."
  ],
  "flashcards": [
    [
      "Parsing, AST, Interpreter, JIT",
      "Source is parsed to an AST then bytecode (or similar)."
    ],
    [
      "Mental model",
      "First performance: careful reading (parse). Then walking (interpret). Then sprinting (JIT) until a pothole (deopt)."
    ],
    [
      "Common trap",
      "Using eval to ‘optimize’ config — you pay parse every time and lose optimizations."
    ],
    [
      "Avoid eval/Function() — extra parse, harder optimize.",
      "Keep types stable in hot functions."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Parsing, AST, Interpreter, JIT and where does a beginner first see it?",
      "answerHint": "Source is parsed to an AST then bytecode (or similar). An interpreter runs bytecode. Hot functions are JIT-compiled to machine code with type assumptions. If assumptions fail, the engine deoptimizes back to bytecode. Syntax errors happen at parse; TypeErrors at run."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Parsing, AST, Interpreter, JIT works and name the main pitfall.",
      "answerHint": "Avoid eval/Function() — extra parse, harder optimize. Keep types stable in hot functions. Parse errors vs runtime errors are different stages. Huge functions can be harder to optimize. Pitfall: Using eval to ‘optimize’ config — you pay parse every time and lose optimizations."
    },
    {
      "level": "advanced",
      "question": "How would you explain Parsing, AST, Interpreter, JIT at an interview, including engine/spec details?",
      "answerHint": "Early errors at parse; runtime errors during evaluation. Deoptimization: type feedback no longer matches. Lazy parsing / inner-function skipping in V8 for start-up."
    }
  ],
  "pitfalls": [
    "Using eval to ‘optimize’ config — you pay parse every time and lose optimizations.",
    "Huge functions can be harder to optimize."
  ],
  "interview": {
    "expectations": [
      "Explain Parsing, AST, Interpreter, JIT without mixing it up with a nearby B1.25 — JavaScript Runtime & Engine topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Early errors at parse; runtime errors during evaluation."
    ],
    "commonQuestions": [
      "What is Parsing, AST, Interpreter, JIT?",
      "Why does JavaScript parsing, ast, interpreter, jit behave this way?",
      "What is the classic Parsing, AST, Interpreter, JIT interview trap?"
    ],
    "traps": [
      "Using eval to ‘optimize’ config — you pay parse every time and lose optimizations."
    ],
    "misconceptions": [
      "Start-up wants fast parse+interpret; long-running code wants machine code. JIT is the compromise."
    ],
    "strongSignals": [
      "Separates Parsing, AST, Interpreter, JIT from lookalike APIs and can draw the mental model."
    ]
  }
})
