import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Increment / Decrement",
  "whatIsIt": "++ and -- add or subtract 1 after ToNumeric. Prefix (++x) returns the new value; postfix (x++) returns the old value. They require a reference (a variable or property), not a raw literal. On objects they ToPrimitive first. bigint works; mixed types follow ToNumeric rules.",
  "whyExists": "Loop counters needed a terse update. The prefix/postfix distinction came from C.",
  "mentalModel": "Read, add one, write back. Postfix snapshots the old number to give to the surrounding expression.",
  "how": [
    "Prefer i += 1 or i = i + 1 in team style if postfix confuses readers.",
    "Never use ++ on a const binding.",
    "Do not mix ++ inside larger expressions in interviews — it hides order.",
    "Postfix on obj.x still writes the new value; the expression result is the old one."
  ],
  "callout": {
    "title": "Watch for",
    "text": "arr[i++] = i copies using the old i as index but the new i as value — off-by-one puzzles.",
    "variant": "warning"
  },
  "example": "let i = 0;\nconsole.log(i++, i);\nconsole.log(++i, i);\nconst o = { n: 1 };\nconsole.log(o.n++, o.n);\ntry { const c = 1; c++; } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Prefix vs postfix on bindings and properties",
  "internals": [
    "Postfix: oldValue = ToNumeric(GetValue), PutValue(old+1), result is oldValue.",
    "The left-hand side is evaluated once (important for getters).",
    "Restricted production: newline cannot sit between operand and postfix ++."
  ],
  "takeaways": [
    "Prefer i += 1 or i = i + 1 in team style if postfix confuses readers.",
    "Never use ++ on a const binding.",
    "arr[i++] = i copies using the old i as index but the new i as value — off-by-one puzzles.",
    "Postfix: oldValue = ToNumeric(GetValue), PutValue(old+1), result is oldValue."
  ],
  "revision": [
    "Increment / Decrement: Read, add one, write back. Postfix snapshots the old number to give to the surrounding expression.",
    "Prefer i += 1 or i = i + 1 in team style if postfix confuses readers.",
    "Never use ++ on a const binding.",
    "Do not mix ++ inside larger expressions in interviews — it hides order.",
    "Trap: arr[i++] = i copies using the old i as index but the new i as value — off-by-one puzzles."
  ],
  "flashcards": [
    [
      "Increment / Decrement",
      "++ and -- add or subtract 1 after ToNumeric."
    ],
    [
      "Mental model",
      "Read, add one, write back. Postfix snapshots the old number to give to the surrounding expression."
    ],
    [
      "Common trap",
      "arr[i++] = i copies using the old i as index but the new i as value — off-by-one puzzles."
    ],
    [
      "Prefer i += 1 or i = i + 1 in team style if postfix confuses readers.",
      "Never use ++ on a const binding."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Increment / Decrement and where does a beginner first see it?",
      "answerHint": "++ and -- add or subtract 1 after ToNumeric. Prefix (++x) returns the new value; postfix (x++) returns the old value. They require a reference (a variable or property), not a raw literal. On objects they ToPrimitive first. bigint works; mixed types follow ToNumeric rules."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Increment / Decrement works and name the main pitfall.",
      "answerHint": "Prefer i += 1 or i = i + 1 in team style if postfix confuses readers. Never use ++ on a const binding. Do not mix ++ inside larger expressions in interviews — it hides order. Postfix on obj.x still writes the new value; the expression result is the old one. Pitfall: arr[i++] = i copies using the old i as index but the new i as value — off-by-one puzzles."
    },
    {
      "level": "advanced",
      "question": "How would you explain Increment / Decrement at an interview, including engine/spec details?",
      "answerHint": "Postfix: oldValue = ToNumeric(GetValue), PutValue(old+1), result is oldValue. The left-hand side is evaluated once (important for getters). Restricted production: newline cannot sit between operand and postfix ++."
    }
  ],
  "pitfalls": [
    "arr[i++] = i copies using the old i as index but the new i as value — off-by-one puzzles.",
    "Postfix on obj.x still writes the new value; the expression result is the old one."
  ],
  "interview": {
    "expectations": [
      "Explain Increment / Decrement without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Postfix: oldValue = ToNumeric(GetValue), PutValue(old+1), result is oldValue."
    ],
    "commonQuestions": [
      "What is Increment / Decrement?",
      "Why does JavaScript increment / decrement behave this way?",
      "What is the classic Increment / Decrement interview trap?"
    ],
    "traps": [
      "arr[i++] = i copies using the old i as index but the new i as value — off-by-one puzzles."
    ],
    "misconceptions": [
      "Loop counters needed a terse update. The prefix/postfix distinction came from C."
    ],
    "strongSignals": [
      "Separates Increment / Decrement from lookalike APIs and can draw the mental model."
    ]
  }
})
