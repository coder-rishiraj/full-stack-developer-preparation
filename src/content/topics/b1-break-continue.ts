import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "break / continue",
  "whatIsIt": "break leaves the nearest loop or switch. continue skips to the next iteration of the nearest loop. In for, continue still runs the update expression. In while, it goes back to the test. Labels let them target an outer loop. They are not for skipping try/finally — finally still runs.",
  "whyExists": "Loops need early exit and skip-without-nesting. Labels exist for nested loops that would otherwise need flags.",
  "mentalModel": "break = jump out. continue = jump to the next round. finally still gets a last word.",
  "how": [
    "Prefer refactoring to a function + return before using labels.",
    "Remember continue in for still increments.",
    "break in switch is not continue in a surrounding loop.",
    "Do not use break to exit if — it is a SyntaxError outside loop/switch."
  ],
  "callout": {
    "title": "Watch for",
    "text": "continue inside try still runs finally, then continues — people think finally is skipped.",
    "variant": "warning"
  },
  "example": "let seen = 0;\nfor (let i = 0; i < 5; i++) {\n  if (i === 1) continue;\n  if (i === 4) break;\n  seen += 1;\n}\nconsole.log(seen);\nlet i = 0;\nwhile (i < 3) {\n  i += 1;\n  if (i === 2) continue;\n  console.log('w', i);\n}\n",
  "exampleCaption": "continue skips; break exits; for-update still runs",
  "internals": [
    "BreakableStatement and ContinueStatement with optional LabelIdentifier.",
    "LoopContinues checks abrupt completions of type continue/break.",
    "finally in TryStatement runs on any abrupt completion including break."
  ],
  "takeaways": [
    "Prefer refactoring to a function + return before using labels.",
    "Remember continue in for still increments.",
    "continue inside try still runs finally, then continues — people think finally is skipped.",
    "BreakableStatement and ContinueStatement with optional LabelIdentifier."
  ],
  "revision": [
    "break / continue: break = jump out. continue = jump to the next round. finally still gets a last word.",
    "Prefer refactoring to a function + return before using labels.",
    "Remember continue in for still increments.",
    "break in switch is not continue in a surrounding loop.",
    "Trap: continue inside try still runs finally, then continues — people think finally is skipped."
  ],
  "flashcards": [
    [
      "break / continue",
      "break leaves the nearest loop or switch."
    ],
    [
      "Mental model",
      "break = jump out. continue = jump to the next round. finally still gets a last word."
    ],
    [
      "Common trap",
      "continue inside try still runs finally, then continues — people think finally is skipped."
    ],
    [
      "Prefer refactoring to a function + return before using labels.",
      "Remember continue in for still increments."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is break / continue and where does a beginner first see it?",
      "answerHint": "break leaves the nearest loop or switch. continue skips to the next iteration of the nearest loop. In for, continue still runs the update expression. In while, it goes back to the test. Labels let them target an outer loop. They are not for skipping try/finally — finally still runs."
    },
    {
      "level": "intermediate",
      "question": "Walk through how break / continue works and name the main pitfall.",
      "answerHint": "Prefer refactoring to a function + return before using labels. Remember continue in for still increments. break in switch is not continue in a surrounding loop. Do not use break to exit if — it is a SyntaxError outside loop/switch. Pitfall: continue inside try still runs finally, then continues — people think finally is skipped."
    },
    {
      "level": "advanced",
      "question": "How would you explain break / continue at an interview, including engine/spec details?",
      "answerHint": "BreakableStatement and ContinueStatement with optional LabelIdentifier. LoopContinues checks abrupt completions of type continue/break. finally in TryStatement runs on any abrupt completion including break."
    }
  ],
  "pitfalls": [
    "continue inside try still runs finally, then continues — people think finally is skipped.",
    "Do not use break to exit if — it is a SyntaxError outside loop/switch."
  ],
  "interview": {
    "expectations": [
      "Explain break / continue without mixing it up with a nearby B1.6 — Control Flow topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "BreakableStatement and ContinueStatement with optional LabelIdentifier."
    ],
    "commonQuestions": [
      "What is break / continue?",
      "Why does JavaScript break / continue behave this way?",
      "What is the classic break / continue interview trap?"
    ],
    "traps": [
      "continue inside try still runs finally, then continues — people think finally is skipped."
    ],
    "misconceptions": [
      "Loops need early exit and skip-without-nesting. Labels exist for nested loops that would otherwise need flags."
    ],
    "strongSignals": [
      "Separates break / continue from lookalike APIs and can draw the mental model."
    ]
  }
})
